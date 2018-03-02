---
layout: page
path: /postgraphile/usage-schema/
title: Graphile-Build-PG Usage
---

## Usage - Schema Only

The PostGraphile middleware gives you a lot of excellent features for running
your own GraphQL server. However, if you want to execute a PostGraphile query
in Node.js without having to go through HTTP you can use some other exported
functions that PostGraphile provides.

The first function you will need is `createPostGraphileSchema` whose purpose is
to create your PostGraphile schema. This function is asynchronous as it will
need to run the Postgres introspection query in your database.

The function takes very similar arguments to [the `postgraphile`
middleware](/postgraphile/usage-library/).

```js
createPostGraphileSchema(
  process.env.DATABASE_URL || 'postgres://localhost/'
)
  .then(schema => { ... })
  .catch(error => { ... })
```

Now that you have your schema, in order to execute a GraphQL query you must
supply an (authenticated) `pgClient` on the context object. The preferred way
to do this is via the asynchronous `withPostGraphileContext` function. The
context object will contain a PostgreSQL client which has its own transaction
with the correct permission levels for the associated user.

```js
const { Pool } = require('pg');
const { graphql } = require('graphql');
const { withPostGraphileContext } = require('postgraphile');

const myPgPool = new Pool({ ... });

export async function performQuery(
  schema,
  query,
  variables,
  jwtToken,
  operationName
) {
  return await withPostGraphileContext(
    {
      pgPool: myPgPool,
      jwtToken: jwtToken,
      jwtSecret: "...",
      pgDefaultRole: "..."
    },
    async context => {
      // Execute your GraphQL query in this function with the provided
      // `context` object, which should NOT be used outside of this
      // function.
      return await graphql(
        schema, // This is the schema we created with `createPostGraphileSchema`.
        query,
        null,
        { ...context }, // Here we use the `context` object that gets passed to this callback.
        variables,
        operationName
      );
    }
  );
}
```

(The `await` keywords after the `return` statements aren't required, they're just there to clarify the results are promises.)

#### API: `createPostGraphileSchema(pgConfig, schemaName, options)`

This function takes three arguments (all are optional) and returns a promise to a GraphQLSchema object.

