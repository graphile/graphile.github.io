---
layout: page
path: /postgraphile/functions/
title: Functions
---

## PostgreSQL Functions

One of the easiest ways to add more capabilities to your PostGraphile schema
is with PostgreSQL functions. The three main methods are:

* [Computed Columns](/postgraphile/computed-columns/) enable you to add a computed field to a table type
* [Custom Queries](/postgraphile/custom-queries/) enable you to add a root level Query field which can return a scalar, list, custom type, table row or even a table connection
* [Custom Mutations](/postgraphile/custom-mutations/) enable you to add a root level Mutation field which can cause modifications to your database and return nothing (`void`), a scalar, list, custom type, table row or list of table rows (but not a connection, since you cannot paginate over a mutation)