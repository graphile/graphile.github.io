---
layout: post
title: PostGraphile Releases Version 4.12 - Awesome Aggregates
date: 2021-05-27T01:00:00Z
path: /news/20210527-postgraphile-412/
thumbnail: /images/news/postgraphile-developers.svg
thumbnailAlt: "A pair of developers sit in front of a computer monitor."
tags: announcements, releases, postgraphile
noToc: true

summary:
  "Graphile is pleased to announce the release of PostGraphile version 4.11, an
  upgrade introducing support for GraphQL websockets, extended support for 'enum
  tables', native GraphQL schema validation, and fixes in watch mode."
---

<p class='intro'>
Graphile is pleased to announce the release of PostGraphile version 4.12 - a significant update bringing full support for aggregates. 
</p>

We've finally taken our proof of concept aggregation plugin and fleshed it out
with some very significant features: calculating aggregates across connections,
grouped aggregates, applying conditions to grouped aggregates, ordering by
relational aggregates, filtering by the results of aggregates on related
connections, etc.

For more details check out the plugin: https://github.com/graphile/pg-aggregates

<div class="flex flex-wrap justify-around">
<img alt="A pair of developers sit in front of a computer monitor." src="/images/news/postgraphile-developers.svg" style="max-height: 300px" />
</div>

This release also includes a few small fixes and some other minor features that
enable greater community expansion of PostGraphile. We love seeing your
plugins - do share them in our #i-made-this channel on Discord and/or add them
to the list on the website! Features

    middleware: add a release() function (experimental) (#1396) (818dad6)
    utils: support for NULLS FIRST/LAST in orderByAscDesc (#737) (99b1a8e)
    pg: connections can use named queries (#715) (352dab3)
    pg: makeProcField can be used to construct aggregates (#714) (8e0102b)
    pg: procFieldDetails helper (#717) (59a07a2)
    export pgSmartTagRulesFromJSON (#722) (48e07cd)
    hooks: add postgraphile:liveSubscribe:executionResult hook (#1483) (73fe801)

Bug Fixes

    explain: fix 'unhandled' promise rejection (#1442) (716efb0)
    order: fix order by computed column SQL item bug (#741) (0635ecb)
    uniqueKey/pgViewUniqueKey applies to views (#739) (b715f6d)
