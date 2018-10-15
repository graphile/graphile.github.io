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

The first function you will need is `createPostGraphileSchema` (or
`watchPostGraphileSchema` if you want to get a new schema each time the
database is updated) which creates your PostGraphile GraphQL schema by
introspecting your database.

The function takes very similar arguments to [the `postgraphile`
middleware](/postgraphile/usage-library/).

```js
createPostGraphileSchema(
  process.env.DATABASE_URL || 'postgres:///'
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
        schema, // The schema from `createPostGraphileSchema`
        query,
        null,
        { ...context }, // You can add more to context if you like
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

The returned GraphQLSchema will **not** be updated when your database changes - if you require "watch" functionality, please use `watchPostGraphileSchema` instead (see below).

* **`pgConfig`**: An object or string that will be passed to the [`pg`][] library and used to connect to a PostgreSQL backend. If you already have a client or pool instance, when using this function you may also pass a `pg` client or a `pg-pool` instance directly instead of a config.
* **`schemaName`**: A string which specifies the PostgreSQL schema that PostGraphile will use to create a GraphQL schema. The default schema is the `public` schema. May be an array for multiple schemas. For users who want to run the Postgres introspection query ahead of time, you may also pass in a `PgCatalog` instance directly.
* **`options`**: An object containing other miscellaneous options. Most options are shared with the `postgraphile` middleware function. Options could be: <!-- SCHEMA_DOCBLOCK_BEGIN -->
  * `pgDefaultRole`: The default Postgres role to use. If no role was provided in a provided JWT token, this role will be used.
  * `dynamicJson`: By default, JSON and JSONB fields are presented as strings (JSON encoded) from the GraphQL schema. Setting this to `true` (recommended) enables raw JSON input and output, saving the need to parse / stringify JSON manually.
  * `setofFunctionsContainNulls`: If none of your `RETURNS SETOF compound_type` functions mix NULLs with the results then you may set this true to reduce the nullables in the GraphQL schema.
  * `classicIds`: Enables classic ids for Relay support. Instead of using the field name `nodeId` for globally unique ids, PostGraphile will instead use the field name `id` for its globally unique ids. This means that table `id` columns will also get renamed to `rowId`.
  * `disableDefaultMutations`: Setting this to `true` will prevent the creation of the default mutation types & fields. Database mutation will only be possible through Postgres functions.
  * `ignoreRBAC`: Set false (recommended) to exclude fields, queries and mutations that the user isn't permitted to access from the generated GraphQL schema; set this option true to skip these checks and create GraphQL fields and types for everything. The default is `true`, in v5 the default will change to `false`.
  * `includeExtensionResources`: By default, tables and functions that come from extensions are excluded from the generated GraphQL schema as general applications don't need them to be exposed to the end user. You can use this flag to include them in the generated schema (not recommended).
  * `showErrorStack`: Enables adding a `stack` field to the error response.  Can be either the boolean `true` (which results in a single stack string) or the string `json` (which causes the stack to become an array with elements for each line of the stack). Recommended in development, not recommended in production.
  * `extendedErrors`: Extends the error response with additional details from the Postgres error.  Can be any combination of `['hint', 'detail', 'errcode']`. Default is `[]`.
  * `appendPlugins`: An array of [Graphile Engine](/graphile-build/plugins/) schema plugins to load after the default plugins.
  * `prependPlugins`: An array of [Graphile Engine](/graphile-build/plugins/) schema plugins to load before the default plugins (you probably don't want this).
  * `replaceAllPlugins`: The full array of [Graphile Engine](/graphile-build/plugins/) schema plugins to use for schema generation (you almost definitely don't want this!).
  * `skipPlugins`: An array of [Graphile Engine](/graphile-build/plugins/) schema plugins to skip.
  * `readCache`: A file path string. Reads cached values from local cache file to improve startup time (you may want to do this in production).
  * `writeCache`: A file path string. Writes computed values to local cache file so startup can be faster (do this during the build phase).
  * `jwtSecret`: The secret for your JSON web tokens. This will be used to verify tokens in the `Authorization` header, and signing JWT tokens you return in procedures.
  * `jwtPgTypeIdentifier`: The Postgres type identifier for the compound type which will be signed as a JWT token if ever found as the return type of a procedure. Can be of the form: `my_schema.my_type`. You may use quotes as needed: `"my-special-schema".my_type`.
  * `legacyRelations`: Some one-to-one relations were previously detected as one-to-many - should we export 'only' the old relation shapes, both new and old but mark the old ones as 'deprecated' (default), or 'omit' (recommended) the old relation shapes entirely.
  * `legacyJsonUuid`: ONLY use this option if you require the v3 typenames 'Json' and 'Uuid' over 'JSON' and 'UUID'.
  * `simpleCollections`: Should we use relay pagination, or simple collections? "omit" (default) - relay connections only, "only" (not recommended) - simple collections only (no Relay connections), "both" - both.

<!-- SCHEMA_DOCBLOCK_END -->

#### API: `watchPostGraphileSchema(pgConfig, schemaName, options, onNewSchema)`

This function is takes the same options as `createPostGraphileSchema`; but with
one addition: a function `onNewSchema` that is called every time a new schema
is generated, passing the new schema as the first argument. `onNewSchema` is
guaranteed to be called before the `watchPostGraphileSchema` promise resolves.
It resolves to an asynchronus function that can be called to stop listening for
schema changes.

<!-- // TODO: check this works! -->

```js
async function main() {
  let graphqlSchema;
  const releaseWatcher = await watchPostGraphileSchema(
    pgPool,
    pgSchemas,
    options,
    newSchema => {
      console.log("Generated new GraphQL schema");
      graphqlSchema = newSchema;
    }
  );
  // graphqlSchema is **guaranteed** to be set here.

  // ... do stuff with graphqlSchema

  await releaseWatcher();
}
```

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
