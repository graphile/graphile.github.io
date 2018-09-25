---
layout: page
path: /postgraphile/testing-jest/
title: Testing with Jest
---

## Testing with Jest

### Testing the database functions

You can think of this as your "unit tests" - simply spin up a transaction, set
any relevant Postgres settings (e.g. `jwt.claims.user_id`), run the SQL you
want to test, check the results, and then rollback the transaction.

<details>
<summary>(Click to expand.) Create some helpers in <tt>test_helpers.js</tt>. </summary>

```js
import { Pool } from "pg";

const pools = {};

// Make sure we release those pgPools so that our tests exit!
afterAll(() => {
  const keys = Object.keys(pools);
  return Promise.all(
    keys.map(async key => {
      try {
        const pool = pools[key];
        delete pools[key];
        await pool.end();
      } catch (e) {
        console.error("Failed to release connection!");
        console.error(e);
      }
    })
  );
});

const withDbFromUrl = async (url, fn) => {
  if (!pools[url]) {
    pools[url] = new Pool({ connectionString: url });
  }
  const pool = pools[url];
  const client = await pool.connect();
  await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE;");

  try {
    await fn(client);
  } catch (e) {
    // Error logging can be helpful:
    if (typeof e.code === "string" && e.code.match(/^[0-9A-Z]{5}$/)) {
      console.error([e.message, e.code, e.detail, e.hint, e.where].join("\n"));
    }
    throw e;
  } finally {
    await client.query("ROLLBACK;");
    await client.query("RESET ALL;"); // Shouldn't be necessary, but just in case...
    await client.release();
  }
};

export const withRootDb = fn =>
  withDbFromUrl(process.env.TEST_DATABASE_URL, fn);

// You'll want to replace this with your own version
exports.becomeUser = (client, userOrUserId = null) =>
  client.query(
    "select set_config('role', $1, true), set_config('jwt.claims.user_id', $2, true);",
    ["app_visitor", userOrUserId ? userOrUserId.id || userOrUserId : null]
  );

// Enables multiple calls to `createUsers` within the same test to still have
// deterministic results without conflicts.
let userCreationCounter = 0;
beforeEach(() => {
  userCreationCounter = 0;
});

// You'll want to replace this with your own version!
exports.createUsers = async function createUsers(client, count) {
  const users = [];
  if (userCreationCounter > 25) {
    throw new Error("Too many users created!");
  }
  const userLetter = "abcdefghijklmnopqrstuvwxyz"[userCreationCounter];
  for (let i = 0; i < count; i++) {
    let { rows: [user] } = await client.query(
      "SELECT * FROM app_private.register_user_by_email($1)",
      [`${userLetter}${i || ""}@b.c`]
    );
    expect(user.id).not.toBeNull();
    users.push(user);
  }
  userCreationCounter++;
  return users;
};
```

</details>

Then a test file could be like:

```js{3-13}
import { becomeUser, createUsers, withRootDb } from "../test_helpers";

test("can delete self", () =>
  withRootDb(async pgClient => {
    const [user] = await createUsers(pgClient, 1);

    await becomeUser(pgClient, user);
    const { rows: [deletedUser] } = await pgClient.query(
      "delete from app_public.users where id = $1 returning *",
      [user.id]
    );
    expect(deletedUser).toBeTruthy();
  }));
```

### Testing the GraphQL middleware

These are more integration tests - they pretend to go through the middleware
(exercising pgSettings / JWT / etc) and you can place assertions on the
results.

In your `server.js` (or wherever), export your PostGraphile options:

```js{6-11,17}
const express = require("express");
const { postgraphile } = require("postgraphile");

const app = express();

function postgraphileOptions() {
  return {
    dynamicJson: true
  };
}
exports.postgraphileOptions = postgraphileOptions;

app.use(
  postgraphile(
    process.env.DATABASE_URL || "postgres://localhost/",
    ["app_public"],
    postgraphileOptions()
  )
);

app.listen(process.env.PORT || 3000);
```

<details>
<summary>(Click to expand.) Create a <tt>test_helper.js</tt> file for running your queries,
responsible for importing options from `server.js`, and setting up/tearing down
the transaction.  </summary>

```js
const pg = require("pg");
const {
  createPostGraphileSchema,
  withPostGraphileContext,
} = require("postgraphile");
const { graphql } = require("graphql");
const MockReq = require("mock-req");
const MockRes = require("mock-res");

const { postgraphileOptions } = require("../../server/middleware/postgraphile");

// This is the role that your normal PostGraphile connection string would use,
// e.g. `postgres://POSTGRAPHILE_AUTHENTICATOR_ROLE:password@host/db`
const POSTGRAPHILE_AUTHENTICATOR_ROLE = "app_authenticator";

/*
 * This function replaces values that are expected to change with static
 * placeholders so that our snapshot testing doesn't throw an error
 * every time we run the tests because time has ticked on in it's inevitable
 * march toward the future.
 */
const sanitise = json => {
  if (Array.isArray(json)) {
    return json.map(el => sanitise(el));
  } else if (json && typeof json === "object") {
    const result = {};
    for (const k in json) {
      if (k === "nodeId") {
        result[k] = "[nodeId]";
      } else if (
        k === "id" ||
        (k.endsWith("Id") && typeof json[k] === "number")
      ) {
        result[k] = "[id]";
      } else if (
        (k.endsWith("At") || k === "datetime") &&
        typeof json[k] === "string"
      ) {
        result[k] = "[timestamp]";
      } else if (
        k.match(/^deleted[A-Za-z0-9]+Id$/) &&
        typeof json[k] === "string"
      ) {
        result[k] = "[nodeId]";
      } else {
        result[k] = sanitise(json[k]);
      }
    }
    return result;
  } else {
    return json;
  }
};

