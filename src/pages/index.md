---
layout: marketing
path: /
title: Tools to build extensible and performant GraphQL APIs
---

<!-- **************************************** -->

<header class='hero'>
<div class='hero-block center'>

# A suite of tools for building performant pluggable GraphQL APIs.

</div>
</header>


<!-- **************************************** -->

<section>
<div class='container center'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## PostGraphile: instant GraphQL API for PostgreSQL database

Auto-discovers tables, columns, relations, procedures and more; runs a
high-performance secure GraphQL API server that adheres to best practices.

</div>
</div>
</div>

<div class='row'>
<div class='col-lg-6 col-xs-12'>

##### Just concentrate on your database
```sql
CREATE TABLE app_public.superheroes (
  id serial not null primary key,
  name text not null
);
ALTER TABLE superheroes ENABLE ROW LEVEL SECURITY;
```

</div><!-- /col-6 -->
<div class='col-lg-6 col-xs-12'>

##### Run a fully-fledged GraphQL API in one command
```bash
postgraphile
  -c postgres://localhost/superheroes
  --schema app_public
  --watch
  --jwt-secret "$JWT_SECRET"
```

</div>
</div>

<br />
<div class='d-flex justify-content-center'>
<a class='button button--outline' href='/postgraphile/'>More about PostGraphile &rarr;</a>
</div>


</div>
</section>

<!-- **************************************** -->

<section>
<div class='container center'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## Graphile Build: high-performance pluggable GraphQL schema tools

Prefer building your GraphQL APIs by hand? By using our [look-ahead
feature](/graphile-build/look-ahead/) your code can know what's coming and make
sure it requests the correct fields ahead of time, leading to fewer round-trips
and higher performance. Our [plugin architecture](/graphile-build/plugins/)
allows you to extend or enhance your GraphQL API as your needs evolve over time,
and use community-built plugins to increase developer productivity.

</div>
</div>
</div>

<div class='row'>
<div class='col-xs-12 col-lg-6'>

##### `graphql`:

```js{2}
const MyType =
  new GraphQLObjectType({
    name: 'MyType',
    fields: {
      // ...
```

</div>
<div class='col-xs-12 col-lg-6'>

##### `graphile-build`:

```js{2}
const MyType =
  newWithHooks(GraphQLObjectType, {
    name: 'MyType',
    fields: {
      // ...
```

</div>
</div>

<br />
<div class='d-flex justify-content-center'>
<a class='button button--outline' href='/postgraphile/'>More about Graphile Build &rarr;</a>
</div>

</div>
</section>

<!-- **************************************** -->

<section>
<div class='container center'>

<div class='row'>
<div class='col-xs-12'>
<div class='hero-block'>

## Fully GraphQL compatible

Graphile uses the <a href="http://graphql.org/graphql-js/">reference GraphQL
implementation</a> under the hood, so you know it's spec compliant. This also
means you can mix it into existing GraphQL APIs, or mix existing GraphQL object
types into it (so long as they use the reference GraphQL implementation too).

PostGraphile supports GraphQL best practices, including: [cursor-based
connection
pagination](https://facebook.github.io/relay/graphql/connections.htm), [global
object
identification](https://facebook.github.io/relay/graphql/objectidentification.htm),
and the [Relay Input Object Mutations
Specification](https://facebook.github.io/relay/graphql/mutations.htm); plus
it's built on Graphile Build technology so it can be expanded using Graphile
Build plugins.

</div>
</div>
</div>

</div>
</section>

<!-- **************************************** -->

<section class='mailinglist'>
<div class='container'>

<div class='row justify-content-center'>
<div class='col-xs-12'>
<div class='hero-block center'>

## Questions, comments or feedback? [info@graphile.org](mailto:info@graphile.org?subject=Graphile%20question/comment/feedback:)

</div>
</div>
</div>

<div class='row justify-content-center'>
<div class='col-xs-12 center'>
<div class='hero-block'>

<div>
<form action="//graphile.us16.list-manage.com/subscribe/post?u=d103f710cf00a9273b55e8e9b&amp;id=c3a9eb5c4e" method="post"
id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
  <div id="mc_embed_signup_scroll" class="center hero-block">
    <p>Keep up to date on Graphile and PostGraphile features/changes.
    Subscribe to our occasional announcements newsletter:</p>
    <div class="mc-field-group form-inline justify-content-center">
      <div class='form-group'>
        <label for="mce-EMAIL">Email address</label>
        <input
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          class="required email signup-field form-control mx-sm-3"
          id="mce-EMAIL"
          name="EMAIL"
          spellcheck="false"
          type="email"
          value=""
        />
        <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
        <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_d103f710cf00a9273b55e8e9b_c3a9eb5c4e" tabindex="-1" value="" /></div>
        <input
          class="button btn btn-primary signup-button"
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

</div>
</section>

<!-- **************************************** -->
