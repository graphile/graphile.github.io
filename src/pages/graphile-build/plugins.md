---
layout: page
path: /graphile-build/plugins/
title: Plugins
---

## Plugins

Almost everything in Graphile-Build is accomplished through plugins. You can
add plugins, remove plugins, even replace the entire stack if you so desire.

### Loading Plugins

Graphile-Build plugins are simple functions that interact with [the
`SchemaBuilder`](/graphile-build/schema-builder/), for example adding hooks.
When you perform [`buildSchema(plugins)`](/graphile-build/graphile-build/) we
create a new `SchemaBuilder` instance and then load each of the plugins against
it.

The plugins are loaded in the order specified, if a plugin returns a Promise
(e.g. an asynchronous plugin) then we will wait for that promise to resolve
before continuing to load the next plugin, otherwise we will assume the plugin
is synchronous.

An example of a plugin that does nothing is this no-op plugin:

```js
function NoopPlugin(builder) {
  console.log("I don't do anything");
}
```

which you can load into your schema like so:

```js
const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

buildSchema([...defaultPlugins, NoopPlugin]).then(schema => {
  console.log(printSchema(schema));
});
```

<details>
<summary>View output</summary>

```
I don't do anything
# An object with a globally unique `ID`.
interface Node {
  # A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  id: ID!
}

# The root query type which gives access points into the data universe.
type Query implements Node {
  # Exposes the root query type nested one level down. This is helpful for Relay 1
  # which can only query top level fields if they are in a particular form.
  query: Query!

  # The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.
  id: ID!

  # Fetches an object given its globally unique `ID`.
  node(
    # The globally unique `ID`.
    id: ID!
  ): Node
}
```

</details>

### Plugin arguments

Plugins are called with just two arguments:

- `builder` - the instance of [`SchemaBuilder`](/graphile-build/graphile-build/) the plugin is being loaded against
- `options` - [the options](/graphile-build/plugin-options/) that were passed to `buildSchema(plugins, options)` (or `getBuilder(plugins, options)`)

### Plugin actions

Whilst a plugin is being executed it can perform actions on the `builder`
object (its first argument). For a list of the functions and what they do, see
[SchemaBuilder](/graphile-build/schema-builder/).

The most common actions are:

- Register a hook: `builder.hook(hookName, hookFunction)`; see [Hooks](/graphile-build/hooks/)
- Add watch-mode event listeners: `builder.registerWatcher(watcher, unwatcher)`; see [SchemaBuilder](/graphile-build/schema-builder/)
