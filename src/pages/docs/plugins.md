---
layout: page
path: /graphile-build/plugins/
title: Plugins
---

## Plugins

### Loading Plugins

Graphile-Build plugins are simple functions that interact with the
`SchemaBuilder` (TODO: link to SchemaBuilder docs), for example adding hooks.
When you perform `buildSchema(plugins)` we create a new SchemaBuilder instance
and then load each of the plugins against it.

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

- `builder` - the instance of `SchemaBuilder` the plugin is being loaded against
- `options` - the options that were passed to `buildSchema(plugins, options)` (or `getBuilder(plugins, options)`)

### Plugin actions:

Whilst a plugin is being executed it can perform the following actions on the
`builder` object (its first argument):

#### `builder.hook(name, fn)`: Register a hook

The plugin may add a hook by calling `builder.hook(hookName, hookFunction)`. 


Example: this hook will log the name of each GraphQLObjectType that is built:

```js
function GraphQLObjectTypeLogNamePlugin(builder) {
  builder.hook('GraphQLObjectType', (spec) => {
    console.log(
      "A new GraphQLObjectType is being constructed with name: ",
      spec.name
    );
  })
}
```

#### `builder.registerWatcher(watcher, unwatcher)`: Add watch-mode event listeners

Registers two functions: one to be called if/when schema watching begins, and
another to be called if/when schema watching ends (to clean up). Each function
is passed one argument: the function to call when a change occurs

Schema watching only occurs when you opt into that functionality.

TODO: document further (ref: https://github.com/graphile/graphile-build/blob/3d5b8dd8a280397744f03fbac60319e9f782a038/packages/graphile-build/__tests__/watch.test.js#L31-L38)

```js
builder.registerWatcher(
  triggerRebuild => {
    eventEmitter.on("change", triggerRebuild);
  },
  triggerRebuild => {
    eventEmitter.removeListener("change", triggerRebuild);
  }
);
```

### What's next?

A plugin that just does logging might not be the most useful, lets find out what hooks are available:
