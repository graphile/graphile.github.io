---
layout: post
title: PostGraphile Releases Version 4.11 - Wonderful Websockets
date: 2021-01-29T01:00:00Z
path: /news/20210129-postgraphile-411/
tags: announcements, releases, postgraphile
---

<p class='intro'>
Graphile is pleased to announce the release of PostGraphile version 4.11 aggregates. 
</p>

Thanks to help from the author @enisdenjo, this release adds support for the new
graphql-ws websocket transport module to replace Apollo's unmaintained
subscriptions-transport-ws. It's advised that anyone using websockets with
GraphQL move to this new module and protocol. You can also now perform queries
and mutations over the websocket transport if you opt into this; when doing so
you should be very very careful of security implications (particularly
CORS/cross-site request forgery issues, since websockets behave differently in
this way).

We've also extended support for "enum tables" to views and given graphile-utils'
makeExtendSchemaPlugin support for defining and extending interfaces.

There was a bug in watch mode (which is not intended for production usage) which
could result in pool exhaustion if your PostgreSQL connection keeps being
unexpectedly terminated (e.g. PostgreSQL restarting or pg_terminate_backend
being called); this is now resolved.

One major change in this release is that we now validate the GraphQL schema
that's built. Apparently we've not done that over the last 3 years (!!).
Fortunately the schema that PostGraphile defines is already valid, but this at
least means that bugs in third-party plugins will be caught before the server
goes live.

We also have a minor performance enhancement to pg-sql2 that allows re-use of
sql.value nodes for improved PostgreSQL query planning and marginally more
efficient queries.

The special GRAPHILE_TURBO environmental variable, if you use it, is only valid
on the latest LTS release of Node. This is now Node 14; so this release notes
you can no longer use GRAPHILE_TURBO with Node 12 (rather than just giving you a
weird crash when you try to do so).

We've also updated GraphiQL, which now contains my enhancements to the "Merge"
functionality - we can now merge things more deeply by using schema type
information. ❤️ THANK YOU SPONSORS 🙏 Bug Fixes

    graphql: ensure buildSchema fails on invalid GraphQL schema (engine#695) (c837e09)
    pg-sql2: use same placeholder for same sql.value node (engine#705) (969d923)
    turbo: warn users that Node v14 is required (#1411) (36481db)
    docker: remove GRAPHILE_TURBO (#1407) (af39c3d)
    ws: fix missing websockets config on CLI (#1417) (4e58a0e)
    watch: fix pool leak on unexpected connection termination (engine#711) (b2fbc21)

Features

    enum: enum views (engine#704) (d2770a5)
    utils: makeExtendSchemaPlugin interfaces support (engine#696) (8af9ed5)
    subscriptions: support graphql-ws and all operations over websockets (#1338) (c04d670) - thanks @enisdenjo

Full release notes available on GitHub

- [v4.11.0](https://github.com/graphile/postgraphile/releases/tag/v4.11.0)
