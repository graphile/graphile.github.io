---
layout: page
path: /postgraphile/custom-mutations/
title: Custom Mutations
---

## Custom Mutations

If the built in [CRUD Mutations](/postgraphile/crud-mutations/) are not
sufficient for your purposes, you can create PostgreSQL functions that perform
complex mutations too. For these functions the following rules apply:

- must return a named type - we do not currently support anonymous types; can return `VOID`
- must be marked as `VOLATILE` (which is the default)
- must be defined in one of the introspected schemas

TODO: provide example