// Contains the PostGraphile schema and rootPgPool
let ctx;

exports.setup = async () => {
  const rootPgPool = new pg.Pool({
    connectionString: process.env.TEST_ROOT_DATABASE_URL,
  });

  const options = postgraphileOptions();
  const schema = await createPostGraphileSchema(
    rootPgPool,
    "app_public",
    options
  );

  // Store the context
  ctx = {
    rootPgPool,
    options,
    schema,
  };
};

exports.teardown = async () => {
  try {
    if (!ctx) {
      return null;
    }
    const { rootPgPool } = ctx;
    ctx = null;
    await rootPgPool.end();
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

exports.runGraphQLQuery = async function runGraphQLQuery(
  query, // The GraphQL query string
  variables, // The GraphQL variables
  reqOptions, // Any additional items to set on `req` (e.g. `{user: {id: 17}}`)
  checker = () => {} // Place test assertions in this function
) {
  const { schema, rootPgPool, options } = ctx;
  const req = new MockReq({
    url: options.graphqlRoute || "/graphql",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...reqOptions,
  });

  const { pgSettings: pgSettingsGenerator } = options;
  const pgSettings =
    typeof pgSettingsGenerator === "function"
      ? await pgSettingsGenerator(req)
      : pgSettingsGenerator;

  await withPostGraphileContext(
    {
      ...options,
      pgPool: rootPgPool,
      pgSettings,
    },
    async context => {
      /* BEGIN: pgClient REPLACEMENT */
      // We're not going to use the `pgClient` that came with
      // `withPostGraphileContext` because we want to ROLLBACK at the end. So
      // we need to replace it, and re-implement the settings logic. Sorry.

      const replacementPgClient = await rootPgPool.connect();
      await replacementPgClient.query("begin");
      await replacementPgClient.query(
        `select set_config('role', POSTGRAPHILE_AUTHENTICATOR_ROLE, true)`
      );

      const localSettings = new Map();

      // Set the custom provided settings before jwt claims and role are set
      // this prevents an accidentional overwriting
      if (typeof pgSettings === "object") {
        for (const key of Object.keys(pgSettings)) {
          localSettings.set(key, String(pgSettings[key]));
        }
      }

      // If there is at least one local setting.
      if (localSettings.size !== 0) {
        // Actually create our query.
        const values = [];
        const sqlQuery = `select ${Array.from(localSettings)
          .map(([key, value]) => {
            values.push(key);
            values.push(value);
            return `set_config($${values.length - 1}, $${values.length}, true)`;
          })
          .join(", ")}`;

        // Execute the query.
        await replacementPgClient.query(sqlQuery, values);
      }
      /* END: pgClient REPLACEMENT */

      let checkResult;
      try {
        // This runs our GraphQL query, passing the replacement client
        const result = await graphql(
          schema,
          query,
          null,
          {
            ...context,
            pgClient: replacementPgClient,
          },
          variables
        );
        // Expand errors
        if (result.errors) {
          // This does a similar transform that PostGraphile does to errors.
          // It's not the same. Sorry.
          // TODO: use `handleErrors` instead, if present
          result.errors = result.errors.map(rawErr => {
            const e = {
              message: rawErr.message,
              locations: rawErr.locations,
              path: rawErr.path,
            };
            Object.defineProperty(e, "originalError", {
              value: rawErr.originalError,
              enumerable: false,
            });

            if (e.originalError) {
              Object.keys(e.originalError).forEach(k => {
                try {
                  e[k] = e.originalError[k];
                } catch (err) {
                  // Meh.
                }
              });
            }
            return e;
          });
        }

        // This is were we call the `checker` so you can do your assertions.
        // Also note that we pass the `replacementPgClient` so that you can
        // query the data in the database from within the transaction before it
        // gets rolled back.
        checkResult = await checker(result, { pgClient: replacementPgClient });

        // You don't have to keep this, I just like knowing when things change!
        expect(sanitise(result)).toMatchSnapshot();
      } finally {
        // Rollback the transaction so no changes are written to the DB - this
        // makes our tests fairly deterministic.
        await replacementPgClient.query("rollback");
        replacementPgClient.release();
      }
      return checkResult;
    }
  );
};
```

</details>

Your test might look something like this:

```js{9,24-25}
const { setup, teardown, runGraphQLQuery } = require("../test_helper");

beforeAll(setup);
afterAll(teardown);

test("GraphQL query nodeId", () => {
  await runGraphQLQuery(
    // GraphQL query goes here:
    `{ nodeId }`,

    // GraphQL variables go here:
    {},

    // Any additional properties you want `req` to have (e.g. if you're using
    // `pgSettings`) go here:
    {
      // Assuming you're using Passport.js / pgSettings, you could pretend
      // to be logged in by setting `req.user` to `{id: 17}`:
      user: { id: 17 }
    },

    // This function runs all your test assertions:
    async (json, { pgClient }) => {
      expect(json.errors).toBeFalsy();
      expect(json.data.nodeId).toBeTruthy();

      // If you need to, you can query the DB within the context of this
      // function - e.g. to check that your mutation made the changes you'd
      // expect.
      const { rows } = await pgClient.query(
        `SELECT * FROM app_public.users WHERE id = $1`,
        [17]
      );
      if (rows.length !== 1) {
        throw new Error("User not found!");
      }
    }
  );
});
```
