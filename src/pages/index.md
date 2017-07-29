---
layout: marketing
path: /
title: Extensible GraphQL APIs through Plugins
---

<header>
<div class='container'>

GraphQL-Build
=============

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

# 100% compatible

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

# Schema watching built in!

<p class='lead'>
Excellent developer experience - automatically updated schema
</p>

E.g. when your underlying data structure changes (for example you add a database column), your GraphQL-Build plugins can trigger a rebuild event and you'll be supplied with a fresh new GraphQL schema to replace the out of date one - no need to restart your server!
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
<footer>
<div class='container'>
Copyright &copy; Benjie Gillam 2017
</div>
</footer>
