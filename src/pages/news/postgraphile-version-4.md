---
layout: page
path: /news/postgraphile-version-4/
title: PostGraphile Version 4 is released
---

## PostGraphile Launches Verson 4
__A more performant, extensible and customisable GraphQL layer for PostgreSQL__

Benjie Gillam is pleased to announce the release of PostGraphile Version 4, taking PostGraphile up to be the forerunner in GraphQL engines. PostGraphile is the fastest way to get a full client-facing GraphQL API up and running from a PostgreSQL database schema. Backend developers can focus solely on specifying the data schema, business logic and permissions using trusted and familiar PostgreSQL - PostGraphile handles making that available as a high-performance, low-latency GraphQL API; and now it is more performant, exetensible and customisable than ever before. 

* __PostGraphile Version 4 is highly performant__

Benjie has rewritten PostGraphile entirely, putting performance at its core. In doing so, he has reduced latency by 94% and now there are 17 times more successful requests per second. It does this through clever use of the Graphile Engine's look-ahead features and PostgresSQL's excellent query planner, which means that multiple round-trips to the database are avoided and the latency of even the most complex queries is reduced by 94%.

<div class="flex flex-row flex-wrap">
<div class='text-center col-xs-12 col-md-3 col-lg-5 postgraphile-graphs-requests-per-secoond'></div>
<div class='text-center col-xs-12 col-md-3 col-lg-5 postgraphile-graphs-average-latency-label'></div>
</div>

[Read more about the stunning new perforamce of PostGraphile version 4](/postgraphile/performance/)


* __Version 4 is highly customisable__

The user can now customise their PostGraphile GraphQL schema by adding comments to entitles such as tables, columns, functions, relations within their PostgreSQL database. We call this functionality "Smart Comments" and it allows you to easily customise the generated GraphQL schema without making breaking changes to your database.

These changes could be renaming something, omitting things from your GraphQL schema, or anything else the new plugin system supports. This new system also makes deprecating entites in your schema trivally easy.

[Read more about the new smart comments system](/postgraphile/smart-comments/)
  
* __Version 4 is highly extensible__

Version 4 is now modular, which enables the user to write their own plugins to add or remove functionality to PostGraphile. Through the use of the new Graphile Engine, a user can highly customise and extend their schema to reflect their particular use cases. Examples include adding root query or mutation fields, and wrapping existing resolvers; however we hope that users will take this plugin system and begin to write things we haven't even thought of yet. This will make PostGraphile both highly valuable and extensible, as well as put it at the forefront of GraphQL Engines.

[Read more about the new plug in system](/postgraphile/extending/)

__PostGraphile is open source and relies on its community__

This release of PostGraphile couldn’t have been possible without the community. Benjie says, “Support from the Open Source community has been invaluable. There’s been many issues and pull requests which has helped to shape PostGraphile to what it is today. I'm excited to offer this latest release of PostGraphile, which is now the fastest way to to get a full client-facing GraphQL API up and running. I hope this frees up Backend developers to spend their time on their applications and focus on making something awesome." 