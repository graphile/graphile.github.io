---
layout: page
path: /postgraphile/make-add-inflectors-plugin/
title: makeAddInflectorsPlugin (graphile-utils)
---

**NOTE: this documentation applies to PostGraphile v4.1.0+**

If you're not happy with the default naming conventions in PostGraphile (or if
you want to extend PostGraphile's functionality and use the inflection system to
do so), you can use `makeAddInflectorsPlugin` from `graphile-utils`.

Please see the [inflection article](/postgraphile/inflection/) for more
information on inflection in PostGraphile.

### Syntax

```ts
interface Inflectors {
  [str: string]: (...args: Array<any>) => string;
}

type InflectorsGenerator = (
  inflection: Inflectors,
  build: Build,
  options: Options
) => Inflectors;

function makeAddInflectorsPlugin(
  additionalInflectorsOrGenerator: Inflectors | InflectorsGenerator,
  replace = false
): Plugin;
```

By default, this plugin is for adding new inflectors; however if you pass `true`
as the second argument then it can be used for replacing (or wrapping) existing
inflectors.

You can pass either a new inflectors object to makeAddInflectorsPlugin, or if
you need to call the previous inflector you're replacing then you can pass an
"inflectors generator" function which will be passed the old inflectors you can
then call into. When you do so, be very careful that you use
`oldInflectors.INFLECTOR_HERE.call(this, ...args)` to ensure that the `this`
binding is correct in the old function; e.g.:

```ts
const { makeAddInflectorsPlugin } = require("graphile-utils");

module.exports = makeAddInflectorsPlugin(
  oldInflection => ({
    enumName(value: string) {
      return oldInflection.enumName.call(this, value.replace(/\./g, "_"));
    },
  }),
  true
);
```

### Example

If you want `*Patch` types to instead be called `*ChangeSet` you could make a
plugin such as this one:

```js{6-8}
// MyInflectionPlugin.js
const { makeAddInflectorsPlugin } = require("graphile-utils");

module.exports = makeAddInflectorsPlugin(
  {
    patchType(typeName: string) {
      return this.upperCamelCase(`${typeName}-change-set`);
    },
  },
  /* Passing true here allows the plugin to overwrite
   * existing inflectors.
   */
  true
);

// Load this plugin with `postgraphile --append-plugins /path/to/MyInflectionPlugin.js`
```

### Where are the default inflectors defined?

The default Graphile Engine inflectors (`pluralize`, `singularize`,
`upperCamelCase`, `camelCase` and `constantCase`) can be found
[in `makeNewBuild.js`](https://github.com/graphile/graphile-engine/blob/v4.4.4/packages/graphile-build/src/makeNewBuild.js#L929-L997).

The additional inflectors used in PostGraphile can be found
[in `PgBasicsPlugin.js`](https://github.com/graphile/graphile-engine/blob/v4.4.4/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L383-L874),
but also
[some other places](<https://github.com/graphile/graphile-engine/search?q="hook inflection">)
There's a lot of them!
