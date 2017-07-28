---
layout: page
path: /docs/hooks/
title: Hooks
prev: /docs/plugins/
prevText: Plugins
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

[(See hooks in the source)](https://github.com/benjie/graphql-build/blob/996e28f0af68f53e264170bd4528b6500ff3ef25/packages/graphql-build/SchemaBuilder.js#L11-L59)

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

The build object starts out with the following properties/methods, but plugins may extend it via the `build` hook.

##### `newWithHooks(type, spec, scope)`

The bread-and-butter of GraphQL-Build, this method is how we build hooked GraphQL objects:

```js
const MyType = newWithHooks(type, spec, scope);
```

- `type` is a GraphQL object type, such as `GraphQLEnumType` or `GraphQLInputObjectType`
- `spec` is a valid specification that will be passed through the relevant
  hooks before ultimately being passed to the constructor of the aforementioned
  `type` and returning an instance of that type
- `scope` is where you can add scope information that will be available through
  the `scope` property in the context object passed to hooks (see `Context`
  below)


##### `build.extend(input, extensions)`

Returns a new object by merging the properties of `input` and `extensions`
**without overwriting**. If any clashes occur an error will be throw. It is
advisable to use this instead of `Object.assign` or `{...input, ...extensions}`
because it will warn you if you're accidentally overwriting something.

##### `build.graphql`

Equivalent to `require('graphql')`, by using this property you don't have to
import graphql and you're less likely to get version conflicts which are hard
to diagnose and resolve. Use of this property over importing `graphql` yourself
is highly recommended.

#### `getTypeByName(typeName)`

Returns the GraphQL type associated with the given name, if it is known to the
current build, or `null` otherwise. Objects built with `newWithHooks` are
automatically registered, but external objects must be registered via:

##### `build.addType(type: GraphQLNamedType)`

Registers an external (un-hooked) GraphQL type with the system so that it may
be referenced via `getTypeByName()`

#### Build object (`Build`) - advanced properties/methods

##### `getAliasFromResolveInfo(resolveInfo)`

Use this in your resolver to quickly retrieve the alias that this field was
requested as.

From [`graphql-parse-resolve-info`](https://github.com/postgraphql/graphql-build/tree/master/packages/graphql-parse-resolve-info#getaliasfromresolveinforesolveinfo)

TODO: example

##### `build.resolveAlias`

Can be used in place of the `resolve` method for a field if you wish it to resolve to the alias the field was requested as (as opposed to its name).

```js
resolveAlias(data, _args, _context, resolveInfo) {
  const alias = getAliasFromResolveInfo(resolveInfo);
  return data[alias];
}
```

##### `parseResolveInfo(resolveInfo)`

Can be used in your `resolve` methods to "look ahead" to determine which
sub-fields, sub-sub-fields, etc. you need to fetch in your resolver. Great for
performance optimisations.

From [`graphql-parse-resolve-info`](https://github.com/postgraphql/graphql-build/tree/master/packages/graphql-parse-resolve-info#parseresolveinforesolveinfo)

TODO: example

##### `generateDataForType(type, parsedResolveInfoFragment)`

For performance optimisations

TODO: document


##### `simplifyParsedResolveInfoFragmentWithType(parsedResolveInfoFragment, graphQLType)`

Simplifies the details from `parseResolveInfo()` above if you know the type you
will be returning (useful if you're not using `GraphQLUnionType`).

From [`graphql-parse-resolve-info`](https://github.com/postgraphql/graphql-build/tree/master/packages/graphql-parse-resolve-info#simplifyparsedresolveinfofragmentwithtypeparsedresolveinfofragment-returntype)

TODO: example

### Namespaces

Properties added to the `Build` object or set on the `scope` should be
namespaced so that they do not conflict; for example `graphql-build-pg` uses
the `pg` namespace: `pgSql`, `pgIntrospection`, `isPgTableType`, etc

TODO: expand

