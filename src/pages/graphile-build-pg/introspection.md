---
layout: page
path: /graphile-build-pg/introspection/
title: Introspection
---

## Introspection

We look through the PG catalog to see what tables, functions, relations etc are
available in your schemas. You provide the list of schemas to inspect via the
`pgSchemas` setting, e.g. `pgSchemas: ["public"]`.

If you're interested to see how we do this, the introspection query can be
found [in our
GitHub](https://github.com/graphile/graphile-build/blob/master/packages/graphile-build-pg/res/introspection-query.sql).
