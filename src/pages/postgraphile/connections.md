---
layout: page
path: /postgraphile/connections/
title: Connections
---

## Connections

We implement Relay's connection spec, so instead of returning simply a list of
records we return a connection which allows you to perform pagination with
ease. We also extend Relay's connection spec a little to give you some extra features
such as:

- `totalCount` - the total number of records matching the record
- `nodes` - just the nodes (no `edge` wrapper) useful if you don't want the cursor for every entry
- `pageInfo.startCursor` and `pageInfo.endCursor` - useful for pagination if you use `nodes { ... }` rather than `edges { cursor, node { ... } }`
