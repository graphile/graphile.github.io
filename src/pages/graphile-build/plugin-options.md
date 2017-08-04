---
layout: page
path: /graphile-build/plugin-options/
title: Plugin Options
---

## Plugin Options

The second argument to `buildSchema` is [the
options](/graphile-build/plugin-options/) which are made available to every
plugin (as their second argument).

### Supported Options

The following options apply to the default plugins:

- `nodeIdFieldName` - defaults to `id` which might clash with your other
  fields. It is not recommended to change it, but you might consider `nodeId`
  instead. (Use of `__id` is discouraged because GraphQL wants to deprecate
  non-introspection fields that begin with `__`)

Plugins may define further options if they wish.

### Example

The following example passes the
`nodeIdFieldName` setting through, changing from the default `id` to `flibble`:

<!-- source: examples/empty-schema-with-options.js -->
```js
const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

buildSchema(defaultPlugins, { nodeIdFieldName: "flibble" }).then(schema => {
  console.log(printSchema(schema));
});
```

which modifies the Node interface thusly:

```graphql
interface Node {
  # A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  flibble: ID!
}
```

