---
layout: page
path: /docs/look-ahead/
title: Look Ahead
---

## Advanced: Look Ahead

Traditionally in GraphQL APIs DataLoader is used to batch requests to minimize
the impact of N+1 queries. DataLoader can be use with GraphQL-Build in the same
way as it is with GraphQL. However, sometimes DataLoader isn't the best
approach for your system, so GraphQL-Build provides a powerful Look-Ahead
functionality you can use to optimize your GraphQL queries. This is
particularly well suited to environments that allow you to specify complex
structures to be returned (such as databases or other GraphQL APIs), but is
generic enough that it can be used for many use-cases.

### Seeing which sub-fields were requested

The [`resolve` method in
GraphQL](http://graphql.org/graphql-js/type/#graphqlobjecttype) is actually
called with 4 arguments:

- source - the data provided by the parent field
- args - the arguments passed to the field in the query
- context - the context object used throughout the resolvers
- resolveInfo - an instance of GraphQLResolveInfo

This 4th argument is the one we're interested in because it contains a number
of goodies. But some of these are hard to digest, so we give you some helpers...

##### `parseResolveInfo(resolveInfo)`

Will take the AST from the GraphQLResolveInfo and extract from it a nested
object consisting of:

- name - the name of the current field
- alias - the alias the current field was requested as
- args - the arguments passed to the field in the query
- fieldsByTypeName - the sub-fields that were requested on the current object
	broken down by the names of the GraphQL types that could be returned.

Because GraphQL supports Union and other complex types, it's possible to
request different sub-fields depending on the type of data that's returned from
a field, hence `fieldsByTypeName`. If you happen to know the type that's going
to be returned then you can simplify with the next method...

From [`graphql-parse-resolve-info`](https://github.com/postgraphql/graphql-build/tree/master/packages/graphql-parse-resolve-info#parseresolveinforesolveinfo)

TODO: example

##### `simplifyParsedResolveInfoFragmentWithType(parsedResolveInfoFragment, graphQLType)`

If you know the precise named type that your field will return you can pass the
result of `parseResolveInfo(resolveInfo)` to this method along with the named
type `graphQLType` and we'll return a similar object with an additional
`fields` property that are only the fields that are compatible with
the `graphQLType`.

From [`graphql-parse-resolve-info`](https://github.com/postgraphql/graphql-build/tree/master/packages/graphql-parse-resolve-info#simplifyparsedresolveinfofragmentwithtypeparsedresolveinfofragment-returntype)

TODO: example

### Declaring meta-data associated with a field

### Determining what meta-data requested subfields have specified

##### `generateDataForType(type, parsedResolveInfoFragment)`

For performance optimisations

TODO: document
