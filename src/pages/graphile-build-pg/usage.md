---
layout: page
path: /graphile-build-pg/usage/
title: Graphile-Build-PG Usage
---

## Usage

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
