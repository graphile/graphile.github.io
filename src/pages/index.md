---
layout: marketing
slug: /
title: PostGraphile - full GraphQL API server in an instant from PostgreSQL database
---

<!-- **************************************** -->

<header class='hero simple'>
<div class='container'>
<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## PostGraphile

### Rapidly build highly customisable, lightning-fast GraphQL APIs

<br />
<div class='flex'>
<a class='button--solid-light' href='/postgraphile/introduction/'>Documentation <span class='fas fa-fw fa-arrow-right' /></a>
</div>

</div>
</div>
</div>
</div>
</header>

<!-- **************************************** -->

<section>
<div class='container'>

<div class='row flex-wrap'>
<div class='text-center col-xs-12 col-md-9 col-lg-10'>
<div class='hero-block'>

<p class='intro'>
  PostGraphile is an open-source tool to help you rapidly design and serve a
  high-performance, secure, client-facing GraphQL API backed primarily by your
  PostgreSQL database.  Delight your customers with incredible performance
  whilst maintaining full control over your data and your database. Use our
  powerful plugin system to customise every facet of your GraphQL API to your
  liking.
</p>

## Try it now!

The fastest way to get a full client-facing GraphQL API up and running from
a PostgreSQL database schema.

```js
npx postgraphile -c postgres:///dbname --schema public
```

See the [Quick Start Guide](/postgraphile/quick-start-guide/) to get PostGraphile up and running.

**Note**: Run with latest Node LTS v8+. No installation required
(npx comes with node and performs a temporary install). Connection string is of the format:
`postgres://pg_user:pg_pass@pg_host:pg_port/pg_db?ssl=1`

<form action="//graphile.us16.list-manage.com/subscribe/post?u=d103f710cf00a9273b55e8e9b&amp;id=c3a9eb5c4e" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate="novalidate">
<div id="mc_embed_signup_scroll" class="center hero-block">
<p>Keep up to date on Graphile Engine and PostGraphile features/changes.
Subscribe to our occasional announcements newsletter:</p>
<div class="mc-field-group form-inline justify-content-center">
<div class="form-group">
<div class="mb2">
<label class="label--small" for="mce-EMAIL">Email address:</label>
</div>
<input autocapitalize="off" autocomplete="off" autocorrect="off" class="input-text mb0-ns mb1" id="mce-EMAIL" name="EMAIL" spellcheck="false" type="email" value="">
<!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
<div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_d103f710cf00a9273b55e8e9b_c3a9eb5c4e" tabindex="-1" value=""></div>
<input class="button--solid" id="mc-embedded-subscribe" name="subscribe" type="submit" value="Subscribe">
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
<div class='text-center col-xs-12 col-md-3 col-lg-2 postgraphile-logo-bg'>
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

## Client-facing GraphQL server

PostGraphile is designed to serve GraphQL queries directly from clients such as
webpages or mobile apps, leveraging the security features built in to
PostgreSQL. Used this way, backend developers can focus solely on specifying
the data schema, business logic and permissions using trusted and familiar
PostgreSQL - PostGraphile handles making that available as a high-performance,
low-latency GraphQL API.

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

## Simple infrastructure

A typical PostGraphile server architecture consists of your PostgreSQL database
server and a single Node.js process. There's no containers or other complex setup
required in the default stack.

When it comes time to scale, it's easy to scale horizontally using additional
servers - PostGraphile is stateless by default.

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

## Solves N+1 queries issues

Using Graphile Engine's [look-ahead](/graphile-build/look-ahead/) features a
single root level GraphQL query, no matter how nested, can become just one SQL
query - leading to fewer database round-trips and thus blazingly fast
performance - typically much greater than that you'd get using `DataLoader`.

