---
layout: marketing
path: /
title: Extensible GraphQL APIs through Plugins
---

<header>
<div class='container'>

# Build Powerful GraphQL APIs

<p class='lead'>
GraphQL-Build provides you with a framework to build high-performance extensible GraphQL APIs by combining plugins and using advanced look-ahead features.
</p>

<div class='row'>
<div class='col-lg-6 col-12'>

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

  #...
```

</div><!-- /col-6 -->
<div class='col-lg-6 col-12'>

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

  #...
```

</div><!-- /col-6 -->
</div><!-- /row -->

</div><!-- /container -->
</header>

<!-- **************************************** -->

<section class='odd'>
<div class='container'>
<div class='row'>
<div class='col-12'>

# Easy Integration
<p class='lead'>
If you're already using the reference implementation of GraphQL from Facebook then you can add hooks to your schema with ease:
</p>

<div class='container'>
<div class='row'>

<div class='col-12 col-lg-6'>

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
<div class='col-12 col-lg-6'>

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
</section><!-- /odd -->

<!-- **************************************** -->

<section class='even'>
<div class='container'>
<div class='row'>
<div class='col-12'>

# Fully compatible

<p class='lead'>
We use the reference GraphQL implementation under the hood, so you know we're spec compliant.
</p>

 We do not use private APIs to manipulate the generated schema - only the public interfaces. You can use regular GraphQL objects in your generated Schema - you only need hooks for the parts you want callbacks for.
</div><!-- /col-12 -->

</div><!-- /row -->
</div><!-- /container -->
</section><!-- /even -->

<!-- **************************************** -->

<section class='odd'>
<div class='container'>
<div class='row'>
<div class='col-12'>

# First class schema watching

<p class='lead'>
Automatically update your running GraphQL schema without the need to restart the server.
</p>

For example: when your underlying data structure changes your GraphQL-Build plugins can trigger a rebuild event and you'll automatically be supplied with a fresh new GraphQL schema to replace the out-of-date one - no need to restart your server!
</div><!-- /col-12 -->

</div><!-- /row -->
</div><!-- /container -->
</section><!-- /odd -->

<!-- **************************************** -->

<section class='even'>
<div class='container'>
<div class='row'>
<div class='col-12'>

# Performance baked in

<p class='lead'>
Say Goodbye to the N+1 problem; fewer round-trips means higher performance.
</p>

By using our lookahead tools your code can know what's coming and make sure it requests the correct fields ahead of time, leading to fewer roundtrips and higher performance.

PostGraphQL v4 utilises this functionality to enable it to serve even deeply nested requests with just one SQL query, which lead to significant speedups especially where database connection latency was above 1ms.

</div><!-- /col-12 -->

</div><!-- /row -->
</div><!-- /container -->
</section><!-- /odd -->

<!-- **************************************** -->

<section class='odd'>
<div class='container'>
<div class='row'>
<div class='col-12'>

# Data-store independent

<p class='lead'>
Build plugins for anything that Node.js can communicate with.
</p>

We have extensive support for PostgreSQL already through the `graphql-build-pg`
module; this performs introspection of your database schema and automatically
builds a Relay-enabled GraphQL API from the tables it finds. Security is
handled through PostgreSQL's GRANT system and Row Level Security features.
</div><!-- /col-12 -->

</div><!-- /row -->
</div><!-- /container -->
</section><!-- /odd -->

<!-- **************************************** -->

<section class='even'>
<div class='container'>
<div class='row'>
<div class='col-12'>

# Get started

```js
const { buildSchema, defaultPlugins } = require("graphql-build");
const { printSchema } = require("graphql/utilities");

async function main() {
  const schema = await buildSchema(defaultPlugins);
  console.log(printSchema(schema));
}

main();
```

<div class='d-flex justify-content-center'>
<a class='btn btn-primary btn-lg' href='/docs/getting-started/'>Get started &raquo;</a>
</div>

</div><!-- /col-12 -->
</div><!-- /container -->
</section><!-- /even -->

<!-- **************************************** -->
