---
layout: page
path: /graphile-build/hooks/
title: Hooks
---

## Hooks

The most common thing for a plugin to do is to add hooks to the builder. Hooks
allow you to manipulate the specification that is being passed to the GraphQL
constructors before the objects are constructed - therefore bypassing the need
to fiddle with the private interfaces to GraphQL.

Hooks are registered via a call to `builder.hook(hookName, hookFunction)`.

Every `hookFunction` must synchronously return a value - either the value that it was passed
in or a derivative of it.

You can think of hooks as wrappers around the original object spec, like this:

```js
const MyType = newWithHooks(GraphQLObjectType, spec);

// is equivalent to:

const MyType = new GraphQLObjectType(hook3(hook2(hook1(spec))));
```

### Which hook to attach to: `hookName`

The `hookName` that you register via `builder.hook(hookName, hookFunction)`
must match one of the supported hooks. See [All
Hooks](/graphile-build/all-hooks/) for a list of all the hooks we support,
here's a brief overview of some of the more important ones:

- `build`: extend the [Build object](/graphile-build/build-object/) passed to all other hooks

- `init`: perform setup after `build` freezes but before building the schema starts

- `GraphQLSchema`: root-level schema - hook to add `query`,
  `mutation` or `subscription` fields; called by `buildSchema(plugins, options)`

- When creating a `GraphQLObjectType` via
  `newWithHooks`:

  - `GraphQLObjectType` add/remove any root-level attributes, e.g. add a description
  - `GraphQLObjectType:interfaces` add/remove interfaces
  - `GraphQLObjectType:fields` add/remove fields (delayed)
  - `GraphQLObjectType:fields:field`: manipulate individual field spec, e.g.
    add a description
  - `GraphQLObjectType:fields:field:args` add/remove arguments to an individual field

- When creating a `GraphQLInputObjectType` via
  `newWithHooks`:

  - `GraphQLInputObjectType` add/remove root-level attributes, e.g. description
  - `GraphQLInputObjectType:fields` add/remove additional fields to this object type (delayed)
  - `GraphQLInputObjectType:fields:field`: customize an individual field from above

- When creating a `GraphQLEnumType` via `newWithHooks`:

  - `GraphQLEnumType` add/remove any root-level attributes, e.g. add a description
  - `GraphQLEnumType:values` add/remove values

### What to do when that hook fires: `hookFunction`

The `hookFunction` that you register via `builder.hook(hookName, hookFunction)` will be called with 3 arguments:

1. The input object (e.g. the spec that would be passed to the GraphQLObjectType constructor)
2. The `Build` object (see below)
3. The `Context` object (see below) which contains a `scope` property

#### Input object

Depending on the hook being called the input object might be an array (as in
the case of `GraphQLObjectType:interfaces`) or an object (as in all other
cases, currently).  See [All Hooks](/graphile-build/all-hooks/) for a list of
all the hooks, their input types, etc

#### Build object (`Build`)

The build object (see [Build Object](/graphile-build/build-object/)) contains a
number of helpers and sources of information relevant to the current build of
the GraphQL API. If you're in watch mode then every time a new schema is
generated a new build object will be used.

Plugins may extend the `build` object via the `build` hook. Once the `build`
hook is complete the build object is frozen.

The most commonly used methods are:

- `build.extend(obj1, obj2)` - returns a new object based on a non-destructive
  merge of `obj1` and `obj2` (will not overwrite keys!) - normally used at the
  return value for a hook
- `build.graphql` - equivalent to `require('graphql')`, but helps ensure
  GraphQL version clashes do not occur

See [Build Object](/graphile-build/build-object/)) for the rest.

#### Context object (`Context`)

The context object (see [Context Object](/graphile-build/context-object/)) contains
the information relevant to the current hook. Most importantly it contains the
`scope` (an object based on the third argument passed to `newWithHooks`) but it
also contains a number of other useful things. Here's some of the more commonly
used ones:

- `scope` - an object based on the third argument to `newWithHooks` or
  `fieldWithHooks`; for deeper hooks (such as `GraphQLObjectType:fields:field`)
  the scope from shallower hooks (such as `GraphQLObjectType`) are merged in.
- `Self` - only available on hooks that are called after the object is created
  (e.g. `GraphQLObjectType:fields`), this contains the object that has been
  created allowing recursive references.
- `fieldWithHooks(fieldName, spec, scope = {})` - on `GraphQLObjectType:fields`, used for adding a field if
  you need access to the field helpers (or want to define a scope)

### Namespaces

Properties added to the `Build` object or set on the `Context.scope` should be
namespaced so that they do not conflict; for example `graphile-build-pg` uses
the `pg` namespace: `pgSql`, `pgIntrospection`, `isPgTableType`, etc

TODO: expand

