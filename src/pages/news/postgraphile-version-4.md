---
layout: page
path: /news/postgraphile-version-4/
title: PostGraphile Version 4 is released
---

## PostGraphile Launches Version 4

__The original GraphQL API for Postgres: now vastly more performant, customisable and extensible than ever before__

After a year of development and testing, Benjie Gillam is pleased to announce the release of PostGraphile version 4 - the most customisable and extensible automatic GraphQL API for PostgreSQL yet. PostGraphile - previously known as PostGraphQL -  has been re-written from the ground up with a strong focus on performance, best practices and flexibility. This has been enabled through the creation of Graphile Engine - a powerful datasource-agnostic GraphQL Engine that has extensibility and performance at its core - upon which PostGraphile Version 4 is built.

PostGraphile exposes the powerful next generation features of PostgreSQL, enabling developers to use their existing Postgres knowledge to build a secure and highly performant GraphQL API with just one command line. PostGraphile encourages developers to embrace the powerful features of Postgres, the most advanced open source database, rather than trust and learn a new set of tools and interfaces.

* __PostGraphile Version 4 is highly performant__

Benjie has rebuilt the core of PostGraphile entirely, with a strong focus on performance. Unlike other solutions, PostGraphile is able to look at the GraphQL query holistically and find the most efficient way of executing it. This has lead to a large increase in the request throughput, and a 94% decrease in latency. Peak memory usage has also reduced by 92% as compared to Version 3. This all leads to a much improved time for API requests, leaving the developer with a much faster application overall.


<div class="flex flex-row flex-wrap">
<div class='text-center col-xs-12 col-md-3 col-lg-5 postgraphile-graphs-requests-per-second'></div>
<div class='text-center col-xs-12 col-md-3 col-lg-5 postgraphile-graphs-average-latency-label'></div>
</div>

[Read more about the stunning new performance of PostGraphile version 4](/postgraphile/performance/)


* __Version 4 is highly customisable__

Version 4 enables the user to customise and streamline their GraphQL schema. It now filters functionality from PostgreSQL extensions by default, enables the user to remove or renaming certain features with "smart comments", and it's also introduced the capability of limiting what is exposed in the GraphQL schema based on the PostgreSQL permissions. This makes for a much simplified generated schema which the user fully controls.

The new smart comments function enables the developer to customise their GraphQL schema as they see fit. By adding smart comments, the developer can easily perform operations such as renaming columns without modifying the underlying database. Current operations include renaming types and fields, controlling the circumstances a column will be exposed and even handling deprecation gracefully. This functionality is set up such that it can be extended in the future through the use of the new community plug-in system.


[Read more about the new smart comments system](/postgraphile/smart-comments/)
  
* __Version 4 is highly extensible__

Before commencing work on PostGraphile Version 4, Benjie reviewed every issue in the PostGraphile bug tracker, and discovered that a rigid one-size-fits all GraphQL API was too restrictive: it resulted in users having to resort to forking the project or using workarounds such as schema stitching to add their desired functionality. With this in mind PostGraphile became a modular project, with its GraphQL generation powered by a new project named Graphile Engine. Users can now add new functionality to their GraphQL schema without requiring modifications to the core PostGraphile software by using or developing Graphile Engine plugins. This negates the user's need to maintain their own forks of PostGraphile and leads to a smoother and more seamless GraphQL experience.

Despite the early nature of this plugin system, there is already a burgeoning community of plugin writers. Some early examples of community plugins include simplifying naming across the entire generated schema and also adding powerful filtering capabilities to GraphQL connections. The hope is that users will take the beginnings of this plugin system and write things which haven't even been thought of yet. This will make PostGraphile both highly valuable and extensible, as well as put it and Graphile Engine at the forefront of GraphQL Engine development.

[Read more about the new plug in system](/postgraphile/extending/)

__PostGraphile is open source and relies on its community__

This release of PostGraphile couldn’t have been possible without the community. Benjie says, “Support from the Open Source community has been invaluable. There have been many issues and pull requests which has helped to shape PostGraphile to what it is today. I'm excited to offer this latest release of PostGraphile, which is now the fastest way to to get a full client-facing GraphQL API up and running. I hope this frees up backend developers to spend their time on their applications and focus on making something awesome."