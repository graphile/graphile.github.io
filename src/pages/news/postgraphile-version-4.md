---
layout: page
path: /news/postgraphile-version-4/
title: Postgraphile Version 4 is released
---

## Postgraphile Launches Verson 4
__A more performant, extensible and customisable GraphQL layer for PostgreSQL__

Benjie Gillam is pleased to announce the release of Postgraphile Version 4, taking Postgraphile up to be the forerunner in GraphQL engines. Postgraphile is an open source project which instantly builds a GraphQL API layer over a Postgres database, and now it is more performant, exetensible and customisable than ever before. 

__Postgraphile V4 is highly performant__

Benjie has rewritten Postgraphile entirely, putting performance at its core. In doing so, he has reduced latency by 95% and now there are 17 times more successful requests per second. It does this through clever use of the Graphile Engine's look-ahead features and PostgresSQL's excellent query planner, which means that multiple round-trips to the database are avoided and the latency of even the most complex queries is reduced by 94%.

<div class="flex flex-row flex-wrap">
<div class='text-center col-xs-12 col-md-3 col-lg-5 postgraphile-graphs-requests-per-secoond'></div>
<div class='text-center col-xs-12 col-md-3 col-lg-5 postgraphile-graphs-average-latency-label'></div>
</div>


 * Highly customisable - with the new smart comments system, the user can rename or omit columns entirely from the database schema without touching the database itself. 

 * Highly extensible - the new plugin system enables users to add extra functionality to Postgraphile, enabling them to have powerful control over their API system.

This release of Postgraphile couldn’t have been possible without the community. Benjie says, “Support from the Open Source community has been invaluable. There’s been many issues and pull requests which has helped to shape Postgraphile to what it is today. And, of course, donations to my Patreon really help increase the number of hours I can put into this”


##A little about GraphQL and Postgraphile##

Postgraphile is the fastest way to get a full client-facing GraphQL API up and running from a PostgreSQL database schema. Backend developers can focus solely on specifying the data schema, business logic and permissions using trusted and familiar PostgreSQL - PostGraphile handles making that available as a high-performance, low-latency GraphQL API.