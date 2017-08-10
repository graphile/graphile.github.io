---
layout: page
path: /postgraphile/usage-schema/
title: Graphile-Build-PG Usage
---

## Usage - Schema Only

:warning: This usage does NOT provide authentication/authorisation out of the box - please carefully read the rest of the article :warning:

It's recommended that you consume these plugins via the
[`postgraphile-core`](https://github.com/graphile/graphile-build/tree/master/packages/postgraphile-core)
module which is used internally by
[`PostGraphQL`](https://github.com/postgraphql/postgraphql). This module is
fairly small and exposes the following methods:

- `createPostGraphQLSchema(pgConfig, schemas, options)` - returns a promise to a GraphQL schema
- `watchPostGraphQLSchema(pgConfig, schemas, options, onNewSchema)` - returns a
  promise that returns a `release` function that you can call to stop watching;
  the `onNewSchema` callback will be called every time a new schema is
  generated, and it is guaranteed to be called before the promise resolves.

If you prefer to use the plugins yourself it's advised that you use the
`defaultPlugins` export from `graphile-build-pg` and then create a new array
based on that into which you may insert or remove specific plugins. This is
because it is ordered in a way to ensure the plugins work correctly (and we may
still split up or restructure the plugins within it).

### `defaultPlugins`

An array of graphql-build plugins in the correct order to generate a
well-thought-out GraphQL object tree based on your PostgreSQL schema. This is
the array that `postgraphile-core` uses.

### `inflections`

This is a list of inflection engines, we currently have the following:

- `defaultInflection` - a sensible default
- `postGraphQLInflection` - as above, but enums get converted to `CONSTANT_CASE`
- `postGraphQLClassicIdsInflection` - as above, but `id` attributes get renamed to `rowId` to prevent conflicts with `id` from the Relay Global Unique Object Specification.

### Manual usage

```js
import { defaultPlugins, getBuilder } from "graphile-build";
import {
  defaultPlugins as pgDefaultPlugins,
  inflections: {
    defaultInflection,
  },
} from "graphile-build-pg";

async function getSchema(pgConfig = process.env.DATABASE_URL, pgSchemas = ['public'], additionalPlugins = []) {
  return getBuilder(
    [
      ...defaultPlugins,
      ...pgDefaultPlugins,
      ...additionalPlugins
    ],
    {
      pgConfig,
      pgSchemas,
      pgExtendedTypes: true,
      pgInflection: defaultInflection,
    }
  );
}
```

### Custom Execution

The PostGraphile middleware gives you a lot of excellent features for running your own GraphQL server. However, if you want to execute a PostGraphile query in Node.js without having to go through HTTP you can use some other exported functions that PostGraphile provides.

The first function you will need is `createPostGraphQLSchema` whose purpose is to create your PostGraphile schema. This function is asynchronous as it will need to run the Postgres introspection query in your database.

The function takes very similar arguments to the `postgraphile` middleware function we discussed above:

```js
createPostGraphQLSchema('postgres://localhost:5432')
  .then(schema => { ... })
  .catch(error => { ... })
```

Now that you have your schema, in order to execute a GraphQL query you will need to get a PostGraphile context object with `withPostGraphQLContext`. The context object will contain a Postgres client which has its own transaction with the correct permission levels for the associated user.

You will also need a Postgres pool from the [`pg-pool`][] module.

`withPostGraphQLContext`, like `createPostGraphQLSchema`, will also return a promise.

```js
import { Pool } from 'pg-pool'
import { graphql } from 'graphql'
import { withPostGraphQLContext } from 'postgraphile'

const myPgPool = new Pool({ ... })

const result = await withPostGraphQLContext(
  {
    pgPool: myPgPool,
    jwtToken: '...',
    jwtSecret: '...',
    pgDefaultRole: '...',
  },
  async context => {
    // You execute your GraphQL query in this function with the provided `context` object.
    // The `context` object will not work for a GraphQL execution outside of this function.
    return await graphql(
      myPostGraphQLSchema, // This is the schema we created with `createPostGraphQLSchema`.
      query,
      null,
      { ...context }, // Here we use the `context` object that gets passed to this callback.
      variables,
      operationName,
    )
  },
)
```

The exact APIs for `createPostGraphQLSchema` and `withPostGraphQLContext` are as follows.

#### `createPostGraphQLSchema(pgConfig?, schemaName? = 'public', options?): Promise<GraphQLSchema>`

Arguments include:

- **`pgConfig`**: An object or string that will be passed to the [`pg`][] library and used to connect to a PostgreSQL backend. If you already have a client or pool instance, when using this function you may also pass a `pg` client or a `pg-pool` instance directly instead of a config.
- **`schemaName`**: A string which specifies the PostgreSQL schema that PostGraphile will use to create a GraphQL schema. The default schema is the `public` schema. May be an array for multiple schemas. For users who want to run the Postgres introspection query ahead of time, you may also pass in a `PgCatalog` instance directly.
- **`options`**: An object containing other miscellaneous options. Most options are shared with the `postgraphile` middleware function. Options could be:
  - `classicIds`: Enables classic ids for Relay 1 support. Instead of using the field name `nodeId` for globally unique ids, PostGraphile will instead use the field name `id` for its globally unique ids. This means that table `id` columns will also get renamed to `rowId`.
  - `dynamicJson`: Setting this to `true` enables dynamic JSON which will allow you to use any JSON as input and get any arbitrary JSON as output. By default JSON types are just a JSON string.
  - `jwtSecret`: The JWT secret that will be used to sign tokens returned by the type created with the `jwtPgTypeIdentifier` option.
  - `jwtPgTypeIdentifier`: The Postgres type identifier for the compound type which will be signed as a JWT token if ever found as the return type of a procedure. Can be of the form: `my_schema.my_type`. You may use quotes as needed: `"my-special-schema".my_type`.
  - `disableDefaultMutations`: Setting this to `true` will prevent the creation of the default mutation types & fields. Database mutation will only be possible through Postgres functions.

#### `withPostGraphQLContext(options, callback): Promise<GraphQLExecutionResult>`

This function sets up a PostGraphile context, calls (and resolves) the callback function within this context, and then tears the context back down again finally resolving to the result of your function. The callback is expected to return a promise which resolves to a GraphQL execution result. The context you get as an argument to `callback` will be invalid anywhere outside of the `callback` function.

- **`options`**: An object of options that are used to create the context object that gets passed into `callback`.
  - `pgPool`: A required instance of a Postgres pool from [`pg-pool`][]. A Postgres client will be connected from this pool.
  - `jwtToken`: An optional JWT token string. This JWT token represents the viewer of your PostGraphile schema.
  - `jwtSecret`: The secret for your JSON web tokens. This will be used to verify the `jwtToken`.
  - `pgDefaultRole`: The default Postgres role that will be used if no role was found in `jwtToken`. It is a best security practice to always have a value for this option even though it is optional.
  - `pgSettings`: Custom config values to set in PostgreSQL (accessed via `current_setting('my.custom.setting')`)
- **`callback`**: The function which is called with the `context` object which was created. Whatever the return value of this function is will be the return value of `withPostGraphQLContext`.

[GraphQL-js]: https://www.npmjs.com/package/graphql
[`pg-pool`]: https://www.npmjs.com/package/pg-pool
