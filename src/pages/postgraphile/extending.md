---
layout: page
path: /postgraphile/extending/
title: Extending PostGraphile
---

## Extending PostGraphile

PostGraphile's schema generator is built from a number of [Graphile Build plugins](/graphile-build/plugins/). The plugins can be found here:

https://github.com/graphile/graphile-build/tree/master/packages/graphile-build-pg/src/plugins

These plugins introduce small amounts of functionality, and build upon each
other. The order in which the plugins are loaded is significant, and can be
found from the `defaultPlugins` export in
[`src/index.js`](https://github.com/graphile/graphile-build/blob/master/packages/graphile-build-pg/src/index.js)
of the `graphile-build-pg` module.

You can extend PostGraphile's GraphQL schema by appending to, prepending to or
even replacing the list of plugins used to build the schema. Graphile Build
plugins are built on top of the [GraphQL reference JS
implementation](http://graphql.org/graphql-js/), so it is recommended that you
have familiarity with that before attempting to add your own plugins.

### Adding root query/mutation fields

A common request is to add additional root-level fields to your schema, for
example to integrate external services. To do this we must add a
'GraphQLObjectType:fields' hook and then add our new field:

```js
// add-http-bin-plugin.js
const fetch = require("node-fetch");

function AddHttpBinPlugin(builder, { pgExtendedTypes }) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields, // Input object - the fields for this GraphQLObjectType
      { extend, getTypeByName }, // Build object - handy utils
      { scope: { isRootQuery } } // Context object - used for filtering
    ) => {
      if (!isRootQuery) {
        // This isn't the object we want to modify:
        // return the input object unmodified
        return fields;
      }

      // We don't want to introduce a new JSON type as that will clash,
      // so let's find the JSON type that other fields use:
      const JSONType = getTypeByName("JSON");

      return extend(fields, {
        httpBinHeaders: {
          type: JSONType,
          async resolve() {
            const response = await fetch("https://httpbin.org/headers");
            if (pgExtendedTypes) {
              // This setting is enabled through postgraphile's
              // `--dynamic-json` option, if enabled return JSON:
              return response.json();
            } else {
              // If Dynamic JSON is not enabled, we want a JSON string instead
              return response.text();
            }
          },
        },
      });
    }
  );
}

module.exports = AddHttpBinPlugin;
```

We can then load our plugin into PostGraphile via:

```
postgraphile -c postgres://localhost/mydb -s myschema --append-plugins `pwd`/add-http-bin-plugin.js
```