[Read more about PostGraphile's stunning performance](/postgraphile/performance/)

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

## Customisable with SQL

PostGraphile has first-class support for your SQL functions, automatically
exporting them as [custom queries](/postgraphile/custom-queries/), [custom
mutations](/postgraphile/custom-mutations/) and [computed
columns](/postgraphile/computed-columns/) as appropriate.

You can further customise the generated schema with our [smart
comments](/postgraphile/smart-comments/) feature (which allows renaming and
removing columns, tables, relations and functions with a straight-forward
syntax using PostgreSQL's built in `COMMENT` facility).

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

## Customisable with JS plugins

The GraphQL schema PostGraphile uses is entirely built from [Graphile Engine
plugins](https://github.com/graphile/graphile-engine/tree/master/packages/graphile-build-pg/src/plugins),
you can disable any of the built in plugins to restrict the functionality or
add additional plugins to extended or enhanced your generated schema.

This allows you to add (or remove) fields, create new types, add
functionality, replace functionality or or even tweak existing functionality
(e.g. wrapping an existing resolver with your own higher-order function) to
gain powerful control over your API, all whilst retaining the amazing
performance optimisations Graphile Engine makes available to you and keeping
latency at an absolute minimum.

</div>
</div>
</div>

<div class='row'>
<div class='col-lg-6 col-md-9 col-xs-12'>

##### Build your schema with plugins

```js
buildSchema(plugins);
```

```graphql{2}
type Person {
  # @deprecated Use 'name' instead
  # The person's first name
  firstName: String

  #...
```

</div><!-- /col-6 -->
<div class='col-lg-6 col-md-9 col-xs-12'>

##### Transform your schema with ease

```js
buildSchema([...plugins, DeprecateFromCommentPlugin]);
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

</div>
</section>

<!-- **************************************** -->

<section>
<div class='container'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## Fully GraphQL compatible

PostGraphile and Graphile Engine use the [reference GraphQL
implementation](http://graphql.org/graphql-js/) under the hood, so you know
they're spec compliant.

PostGraphile supports GraphQL best practices, including: [cursor-based
connection
pagination](https://facebook.github.io/relay/graphql/connections.htm), [global
object
identification](https://facebook.github.io/relay/graphql/objectidentification.htm),
and the [Relay Input Object Mutations
Specification](https://facebook.github.io/relay/graphql/mutations.htm).

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

## PostgreSQL schema watching

PostGraphile has an excellent developer experience (DX) when you use the
`--watch` CLI flag - it will automatically re-generate the GraphQL schema
when your database changes. What's more, it will automatically hot reload
GraphiQL's documentation too, without losing your place, so you can see your
new schema features right away! No need to restart the server!

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

## GraphiQL with auto-generated documentation

PostGraphile comes with GraphiQL built in, set to automatically update the
documentation when your database schema changes.

<div class="full-width">

![GraphiQL displaying allSuperheroes](./graphiql-superheroes.png)

</div>

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

## Secure

Using PostgreSQL's Role-Based Access Control (RBAC) and Row-Level Security
policies (RLS), PostGraphile leverages the tried-and-tested authentication
baked right in to the worlds most advanced open source database - no more
reinventing the wheel! Thanks to RLS's granularity it's possible to express
complex authorisation logic in simple policies; and because the authentication
is _in your database_ you can ensure nothing (not even companion microservices)
can bypass it.

PostGraphile allows you to use industry standard JWT authentication, allowing
for stateless authentication which also works great with CORS.

If you prefer not to use JWT you can use PostGraphile as a middleware, and
via the
[pgSettings](/postgraphile/usage-library/#exposing-http-request-data-to-postgresql)
function gain access to any HTTP authentication method that Node.js supports. (A favourite is to use Passport.js for social login.)

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

## Flexible

If you prefer, PostGraphile can be used as a lightning-fast back-end to an
alternative client-facing GraphQL schema that might be built using techniques
such as "GraphQL schema stitching" or "GraphQL bindings".

If you don't need the GraphQL schema served over HTTP you can simply use the
schema directly.

</div>
</div>
</div>

</div>
</section>

<!-- **************************************** -->

<section>
<div class='container'>

## See what people are saying

<div class="mw9 ph3-ns flex flex-row flex-wrap">
<div class="cf ph2-ns flex flex-wrap">
<article class="w-100 w-50-m w-25-ns pa2 center bg-white br3 pa4-ns mv3 ba b--black-10">
<div class="tc">
<h1 class="f3 di">Chad F</h1>
<h2 class="i f5 di">senior technical lead <a href="https://chads.website/development/2018/08/03/How-GraphQL-Saved-My-Project.html" target="_blank"><span class="fas fa-external-link-alt"></span></a></h2>
<hr class="mw3 bb bw1 b--black-10 db">
</div>
<p class="lh-copy measure center f6 black-70">
<i class="fas fa-quote-left h3 w3 di" style="color: #004081;" aria-hidden="true"></i>
Thanks for making GraphQL something I can use on my project in a robust way with <strong>minimal effort</strong>. 500-1500 requests per second on a single server is pretty awesome.&nbsp;<i class="fas fa-quote-right h3 w3 di" style="color: #004081;" aria-hidden="true"></i>
</p>
</article>
<article class="w-100 w-50-m w-25-ns pa2 center bg-white br3 pa4-ns mv3 ba b--black-10" style="flex-grow: 1">
<div class="tc">
<h1 class="f3 di">Bradley A</h1>
<h2 class="i f5 di">CTO <a href="https://twitter.com/bradleyayers/status/1012557510346080256" target="_blank"><i class="fab fa-twitter"></i></a></h2>
<hr class="mw3 bb bw1 b--black-10 db">
</div>
<p class="lh-copy measure center f6 black-70">
<i class="fas fa-quote-left h3 w3 di" style="color: #004081;" aria-hidden="true"></i>
I setup my backend to use PostGraphile directly when querying the local database. It's removed a bunch of hand-written SQL, added type-safety to verify Postgres schema compatibility, and <strong>created a more consistent dev experience for frontend/backend code.</strong>&nbsp;<i class="fas fa-quote-right h3 w3 di" style="color: #004081;" aria-hidden="true"></i>
</p>
</article>
<article class="w-100 w-50-m w-25-ns pa2 center bg-white br3 pa4-ns mv3 ba b--black-10" style="flex-grow: 1">
<div class="tc">
<h1 class="f3 di">Sam L</h1> 
<h2 class="i f5 di">full stack developer <a href="https://gitter.im/graphile/postgraphile?at=5b65d555e9ab53770c8c41a1"target="_blank"><i class="fas fa-external-link-alt"></i></a></h2>
<hr class="mw3 bb bw1 b--black-10 db">
</div>
<p class="lh-copy measure center f6 black-70">
<i class="fas fa-quote-left h3 w3 di" style="color: #004081;" aria-hidden="true"></i>
This project, Benjie's handling of it, the docs, support, and community is awesome all around. <strong>PostGraphile is a powerful, idomatic, and elegant tool.</strong>&nbsp;<i class="fas fa-quote-right h3 w3 di" style="color: #004081;" aria-hidden="true"></i>
</p>
</article>
<article class="w-100 w-50-m w-25-ns pa2 center bg-white br3 pa4-ns mv3 ba b--black-10" style="flex-grow: 1">
<div class="tc">
<h1 class="f3 di">Max D</h1>
<h2 class="i f5 di">software consultant <a href="https://twitter.com/maxdesiatov/status/1001419221102940160" target="_blank"><i class="fab fa-twitter"></i></a></h2>
<hr class="mw3 bb bw1 b--black-10 db">
</div>
<p class="lh-copy measure center f6 black-70">
<i class="fas fa-quote-left h3 w3 di" style="color: #004081;" aria-hidden="true"></i>
Recently I launched a few mobile and web apps using GraphQL, Great stuff, not least thanks to wonderful PostGraphile and Apollo. <strong>At this point, it’s quite hard for me to come back and enjoy working with REST.</strong>&nbsp;<i class="fas fa-quote-right h3 w3 di" style="color: #004081;" aria-hidden="true"></i>
</p>
</article>
</div>
</div>
</div>
</section>
<!-- **************************************** -->

<section>
<div class='container'>

<div class='row'>
<div class='text-center col-xs-12'>
<div class='hero-block'>

## Quick to start

</div>
</div>
</div>

<div class='row'>
<div class='text-center col-xs-12 col-md-9 col-lg-7'>

```js
npm install -g postgraphile
postgraphile -c postgres:///dbname \
  --schema schema_name
```

</div>
</div>

<br />
<div class='row'>
<div class='text-center col-xs-12'>
<a class='strong-link' href='/postgraphile/introduction/'>Get started <span class='fas fa-fw fa-arrow-right' /></a>
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
    <p>Keep up to date on Graphile Engine and PostGraphile features/changes.
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
