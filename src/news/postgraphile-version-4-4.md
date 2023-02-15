---
layout: page
path: /news/postgraphile-version-4-4/
title: PostGraphile Releases Version 4.4 - Real-time!
noToc: true
---

_Announced 2019-05-03_

<p class='intro'>
Graphile is pleased to announce the release of PostGraphile version 4.4.0, a backwards-compatible* upgrade recommended for all PostGraphile users.
</p>

The headline feature in 4.4 is real-time support. Previously, GraphQL
subscriptions were only available in PostGraphile via the “supporter” plugin
(for Patreon sponsors). We’ve overhauled this functionality and released it as
open source, added built-in support for subscriptions to our PostGraphiQL
editor, and also added experimental support for live queries.

Besides these exciting features, a lot of improvements and minor features have
been added, including: performance improvements; revised handling of PostgreSQL
restarts and server availability on startup; having `makeExtendSchemaPlugin` do
more for you automatically; giving you a way to choose between lists and Relay
connections on a per-table, per-function or per-constraint basis; and adding a
plugin dependency/ordering system.

PostGraphile is crowd-funded open-source software, it relies on financial
contributions from the individuals and companies that are using it in order to
keep advancing. Please [sponsor the project](/sponsor/), you will surely reap
the rewards!

Technical details of this release can be found in the
[release notes](https://github.com/graphile/postgraphile/releases/tag/v4.4.0),
or read on for more information on Subscriptions and Live Queries.

_\* there’s a small number of fixes which may cause issues for existing
applications that were relying on broken behaviour, these are outlined in the
“Breaking Fixes” section of the release notes, along with how to opt-out of
these fixes._

### GraphQL Subscriptions

GraphQL Subscriptions are an official feature, detailed in the GraphQL
specification. They enable your application to request a certain query be
performed whenever the specified event occurs on the GraphQL server, for example
`emailReceived`, `userStatusChanged`, `notificationAdded`, or `messageArchived`.

<div class="tc">
<img alt="Real-time subscriptions" src="/images/undraw_realtime.png" />
</div>

To enable this real-time feature, a long running connection is required with the
server. In PostGraphile we achieve this via websockets, the de-facto standard
for real-time GraphQL targeting web browsers and mobile apps.

_Note: with a standard GraphQL subscription, the query is only executed when the
specified event occurs, making it an efficient way of subscribing to particular
events without being notified of every data change on the backend._

Subscriptions are the recommended way of adding real-time features to your
GraphQL API.

[Read more about PostGraphile subscriptions in the documentation.](/postgraphile/subscriptions/)

### PostGraphile Live Queries

A “live query” monitors the query a user provides and gives the client an
updated version whenever the query would return a different result. You can
think of it as akin to extremely frequent polling of a regular query, but
without the bandwidth costs. Live queries are not yet an official feature of
GraphQL, and so there are a number of different implementations. PostGraphile’s
live queries do not require specific client software since we use the standard
GraphQL subscriptions interface — simply change your `query` to a `subscription`
and it becomes live, as in the following example
([available on GitHub](https://github.com/graphile/livesotope)) showing
real-time points rankings of fictional players:

<div class="tc">
<img alt="Changing a query to a live query" src="/images/query2subscription.png" style="max-height: 230px" />
</div>

<p></p>

<div class="tc">
<img alt="Demo of live query" src="/images/live_demo_rankings.gif" />
</div>

Live queries are an incredibly powerful tool for frontend developers, as it
means they don’t need to worry about monitoring for changes in the data — they
know the data they’ve requested will always be up to date. However, live queries
are not a panacea: they can come with significant backend cost and/or
complexity.

PostGraphile has worked hard to decrease the costs associated with live queries,
but there’s still more to be done. Currently we feel PostGraphile live queries
may be suitable in apps with relatively small user bases (such as for internal
tooling used across a large enterprise), but if you’re targeting an internet
scale deployment hoping for millions of users you will likely be better off
using traditional subscriptions (or keeping live queries to a very small area of
your application). There are lots of factors that may go into deciding if live
queries are a good fit for your problem; if you need help deciding then you may
wish to engage our consultancy services.

There will be more enhancements in live queries in future. If you're interested
in helping in this development please get in touch
[via our Discord chat](http://discord.gg/graphile).

[Read more about PostGraphile live queries in the documentation.](/postgraphile/live-queries/)

### Help us to help you!

By significantly reducing the amount of work needed to achieve business goals,
PostGraphile results in huge savings for users. If your organization contributes
some of these savings back then everyone can benefit from more frequent releases
with better performance, better compatibility, better documentation, easier
customization, and more features — leading to even greater savings or profits
for your organization.

Huge thanks to the 70 individuals and companies already sponsoring PostGraphile!

[Click here to find out more about why and how you should sponsor PostGraphile development.](/sponsor/)

<div class="tc">
<img alt="Thank you" src="/images/thanks.png" />
</div>

### Full release notes

As always, we’ve published detailed technical release notes to GitHub:

- [v4.4.0 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.4.0)
- [v4.3.3 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.3.3)
- [v4.3.2 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.3.2)
- [v4.3.1 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.3.1)
- [v4.2.0 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.2.0)
- [v4.1.0 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.1.0)
- [v4.0.0 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.0.0)
