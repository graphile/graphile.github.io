---
layout: page
path: /postgraphile/make-process-schema-plugin/
title: makeProcessSchemaPlugin
---

## makeProcessSchemaPlugin

**NOTE: this documentation applies to PostGraphile v4.1.0+**

This plugin enables a way of processing the schema after it's built.

Use cases include:

- Printing the schema SDL to a file
- Uploading the schema SDL to a network service
- Checking the schema against your persisted queries
- Validating the schema against your custom logic
- Replacing the schema with a mocked version or a derivative version (e.g. stitching it with another schema)
- Integrating with third-party libraries such as `graphql-middleware` or `graphql-shield` which mutate the GraphQLSchema after it has been constructed

The plugin accepts one argument: a schema processing function which will be called with the generated schema and must either return the same schema (e.g. if you're doing a read-only operation, or mutating the schema directly) or return an alternative schema (e.g. a derivative).

### Example

```js
require("graphile-utils");

module.exports = makeProcessSchemaPlugin(schema => {
  return addThirdPartyEnhancementsToSchema(schema);
});
```

You can also use `makeProcessSchemaPlugin` to replace the current schema with a stitched schema and run it from within the PostGraphile server:

```js
require("graphile-utils");

module.exports = makeProcessSchemaPlugin(schema => {
  return stitchOtherSchemasInto(schema);
});
```
