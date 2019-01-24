---
layout: page
slug: /postgraphile/filtering/
title: Filtering
---

## Filtering

We support rudimentary filtering on [connections](/postgraphile/connections/)
using a `condition` argument. Currently this allows you to filter for
specific values (e.g. `username: "Alice"` or `category: ARTICLE`) but more
advanced filters are being discussed. It's important when implementing
filters to keep performance in mind, for that reason it's likely that version
5 will not expose filters for columns that are not indexed.

### Filter Plugin

One of the PostGraphile community members, Matt Bretl, maintains a filter
plugin with many advanced filtering capabilities, located at
[https://github.com/graphile-contrib/postgraphile-plugin-connection-filter](https://github.com/graphile-contrib/postgraphile-plugin-connection-filter);
you might like to check it out.
