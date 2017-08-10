---
layout: page
path: /postgraphile/connections/
title: Connections
---

## Connections

We implement the [Relay Cursor Connections
Specification](https://facebook.github.io/relay/graphql/connections.htm) (with
a few enhancements), so instead of returning simply a list of records we return
a connection which allows you to perform cursor-based pagination with ease.
This is seen as a GraphQL best practice.

The enhancements that we apply on top of Relay's connection spec include:

- `totalCount` - the total number of records matching the query (excluding cursor/limit/offset constraints)
- `nodes` - just the nodes (no `edge` wrapper) useful if you don't need the cursor for every entry and want a simple data structure
- `pageInfo.startCursor` and `pageInfo.endCursor` - useful for pagination if you use `nodes { ... }` rather than `edges { cursor, node { ... } }`

It's also possible to filter connections using [conditions](/postgraphile/filtering/).
