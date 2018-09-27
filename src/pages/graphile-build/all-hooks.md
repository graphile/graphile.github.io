---
layout: page
path: /graphile-build/all-hooks/
title: All Hooks
---

## All Hooks

The following hooks are currently supported, but more may be added in future.
Trying to add a hook for a hook name that does not exist will result in an
error.

[(See hooks in the source)](https://github.com/graphile/graphile-engine/blob/996e28f0af68f53e264170bd4528b6500ff3ef25/packages/graphile-build/SchemaBuilder.js#L11-L59)

* `build`: The build object represents the current schema build and is passed
  to all hooks, hook the 'build' event to extend this object.

* `init`: The init event is triggered after `build` (which should not generate
  any GraphQL objects) and can be used to build common object types that may be
  useful later. The argument to this is an empty object and should be passed
  through unmodified (it is ignored currently).

* `GraphQLSchema`: This event defines the root-level schema; hook it to add `query`,
  `mutation`, `subscription` or similar GraphQL fields.

* `GraphQLObjectType*`: When creating a GraphQLObjectType via
  `newWithHooks`, we'll execute, the following hooks:

  * `GraphQLObjectType` to add any root-level attributes, e.g. add a description
  * `GraphQLObjectType:interfaces` to add additional interfaces to this object type
  * `GraphQLObjectType:fields` to add additional fields to this object type (is
    ran asynchronously and gets a reference to the final GraphQL Object as
    `Self` in the context)
  * `GraphQLObjectType:fields:field`: to add any root-level attributes to an
    individual field, e.g. add a description
  * `GraphQLObjectType:fields:field:args` to add arguments to an individual field

* `GraphQLInputObjectType*`: When creating a GraphQLInputObjectType via
  `newWithHooks`, we'll execute, the following hooks:

  * `GraphQLInputObjectType` to add any root-level attributes, e.g. add a description
  * `GraphQLInputObjectType:fields` to add additional fields to this object type (is
    ran asynchronously and gets a reference to the final GraphQL Object as
    `Self` in the context)
  * `GraphQLInputObjectType:fields:field`: to customize an individual field from above

* `GraphQLEnumType*`: When creating a GraphQLEnumType via `newWithHooks`,
  we'll execute, the following hooks:

  * `GraphQLEnumType` to add any root-level attributes, e.g. add a description
  * `GraphQLEnumType:values` to add additional values
  * `GraphQLEnumType:values:value` to customize an individual value from above

### Input types

Depending on the hook being called the input object might be an array (as in
the case of `GraphQLObjectType:interfaces`) or an object (as in all other
cases, currently). More specifically, the types for each hook are:

* build - a `Build` object (see below)
* init - an opaque object, please just return it verbatim

* GraphQLSchema - [`GraphQLSchemaConfig`](http://graphql.org/graphql-js/type/#graphqlschema)

* GraphQLObjectType - [`GraphQLObjectTypeConfig`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
* GraphQLObjectType:interfaces - [array of `GraphQLInterfaceType` instances](http://graphql.org/graphql-js/type/#graphqlinterfacetype)
* GraphQLObjectType:fields - [`GraphQLFieldConfigMap`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
* GraphQLObjectType:fields:field - [`GraphQLFieldConfig`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
* GraphQLObjectType:fields:field:args - [`GraphQLFieldConfigArgumentMap`](http://graphql.org/graphql-js/type/#graphqlobjecttype)

* GraphQLInputObjectType - [`GraphQLInputObjectTypeConfig`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)
* GraphQLInputObjectType:fields - [`GraphQLInputObjectConfigFieldMap`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)
* GraphQLInputObjectType:fields:field - [`GraphQLInputObjectFieldConfig`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)

* GraphQLEnumType - [`GraphQLEnumTypeConfig`](http://graphql.org/graphql-js/type/#graphqlenumtype)
* GraphQLEnumType:values - [`GraphQLEnumValueConfigMap`](http://graphql.org/graphql-js/type/#graphqlenumtype)
* GraphQLEnumType:values:value - [`GraphQLEnumValueConfig`](http://graphql.org/graphql-js/type/#graphqlenumtype)
