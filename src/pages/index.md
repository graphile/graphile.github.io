---
layout: marketing
path: /
title: Extensible GraphQL APIs through Plugins
---

<div class='header'><div class='container'>

GraphQL-Build
=============

<div class='row'>
<div class='col-6'>

Build your schema with plugins  
```js
buildSchema(plugins)
```

```graphql
type Person {
  # @deprecated Use 'name' instead
  # The person's first name
  firstName: String

  # @deprecated Use 'name' instead
  # The person's last name
  lastName: String

  # The person's full name
  name: String!
}
```

</div><!-- /col-6 -->
<div class='col-6'>

Transform your schema with ease  
```js
plugins.push(DeprecationFromCommentPlugin)
```

```graphql
type Person {
  # The person's first name
  firstName: String @deprecated(
    reason: "Use 'name' instead")

  # The person's last name
  lastName: String @deprecated(
    reason: "Use 'name' instead")

  # The person's full name
  name: String!
}
```

</div><!-- /col-6 -->
</div><!-- /row -->

</div></div><!-- /container --><!-- /header -->

<div class='container'>
<div class='row'>
<div class='col-12'>

# Easy Integration
<p class='lead'>

If you're already using the reference implementation of GraphQL from Facebook then you can add hooks to your schema with ease:

</p>

<div class='container'>
<div class='row'>

<div class='col-6'>

`graphql`:

```js{1}
const MyType = new GraphQLObjectType({
  name: 'MyType',
  fields: {
    field1: {
      type: GraphQLString,
      // ...
```

</div><!-- /col-6 -->
<div class='col-6'>

`graphql-build`:

```js{1}
const MyType = newWithHooks(GraphQLObjectType, {
  name: 'MyType',
  fields: {
    field1: {
      type: GraphQLString,
      // ...
```

</div><!-- /col-6 -->

</div><!-- /row -->
</div><!-- /container -->



</div><!-- /col-12 -->
</div><!-- /row -->
</div><!-- /container -->
