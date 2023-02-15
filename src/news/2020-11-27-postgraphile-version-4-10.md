---
layout: post
title: PostGraphile Releases Version 4.10 - Framework Friends
date: 2020-11-27T01:00:00Z
path: /news/20201127-postgraphile-410/
tags: announcements, releases, postgraphile
---

Pretty big release, so let's get straight to it: Improved Framework Support

The major feature in this release is much more solid support for various Node.js
webserver frameworks: Node itself, Connect, Express, Koa, Fastify (v2 and v3
🆕), and Restify 🆕. This also fixes some long-standing compatibility issues
with certain Koa plugins 😉

To accomplish this we've split the middleware into separate route handlers for
each of our routes, and you can either use the middleware to delegate to these
(where the framework allows), or you can add the route handlers directly. You
can find documentation in our library usage page and can see examples in our new
server examples folder:
https://github.com/graphile/postgraphile/tree/v4/examples/servers

Along with this we get some new server hooks that you can use in place of (or in
addition to) postgraphile:http:handler that are only called on the relevant
routes: postgraphile:http:eventStreamRouteHandler,
postgraphile:http:faviconRouteHandler, postgraphile:http:graphiqlRouteHandler
and postgraphile:http:graphqlRouteHandler. Upgraded PostGraphiQL

We've upgraded GraphiQL and GraphiQL Explorer.

With the GraphiQL upgrade we now get a dedicated headers editor panel next to
the variables editor, so no more hacky sidebar 🎉 It also adds new "Merge Query"
and "Copy Query" buttons to the enhanced GraphiQL which may ease you development
or debugging flows.

GraphiQL Explorer is now smoother and better looking.

@eddiewang also added the ability to configure credentials for GraphiQL.

Thank you

PostGraphile wouldn't be where it is today without the support of the community;
as always I want to say a huge THANK YOU to all our sponsors and contributors
that make this possible. GraphQL v15

I've had many (many) requests for GraphQL v15 compatibility; this has finally
been added. You should review the GraphQL v15 changes for yourself, and if you
deem them to be breaking for your workflows then you should pin GraphQL v14 in
your projects which PostGraphile continues to support. Domain constrained
composite types

@jcgsville has added a tweak so that domain constrained composite types (CREATE
DOMAIN my_domain AS my_composite_type ..., where my_composite_type is a type
with multiple attributes) are now supported. MaxListenersExceededWarning fix

If you've ever been greeted with:

MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11
graphql:... listeners added to [EventEmitter]. Use emitter.setMaxListeners() to
increase limit

because you use @graphile/pg-pubsub, you can now opt-out of this by passing a
sufficiently large subscriptionEventEmitterMaxListeners option to PostGraphile.
Thanks @xvaara! Features

    HTTP server overhaul, improved framework support (#1361) (317aa40)
    allow access to Fastify request from Node request (#1385) (a3cd8b8)
    hooks for route handlers (#1389) (aeb41de)
    upgrade GraphiQL/GraphiQL Explorer (#1377) (0152244)
    graphiql: add configurable credentials behavior (#1388) (61da7e3) (thanks @eddiewang)
    deps: support for GraphQL v15 (graphile/graphile-engine#689) (3e7f98f) and (#1393) (eb1d1a6)
    pg: support domain constrained composite types (graphile/graphile-engine#615) (215f5cf) (thanks @jcgsville)
    pubsub: add maxListeners to subscription eventEmitter (graphile/graphile-engine#688) (576177f) (thanks @xvaara)
    cli: add Node version info and clarify enhance-graphiql (#1401) (aa7f4f9)

PostgreSQL schema review

If you'd like to give your schema a checkup right now, take pgRITA for a spin!
We also offer one-on-one consultancy over Zoom screen sharing; if that's of
interest you can book a call at https://benjie.dev or email jem @ our website
domain (there's no www 😉) to enquire as to other options. Thanks for your
support!

Full release notes

Full detailed technical release notes can be found on GitHub:

- [4.10.0](https://github.com/graphile/postgraphile/releases/tag/v4.10.0)
- [4.9.2](https://github.com/graphile/postgraphile/releases/tag/v4.9.2)
- [4.9.1](https://github.com/graphile/postgraphile/releases/tag/v4.9.1)
- [4.9.0](https://github.com/graphile/postgraphile/releases/tag/v4.9.0)
