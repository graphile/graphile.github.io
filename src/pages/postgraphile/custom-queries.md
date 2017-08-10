---
layout: page
path: /postgraphile/custom-queries/
title: Custom Queries
---

## Custom Queries

Like computed columns, you can also add root-level Query fields by creating a
PostgreSQL function. The arguments to these functions will be exposed via
GraphQL also - named arguments are preferred, if your arguments are not named
we will assign them an auto-generated name such as `arg1`. The rules that apply
to these are the following:

- if the function accepts arguments, the first argument must NOT be a table type (see computed columns above)
- must return a named type - we do not currently support anonymous types
- must NOT return `VOID`
- must be marked as `STABLE`
- must be defined in one of the introspected schemas

