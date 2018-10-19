---
layout: page
path: /postgraphile/make-add-inflectors-plugin/
title: graphile-utils makeAddInflectorsPlugin
---

## makeAddInflectorsPlugin (graphile-utils)

**NOTE: this documentation applies to PostGraphile v4.1.0+**

If you're not happy with the default naming conventions in PostGraphile (or if you
want to extend PostGraphile's functionality and use the inflection system to do
so), you can use `makeAddInflectorsPlugin` from `graphile-utils`.

Please see the [inflection article](/postgraphile/inflection/) for more information
on inflection in PostGraphile.

### Example

If you want `*Patch` types to instead be called `*ChangeSet`
you could make a plugin such as this one:

```js{5-7}
// MyInflectionPlugin.js
const { makeAddInflectorsPlugin } = require("graphile-utils");

module.exports = makeAddInflectorsPlugin({
  patchType(typeName: string) {
    return this.upperCamelCase(`${typeName}-change-set`);
  },
}, true); // Passing true here allows the plugin to overwrite
          // existing inflectors.

// Load this plugin with `postgraphile --append-plugins /path/to/MyInflectionPlugin.js`
```

### Where are the default inflectors defined?

The default Graphile Engine inflectors (`pluralize`, `singularize`,
`upperCamelCase`, `camelCase` and `constantCase`) can be found
[in makeNewBuild.js](https://github.com/graphile/graphile-engine/blob/6b0cb9e4e91050c98f1a9c62b73e3613a6c78f09/packages/graphile-build/src/makeNewBuild.js#L811-L815).

The additional inflectors used in PostGraphile can be found [in
PgBasicsPlugin.js](https://github.com/graphile/graphile-engine/blob/6b0cb9e4e91050c98f1a9c62b73e3613a6c78f09/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L296-L699).
There's a lot of them!
