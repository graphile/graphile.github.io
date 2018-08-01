---
layout: home
path: /
title: Tools to build extensible and performant GraphQL APIs
---

<!-- **************************************** -->

<section>
<div class='container'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## Graphile Build

### High-performance pluggable GraphQL schema tools

Prefer building your GraphQL APIs by hand? By using our [look-ahead
feature](/graphile-build/look-ahead/) your code can know what's coming and make
sure it requests the correct fields from your data source ahead of time,
leading to fewer round-trips and higher performance. Our [plugin
architecture](/graphile-build/plugins/) allows you to extend or enhance your
GraphQL API as your needs evolve over time, and use community-built plugins to
increase developer productivity.

</div>
</div>
</div>

<div class='row'>
<div class='col-lg-6 mb3 col-md-9 col-xs-12'>

##### `graphql`

```js{2}
const MyType =
  new GraphQLObjectType({
    name: 'MyType',
    fields: {
      // ...
```

</div>
<div class='col-lg-6 mb3 col-md-9 col-xs-12'>

##### `graphile-build`

```js{2}
const MyType =
  newWithHooks(GraphQLObjectType, {
    name: 'MyType',
    fields: {
      // ...
```

</div>
</div>

<div class='flex'>
<div>

Graphile Build is the core of PostGraphile - we recommend that you get started
with PostGraphile before you graduate to using Graphile Build directly.

<a class='strong-link' href='/postgraphile/'>Start with PostGraphile <span class='fa fa-fw fa-long-arrow-right' /></a>
<a class='strong-link' href='/graphile-build/'>More about Graphile Build <span class='fa fa-fw fa-long-arrow-right' /></a>

<div>
</div>

</div>
</section>

<!-- **************************************** -->

<section>
GraphQL training, pro services, etc
</section>

