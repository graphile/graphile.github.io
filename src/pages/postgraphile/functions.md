---
layout: page
path: /postgraphile/functions/
title: Functions
---

## PostgreSQL Functions

You can use PostgreSQL functions to add extra fields to your GraphQL schema.

* [Computed Columns](/postgraphile/computed-columns/) enable you to add a computed field to a table type
* [Custom Queries](/postgraphile/custom-queries/) enable you to add a root level Query field which can return a scalar, list, custom type, table row or even a table connection
* [Custom Mutations](/postgraphile/custom-mutations/) enable you to add a root level Mutation field which can cause modifications to your database and return nothing (`void`), a scalar, list, custom type, table row or list of table rows (but not a connection, since you cannot paginate over a mutation)
