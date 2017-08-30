---
layout: marketing
path: /graphile-build/
title: Extensible GraphQL APIs through Plugins
---

<!-- **************************************** -->

<header class='hero simple'>
<div class='hero-block container'>

# Graphile Build

<h3 class="measure">
  A library for constructing
  <br />
  high-performance pluggable GraphQL APIs
</h2>
<br />

<div class='flex'>
<a class='button--solid-light' href='/graphile-build/getting-started/'>Documentation <span class='fa fa-fw fa-long-arrow-right' /></a>
</div>

</div>
</header>


<!-- **************************************** -->

<section>
<div class='container'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## Graphile Build for pluggable GraphQL APIs

Using Graphile Build's plugin architecture you can rapidly generate
high-performance extensible GraphQL schemas by combining plugins and leveraging
advanced look-ahead features.

</div>
</div>
</div>

<div class='row'>
<div class='col-lg-6 col-md-9 col-xs-12'>


##### Build your schema with plugins
```js
buildSchema(plugins)
 
```

```graphql{2}
type Person {
  # @deprecated Use 'name' instead
  # The person's first name
  firstName: String

  #...
```

</div>
<div class='col-lg-6 col-md-9 col-xs-12'>


##### Transform your schema with ease
```js
buildSchema([...plugins,
  DeprecateFromCommentPlugin])
```

```graphql{3-4}
type Person {
  # The person's first name
  firstName: String @deprecated(
    reason: "Use 'name' instead")

  #...
```

</div>
</div>

<br />
<div class='flex'>
<a class='strong-link' href='/graphile-build/getting-started/'>Get started <span class='fa fa-fw fa-long-arrow-right' /></a>

</div>

</div>
</section>

<!-- **************************************** -->

<section>
<div class='container'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## graphile-build for GraphQL performance

Say Goodbye to the N+1 problem; fewer round-trips means higher performance.

By using our [look-ahead feature](/graphile-build/look-ahead/) your code can
know what's coming and make sure it requests the correct fields ahead of time,
leading to fewer round-trips and higher performance.

[PostGraphile](/postgraphile/) uses this functionality to serve even deeply
nested requests with just one SQL query. Result: significantly reduced query
latency.

</div>
</div>
</div>

</div>
</section>

<!-- **************************************** -->

<section>
<div class='container'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## Automatically build GraphQL objects and fields through database introspection

The core `graphile-build` library treats GraphQL as a first-class target, and
out of the box does not discriminate between your datastore. By using plugins
to introspect your datastore you can automatically build your GraphQL objects
and eliminate the development work required to keep your codebase and database
schema in sync.

`graphile-build-pg` is a collection of plugins which adds extensive support for
PostGraphQL by performing introspection of your database schema and
**automatically** building the relevant GraphQL objects and fields based on the
tables, columns, functions, relations that it finds. This is the core of
[PostGraphile](/postgraphile/).

You can build plugins for anything that Node.js can communicate with.

</div>
</div>
</div>

</div>
</section>


<!-- **************************************** -->

<section>
<div class='container'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## Straightforward integration

If you're already building with the reference implementation of GraphQL from
Facebook then adding hooks is fairly straightforward:

</div>
</div>
</div>

<div class='row'>
<div class='col-lg-6 col-md-9 col-xs-12'>

##### `graphql`

```js{2}
const MyType =
  new GraphQLObjectType({
    name: 'MyType',
    fields: {
      // ...
```

</div><!-- /col-6 -->
<div class='col-lg-6 col-md-9 col-xs-12'>

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

</div>
</section>



<!-- **************************************** -->

<section>
<div class='container'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## Fully GraphQL compatible

Graphile uses the <a href="http://graphql.org/graphql-js/">reference GraphQL
implementation</a> under the hood, so you know it's spec compliant.

This also means you can mix it into existing GraphQL APIs, or mix existing
GraphQL object types into it (so long as they use the reference GraphQL
implementation too).

</div>
</div>
</div>

</div>
</section>

<!-- **************************************** -->

<section>
<div class='container'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## Automatically update your running GraphQL schema without the need to restart

For example: when your underlying data structure changes your Graphile-Build
plugins can [trigger a
rebuild](/graphile-build/schema-builder/#registerwatcherwatcher-unwatcher)
event and you'll automatically be supplied with a fresh new GraphQL schema to
replace the out-of-date one - no need to restart your server!

</div>
</div>
</div>

</div>
</section>



<!-- **************************************** -->

<section>
<div class='container'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## Quick to start

</div>
</div>
</div>

<div class='row'>
<div class='text-center col-xs-12 col-md-9 col-lg-7'>

```js
const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

async function main() {
  const schema = await buildSchema(defaultPlugins);
  console.log(printSchema(schema));
}

main();
```

</div>
</div>

<br />

<div class='row'>
<div class='text-center col-xs-12 col-md-9 col-lg-7'>
<a class='strong-link' href='/graphile-build/getting-started/'>Get started <span class='fa fa-fw fa-long-arrow-right' /></a>
</div>
</div>

</div>
</section>


<!-- **************************************** -->

<section class='mailinglist'>
<div class='container'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

<h3>
Questions, comments or feedback?
<br />
Email <a href="mailto:info@graphile.org?subject=Graphile%20question/comment/feedback:)">info@graphile.org</a>
</h3>

<form action="//graphile.us16.list-manage.com/subscribe/post?u=d103f710cf00a9273b55e8e9b&amp;id=c3a9eb5c4e" method="post"
id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
  <div id="mc_embed_signup_scroll" class="center hero-block">
    <p>Keep up to date on Graphile and PostGraphile features/changes.
    Subscribe to our occasional announcements newsletter:</p>
    <div class="mc-field-group form-inline justify-content-center">
      <div class='form-group'>
        <div class="mb2">
          <label class="label--small" for="mce-EMAIL">Email address:</label>
        </div>
          <input
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            class="input-text mb0-ns mb1"
            id="mce-EMAIL"
            name="EMAIL"
            spellcheck="false"
            type="email"
            value=""
          />
        <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
        <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_d103f710cf00a9273b55e8e9b_c3a9eb5c4e" tabindex="-1" value="" /></div>
        <input
          class="button--solid"
          id="mc-embedded-subscribe"
          name="subscribe"
          type="submit"
          value="Subscribe"
        />
      </div>
      <div id="mce-responses" class="clear">
        <div class="response" id="mce-error-response" style="display:none"></div>
        <div class="response" id="mce-success-response" style="display:none"></div>
      </div>
    </div>
  </div>
</form>

</div>
</div>
</div>

</div>
</section>

<!-- **************************************** -->
