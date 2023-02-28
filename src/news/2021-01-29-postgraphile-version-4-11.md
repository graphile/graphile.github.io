---
layout: post
title: "PostGraphile Releases Version 4.11 - Wonderful Websockets"
date: 2021-01-29T01:00:00Z
path: /news/20210129-postgraphile-411/
thumbnail: /images/news/postgraphile-developer2.svg
thumbnailAlt:
  "A developer sits at a laptop, an abstract code graphic is behind her."
tags: announcements, releases, postgraphile
noToc: true

summary:
  "Graphile is pleased to announce the release of PostGraphile version 4.11, an
  upgrade introducing support for GraphQL websockets, extended support for 'enum
  tables', native GraphQL schema validation, and fixes in watch mode."
---

_Announced 2021-01-29 by the Graphile Team_

<p class='intro'>
Graphile is pleased to announce the release of PostGraphile version 4.11, an upgrade introducing support for GraphQL websockets, extended support for 'enum tables', native GraphQL schema validation, and fixes in watch mode.
</p>

### Websocket Support

Thanks to help from author _@enisdenjo_, PostGraphile 4.11 adds support for the
new `graphql-ws` websocket transport module to replace Apollo's unmaintained
`subscriptions-transport-ws`. It's advised that anyone using websockets with
GraphQL move to this new module and protocol.

Opting into this new method also allows the user to perform queries and
mutations this way - but the security implications need to be scrutinised first,
particularly with respect to cross-site request forgery issues as websockets
behave in a different way.

<div class="flex flex-wrap justify-around">
<img alt="A developer sits at a laptop, an abstract code graphic is behind her." src="/images/news/postgraphile-developer2.svg" style="max-height: 300px" />
</div>

### GraphQL Schema Validation

We were surprised to realize that we hadn't yet had PostGraphile validate its
GraphQL schema! Fortunately, the schema PostGraphile builds has always been
valid, and now we have made sure it checks for this. This means that any bugs in
third-party plugins will now be caught before the server goes live.

### Other Additions

- Support for
  ["enum tables"](https://www.graphile.org/postgraphile/enums/#with-enum-tables)
  has been extended to views.
- A bug in watch mode (which is not intended for production usage) which could
  result in pool exhaustion has been resolved.
- A minor performance enhancement to `pg-sql2` that allows re-use of `sql.value`
  nodes for improved PostgreSQL query planning and marginally more efficient
  queries.
- GraphiQL now contains enhancements to the "Merge" functionality

There are also a number of bug fixes, see the
[release notes](https://github.com/graphile/postgraphile/releases/tag/v4.11.0)
for the full details

### Thank you

By significantly reducing the amount of work needed to achieve business goals,
PostGraphile results in huge savings for users. If your organization contributes
some of these savings back then everyone can benefit from more frequent releases
with better performance, better compatibility, better documentation, easier
customization, and more features — leading to even greater savings or profits
for your organization.

[More details about how and why to sponsor Graphile are on our Sponsor page.](/sponsor/)

<div class="flex flex-wrap justify-around">
<img alt="A cartoon woman sends hearts up into the sky ." src="/images/undraw/undraw_super_thank_you_small.png" style="max-height: 300px" />
</div>
Full release notes available on GitHub:

- [v4.11.0](https://github.com/graphile/postgraphile/releases/tag/v4.11.0)
- [v4.10.0](https://github.com/graphile/postgraphile/releases/tag/v4.10.0)
