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

<h1>Something</h1>
<p class='lead'>Text</p>

More text


</div><!-- /col-12 -->
</div><!-- /row -->
</div><!-- /container -->
