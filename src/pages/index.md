---
layout: marketing
path: /
title: Extensible GraphQL APIs through Plugins
---

<header>
<div class='container'>

## Powerful, Performant and Extensible GraphQL APIs

<p class='lead'>
The Graphile suite of Node.js modules provide you with the tools to rapidly
generate high-performance extensible GraphQL APIs by combining plugins and
using advanced look-ahead features.
</p>

<div class='row'>
<div class='col-lg-6 col-12'>

Build your schema with plugins  
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

</div><!-- /col-6 -->
<div class='col-lg-6 col-12'>

Transform your schema with ease  
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

</div><!-- /col-6 -->
</div><!-- /row -->

</div><!-- /container -->
</header>

<!-- **************************************** -->

<section class='odd'>
<div class='container'>
<div class='row'>
<div class='col-12'>

# Straightforward Integration
<p class='lead'>
If you're already building with the reference implementation of GraphQL from
Facebook then adding hooks is fairly straightforward:
</p>

<div class='container'>
<div class='row'>

<div class='col-12 col-lg-6'>

`graphql`:

```js{2}
const MyType =
  new GraphQLObjectType({
    name: 'MyType',
    fields: {
      // ...
```

</div><!-- /col-6 -->
<div class='col-12 col-lg-6'>

`graphile-build`:

```js{2}
const MyType =
  newWithHooks(GraphQLObjectType, {
    name: 'MyType',
    fields: {
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
<div class='col-4 col-fa hidden-md-down'><i class='fa fa-handshake-o' aria-hidden="true"></i></div>
<div class='col-12 col-lg-8'>

# Fully compatible

<p class='lead'>
We use the <a href="http://graphql.org/graphql-js/">reference GraphQL implementation</a>
under the hood, so you know we're spec compliant.
</p>

 You can use regular GraphQL objects from other libraries in your generated
 schema - you only need to change the parts of your code that you wish to trigger hooks for.
</div>

</div><!-- /row -->
</div><!-- /container -->
</section><!-- /even -->

<!-- **************************************** -->

<section class='odd'>
<div class='container'>
<div class='row'>
<div class='col-12 col-lg-8'>

# First class schema watching

<p class='lead'>
Automatically update your running GraphQL schema without the need to restart the server.
</p>

For example: when your underlying data structure changes your Graphile-Build
plugins can [trigger a rebuild](/graphile-build/schema-builder/#plugin-methods) event and you'll automatically be supplied with a
fresh new GraphQL schema to replace the out-of-date one - no need to restart
your server!
</div><!-- /col-9 -->
<div class='col-4 col-fa hidden-md-down'><i class='fa fa-refresh' aria-hidden="true"></i></div>

</div><!-- /row -->
</div><!-- /container -->
</section><!-- /odd -->

<!-- **************************************** -->

<section class='even'>
<div class='container'>
<div class='row'>
<div class='col-4 col-fa hidden-md-down'><i class='fa fa-rocket' aria-hidden="true"></i></div>
<div class='col-12 col-lg-8'>

# Performance baked in

<p class='lead'>
Say Goodbye to the N+1 problem; fewer round-trips means higher performance.
</p>

By using our [look-ahead feature](/graphile-build/look-ahead/) your code can
know what's coming and make sure it requests the correct fields ahead of time,
leading to fewer round-trips and higher performance.

Version 4 of the popular
[PostGraphQL](https://github.com/postgraphql/postgraphql) OSS project utilises
this functionality to enable it to serve even deeply nested requests with just
one SQL query, which lead to significant speedups especially where database
connection latency was above 1ms.

</div><!-- /col-12 -->

</div><!-- /row -->
</div><!-- /container -->
</section><!-- /odd -->

<!-- **************************************** -->

<section class='odd'>
<div class='container'>
<div class='row'>
<div class='col-12 col-lg-8'>

# Data-store independent

<p class='lead'>
Build plugins for anything that Node.js can communicate with.
</p>

We treat GraphQL as a first-class citizen - everything is modelled around
GraphQL, so any backend technology that can be expressed through GraphQL can be
built with Graphile.

We already have extensive support for PostgreSQL through the
`graphile-build-pg` module; the plugins therein performs introspection of your
database schema and automatically build the relevant GraphQL objects and fields
based on the tables, columns, functions, relations that it finds in your
database - no need to manually keep your codebase and database schema in sync!
</div>
<div class='col-4 col-fa hidden-md-down'><i class='fa fa-database' aria-hidden="true"></i></div>

</div><!-- /row -->
</div><!-- /container -->
</section><!-- /odd -->

<!-- **************************************** -->

<section class='even'>
<div class='container'>
<div class='row justify-content-center'>
<div class='text-center'>

# Quick to start

```js
const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

async function main() {
  const schema = await buildSchema(defaultPlugins);
  console.log(printSchema(schema));
}

main();
```

<div class='d-flex justify-content-center'>
<a class='btn btn-primary btn-lg' href='/graphile-build/getting-started/'>Get started &raquo;</a>
</div>

</div><!-- /col-12 -->
</div><!-- /container -->
</section><!-- /even -->


<section class='mailinglist'>
<div class='container'>

<div class='row justify-content-center'>
<div>
  <h2>Questions, comments or feedback? <a href='mailto:info@graphile.com?subject=Graphile%20question%2Fcomment%2Ffeedback%3A'>info@graphile.com</a></h2>
</div>
</div>

<div style="height: 36px"></div>

<div class='row justify-content-center'>
<div class='col-12 col-md-8 text-center'>
<!-- Begin MailChimp Signup Form -->
<link href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css" rel="stylesheet" type="text/css">
<style type="text/css">
	#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; }
	/* Add your own MailChimp form style overrides in your site stylesheet or in this style block.
	   We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
</style>
<div>
<form action="//graphile.us16.list-manage.com/subscribe/post?u=d103f710cf00a9273b55e8e9b&amp;id=c3a9eb5c4e" method="post"
id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
  <div id="mc_embed_signup_scroll">
    <h4>Subscribe to our occasional announcements newsletter</h4>
    <p class='lead'>Keep up to date on Grapile and PostGraphQL features/changes:</p>
    <div class="mc-field-group form-inline justify-content-center">
      <div class='form-group'>
        <label for="mce-EMAIL">Email Address: </label>
        <input type="email" value="" name="EMAIL" class="required email form-control mx-sm-3" id="mce-EMAIL">
        <div id="mce-responses" class="clear">
          <div class="response" id="mce-error-response" style="display:none"></div>
          <div class="response" id="mce-success-response" style="display:none"></div>
        </div>
        <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
        <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_d103f710cf00a9273b55e8e9b_c3a9eb5c4e" tabindex="-1" value=""></div>
        <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button btn btn-primary"></div>
      </div>
    </div>
  </div>
</form>
</div>
<script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script><script type='text/javascript'>(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='BIRTHDAY';ftypes[3]='birthday';}(jQuery));var $mcj = jQuery.noConflict(true);</script>
<!--End mc_embed_signup-->
</div>
</div>

</div>
</section>

<!-- **************************************** -->