* **`pgConfig`**: An object or string that will be passed to the [`pg`][] library and used to connect to a PostgreSQL backend. If you already have a client or pool instance, when using this function you may also pass a `pg` client or a `pg-pool` instance directly instead of a config.
* **`schemaName`**: A string which specifies the PostgreSQL schema that PostGraphile will use to create a GraphQL schema. The default schema is the `public` schema. May be an array for multiple schemas. For users who want to run the Postgres introspection query ahead of time, you may also pass in a `PgCatalog` instance directly.
* **`options`**: An object containing other miscellaneous options. Most options are shared with the `postgraphile` middleware function. Options could be: <!-- SCHEMA_DOCBLOCK_BEGIN -->
  * `watchPg`: When true, PostGraphile will watch your database schemas and re-create the GraphQL API whenever your schema changes, notifying you as it does. This feature requires an event trigger to be added to the database by a superuser. When enabled PostGraphile will try to add this trigger, if you did not connect as a superuser you will get a warning and the trigger won’t be added.
  * `pgDefaultRole`: The default Postgres role to use. If no role was provided in a provided JWT token, this role will be used.
  * `dynamicJson`: Setting this to `true` enables dynamic JSON which will allow you to use any JSON as input and get any arbitrary JSON as output. By default JSON types are just a JSON string.
  * `setofFunctionsContainNulls`: If none of your `RETURNS SETOF compound_type` functions mix NULLs with the results then you may set this true to reduce the nullables in the GraphQL schema
  * `classicIds`: Enables classic ids for Relay support. Instead of using the field name `nodeId` for globally unique ids, PostGraphile will instead use the field name `id` for its globally unique ids. This means that table `id` columns will also get renamed to `rowId`.
  * `disableDefaultMutations`: Setting this to `true` will prevent the creation of the default mutation types & fields. Database mutation will only be possible through Postgres functions.
  * `showErrorStack`: Enables adding a `stack` field to the error response.  Can be either the boolean `true` (which results in a single stack string) or the string `json` (which causes the stack to become an array with elements for each line of the stack).
  * `extendedErrors`: Extends the error response with additional details from the Postgres error.  Can be any combination of `['hint', 'detail', 'errcode']`. Default is `[]`.
  * `appendPlugins`: an array of [Graphile Build](/graphile-build/plugins/) plugins to load after the default plugins
  * `prependPlugins`: an array of [Graphile Build](/graphile-build/plugins/) plugins to load before the default plugins (you probably don't want this)
  * `replaceAllPlugins`: the full array of [Graphile Build](/graphile-build/plugins/) plugins to use for schema generation (you almost definitely don't want this!)
  * `readCache`: A file path string. Reads cached values from local cache file to improve startup time (you may want to do this in production).
  * `writeCache`: A file path string. Writes computed values to local cache file so startup can be faster (do this during the build phase).
  * `jwtSecret`: The secret for your JSON web tokens. This will be used to verify tokens in the `Authorization` header, and signing JWT tokens you return in procedures.
  * `jwtPgTypeIdentifier`: The Postgres type identifier for the compound type which will be signed as a JWT token if ever found as the return type of a procedure. Can be of the form: `my_schema.my_type`. You may use quotes as needed: `"my-special-schema".my_type`.
  * `legacyRelations`: Some one-to-one relations were previously detected as one-to-many - should we export 'only' the old relation shapes, both new and old but mark the old ones as 'deprecated', or 'omit' the old relation shapes entirely
  * `legacyJsonUuid`: ONLY use this option if you require the v3 typenames 'Json' and 'Uuid' over 'JSON' and 'UUID'

<!-- SCHEMA_DOCBLOCK_END -->

#### API: `watchPostGraphileSchema(pgConfig, schemaName, options, onNewSchema)`

This function is takes the same options as `createPostGraphileSchema`; but with
one addition: a function `onNewSchema` that is called every time a new schema
is generated. `onNewSchema` is guaranteed to be called before the
`watchPostGraphileSchema` promise resolves. It resolves to an asynchronus
function that can be called to stop listening for schema changes.

#### API: `withPostGraphileContext(options, callback)`

This function sets up a PostGraphile context, calls (and resolves) the callback
function within this context, and then tears the context back down again
finally resolving to the result of your function (which should be a
GraphQLExecutionResult from executing a `graphql()` query).

* **`options`**: An object of options that are used to create the context object that gets passed into `callback`.
  * `pgPool`: A required instance of a Postgres pool from [`pg-pool`][]. A Postgres client will be connected from this pool.
  * `jwtToken`: An optional JWT token string. This JWT token represents the viewer of your PostGraphile schema. You might get this from the Authorization header.
  * `jwtSecret`: see 'jwtSecret' above
  * `jwtAudiences`: see 'jwtAudiences' above
  * `jwtRole`: see 'jwtRole' in the library documentation
  * `jwtVerifyOptions`: see 'jwtVerifyOptions' in the library documentation
  * `pgDefaultRole`: see 'pgDefaultRole' in the library documentation
  * `pgSettings`: A plain object specifying custom config values to set in the PostgreSQL transaction (accessed via `current_setting('my.custom.setting')`) - do _NOT_ provide a function unlike with the library options
* **`callback`**: The function which is called with the `context` object which was created. Whatever the return value of this function is will be the return value of `withPostGraphileContext`.

### Even lower level access

If you really want to get into the nitty-gritty of what's going on, then take a
look at the `postgraphile-core` and `graphile-build-pg` modules.

[graphql-js]: https://www.npmjs.com/package/graphql
[`pg-pool`]: https://www.npmjs.com/package/pg-pool
