---
layout: page
path: /news/postgraphile-version-4/
title: PostGraphile Version 4 is released
---

## PostGraphile Launches Version 4

__A more performant, extensible and customisable GraphQL layer for PostgreSQL__
__The original GraphQL API for Postgres now vastly more performant, customisable and exensible__


After a year of development and testing, Benjie Gillam is pleased to announce the release of PostGraphile v4 - the most customisable and extensible automatic GraphQL API for PostgreSQL. PostGraphile (previously known as PostGraphQL) has been re-written from the ground up with a strong focus on performance, best practices.

Benjie Gillam (@Benjie) is pleased to announce the release of PostGraphile Version 4, taking PostGraphile up to be the forerunner in GraphQL engines.

Developers can get started with PostGraphile with just one command. 

Postgraphile exposes the powerful next gen features of PostgreSQL enableing developers to specify their data shcema and business logic (without having to learn new tooling) use their existing database business logic and dont have to learn new tooling

Postgraphile is flexible - you can use it with new or existing databases. No need to learn new tooling, Postgraphile exposes the powerful ... 

Don't learn Postgraphile learn Postgres

With Postgraphile, developers dont need to learn or trust another set of tooling and interfaces, instead they can leverage their existing PostgreS knowledge to build a secure and highly performant GraphQL API

PostGraphile is the fastest way to get a GraphQL API from a PostgreSQL database, allowing backend developers to focus on the important parts - data schema and business logic. - PostGraphile handles making that available as a high-performance, low-latency GraphQL API; and now it is more performant, exetensible and customisable than ever before. 

Benjie Gillam (@Benjie) is pleased to announce the release of PostGraphile Version 4, taking PostGraphile up to be the forerunner in GraphQL engines. PostGraphile is the fastest way to get a GraphQL API from a PostgreSQL database, allowing backend developers to focus on the important parts - data schema and business logic. - PostGraphile handles making that available as a high-performance, low-latency GraphQL API; and now it is more performant, exetensible and customisable than ever before. 

using trusted and familiar PostgreSQL 

Postgraphile encourages developers to embrace the powerful features of Postgres, the most adanvced open source database, rather than trust and learn a new set of tools and interfaces


* __PostGraphile Version 4 is highly performant__

Benjie has rebuilt the core of PostGraphile entirely, with a strong focus on performance; enabled via the invention of Graphile Engine. 

Unlike other solutions, Postgraphile is able to look at the GraphQL query holistically and find the most efficient way of executing it. This has led to 17x the request throughput with latency reduced by 94% and peak memory usage reduced by 92% as compared to Version 3.


<div class="flex flex-row flex-wrap">
<div class='text-center col-xs-12 col-md-3 col-lg-5 postgraphile-graphs-requests-per-secoond'></div>
<div class='text-center col-xs-12 col-md-3 col-lg-5 postgraphile-graphs-average-latency-label'></div>
</div>

[Read more about the stunning new performance of PostGraphile version 4](/postgraphile/performance/)


* __Version 4 is highly customisable__

Postgraphile version 4 introuces "Smart Comments" enabling the user to control the generated graphQL schema without modifying the underlying database tables and columns. Operations include renaming types and fields, controlling the circumstances a column will be exposed and even handling deprecation gracefully.

PG v 4 now inspects the database permissions, meaning that tables and columns that are not granted to the user are not exposed for example, if you have a table with five coloumns but only two of them are updateable, then only those two columns are exposed via the update mutation. 

The user can now customise their PostGraphile GraphQL schema by adding comments to entitles such as tables, columns, functions and relations within their PostgreSQL database. PostGraphile calls this functionality "Smart Comments" and it allows the user to easily customise the generated GraphQL schema without making breaking changes to your database.

These changes could be renaming something, omitting things from the GraphQL schema, or anything else the new plugin system supports. This new system also makes deprecating entites in the schema trivally easy.

[Read more about the new smart comments system](/postgraphile/smart-comments/)
  
* __Version 4 is highly extensible__

Version 4 is now modular, which enables the user to write their own plugins to add or remove functionality to PostGraphile. Through the use of the new Graphile Engine, a user can highly customise and extend their schema to reflect their particular use cases. Examples include adding root query or mutation fields, and wrapping existing resolvers; however the hope is that users will take this plugin system and begin to write things which haven't even thought of yet. This will make PostGraphile both highly valuable and extensible, as well as put it at the forefront of GraphQL Engines.


Before commencing wok on Graphile Engine, Benjie reviewed every issue in the Postgraphile bug tracker, and discovered that a rigid once-size-fits all GraphQL API was resulting in many stale forks and frustrated users. With this in mind, PG V4 was rebuilt with an extremely powerful GraphQL Plug in sustem which lives at the heart of GE, enabling users to add new functionality to their GraphQL schema without requiring modifications to the core Postgraphile software. 

Despite the early nature of this plugin system, there is already a burgeoning (community of plugings) from coplex like adding powerful filtering capabilites to graphql connections, to simplfying naming across the entire schema.


[Read more about the new plug in system](/postgraphile/extending/)

__PostGraphile is open source and relies on its community__

This release of PostGraphile couldn’t have been possible without the community. Benjie says, “Support from the Open Source community has been invaluable. There’s been many issues and pull requests which has helped to shape PostGraphile to what it is today. I'm excited to offer this latest release of PostGraphile, which is now the fastest way to to get a full client-facing GraphQL API up and running. I hope this frees up Backend developers to spend their time on their applications and focus on making something awesome." 