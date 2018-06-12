---
layout: marketing
path: /postgraphile/
title: PostGraphile - full GraphQL API server in an instant from PostgreSQL database
---

<!-- **************************************** -->

<header class='hero simple'>
<div class='container'>
<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

# PostGraphile

<h3>
  Instant GraphQL API for PostgreSQL database
</h3>

<br />
<div class='flex'>
<a class='button--solid-light' href='/postgraphile/introduction/'>Documentation <span class='fa fa-fw fa-long-arrow-right' /></a>
</div>

</div>
</div>
</div>
</div>
</header>

<!-- **************************************** -->

<section>
<div class='container'>

<div class='row flex-wrap-reverse'>
<div class='text-center col-xs-12 col-md-9 col-lg-7'>
<div class='hero-block'>

## Try it now!

The fastest way to get a full GraphQL API up and running based on a PostgreSQL
database schema.


```js
npx postgraphile -c postgres://user:pass@host/dbname \
  --schema schema_name
```

See the [Quick Start Guide](/postgraphile/quick-start-guide/) to get PostGraphile up and running.

_Note: `npx` comes bundled with the latest Node.js releases._


</div>
</div>
<div class='text-center col-xs-12 col-md-3 col-lg-5 postgraphile-logo-bg'>
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
PostgreSQL - PostGraphile handles making that available as a GraphQL API.

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

Using graphile-build's [look-ahead](/graphile-build/look-ahead/) features a
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

The GraphQL schema PostGraphile uses is entirely built from [Graphile Build
plugins](https://github.com/graphile/graphile-build/tree/master/packages/graphile-build-pg/src/plugins),
you can disable any of the built in plugins to restrict the functionality or
add additional plugins to extended or enhanced your generated schema.

This allows you to add (or remove) fields, create new types, add functionality,
replace functionality or or even tweak existing functionality (e.g. wrapping an
existing resolver with your own higher-order function) to gain powerful control
over your API.

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

PostGraphile and Graphile-Build use the [reference GraphQL
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
`--watch` CLI flag - it will automatically re-generate the GraphQL schema when
your database changes. What's more, it will automatically reload GraphiQL's
documentation too, so you can see your new schema features right away! No need
to restart the server!

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

PostGraphile uses industry standard JWT authentication, allowing for stateless
authentication which also works great with CORS. When used as a middleware it
can use any HTTP authentication method that Node.js supports, via the
[pgSettings](http://graphile.meh/postgraphile/usage-library/#exposing-http-request-data-to-postgresql)
function. (A favourite is to use Passport.js for social login.)

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
postgraphile -c postgres://user:pass@host/dbname \
  --schema schema_name
```

</div>
</div>

<br />
<div class='row'>
<div class='text-center col-xs-12'>
<a class='strong-link' href='/postgraphile/introduction/'>Get started <span class='fa fa-fw fa-long-arrow-right' /></a>
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
