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

### Hook names

The following hooks are currently supported, but more may be added in future.
Trying to add a hook for a hook name that does not exist will result in an
error.

[(See hooks in the source)](https://github.com/graphile/graphile-build/blob/996e28f0af68f53e264170bd4528b6500ff3ef25/packages/graphile-build/SchemaBuilder.js#L11-L59)

- `build`: The build object represents the current schema build and is passed
  to all hooks, hook the 'build' event to extend this object.

- `init`: The init event is triggered after `build` (which should not generate
  any GraphQL objects) and can be used to build common object types that may be
  useful later. The argument to this is an empty object and should be passed
  through unmodified (it is ignored currently).

- `GraphQLSchema`: This event defines the root-level schema; hook it to add `query`,
  `mutation`, `subscription` or similar GraphQL fields.

- `GraphQLObjectType*`: When creating a GraphQLObjectType via
  `newWithHooks`, we'll execute, the following hooks:

  - `GraphQLObjectType` to add any root-level attributes, e.g. add a description
  - `GraphQLObjectType:interfaces` to add additional interfaces to this object type
  - `GraphQLObjectType:fields` to add additional fields to this object type (is
    ran asynchronously and gets a reference to the final GraphQL Object as
    `Self` in the context)
  - `GraphQLObjectType:fields:field`: to add any root-level attributes to an
    individual field, e.g. add a description
  - `GraphQLObjectType:fields:field:args` to add arguments to an individual field

- `GraphQLInputObjectType*`: When creating a GraphQLInputObjectType via
  `newWithHooks`, we'll execute, the following hooks:

  - `GraphQLInputObjectType` to add any root-level attributes, e.g. add a description
  - `GraphQLInputObjectType:fields` to add additional fields to this object type (is
    ran asynchronously and gets a reference to the final GraphQL Object as
    `Self` in the context)
  - `GraphQLInputObjectType:fields:field`: to customize an individual field from above

- `GraphQLEnumType*`: When creating a GraphQLEnumType via `newWithHooks`,
  we'll execute, the following hooks:

  - `GraphQLEnumType` to add any root-level attributes, e.g. add a description
  - `GraphQLEnumType:values` to add additional values

### Hook arguments

The `hookFunction` that you register via `builder.hook(hookName, hookFunction)` will be called with 3 arguments:

1. The input object (e.g. the spec that would be passed to the GraphQLObjectType constructor)
2. The `Build` object (see below)
3. The `Context` object (see below) which contains a `scope` property

#### Input object

Depending on the hook being called the input object might be an array (as in
the case of `GraphQLObjectType:interfaces`) or an object (as in all other
cases, currently). More specifically, the types for each hook are:

- build - a `Build` object (see below)
- init - an opaque object, please just return it verbatim

- GraphQLSchema - [`GraphQLSchemaConfig`](http://graphql.org/graphql-js/type/#graphqlschema)

- GraphQLObjectType - [`GraphQLObjectTypeConfig`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
- GraphQLObjectType:interfaces - [array of `GraphQLInterfaceType` instances](http://graphql.org/graphql-js/type/#graphqlinterfacetype)
- GraphQLObjectType:fields - [`GraphQLFieldConfigMap`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
- GraphQLObjectType:fields:field - [`GraphQLFieldConfig`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
- GraphQLObjectType:fields:field:args - [`GraphQLFieldConfigArgumentMap`](http://graphql.org/graphql-js/type/#graphqlobjecttype)

- GraphQLInputObjectType - [`GraphQLInputObjectTypeConfig`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)
- GraphQLInputObjectType:fields - [`GraphQLInputObjectConfigFieldMap`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)
- GraphQLInputObjectType:fields:field - [`GraphQLInputObjectFieldConfig`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)

- GraphQLEnumType - [`GraphQLEnumTypeConfig`](http://graphql.org/graphql-js/type/#graphqlenumtype)
- GraphQLEnumType:values - [`GraphQLEnumValueConfigMap`](http://graphql.org/graphql-js/type/#graphqlenumtype)

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

