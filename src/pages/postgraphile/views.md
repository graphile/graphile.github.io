---
layout: page
path: /postgraphile/views/
title: Views
---

## Views

Views are a great solution for abstraction.  

### Abstract Business Logic

We can prepare certain business queries in advance and expose it as GraphQL.
For example, say we want `Comedy` films from our `films` table,
we can create a `view` that contains the specific film type.

```sql
CREATE TABLE app_public.films (
  id serial PRIMARY KEY,
  name text,
  release_year int,
  kind text
);
```

```sql
CREATE VIEW comedies AS
    SELECT *
    FROM app_public.films
    WHERE kind = 'Comedy';
```

And query this `view` as it was a normal table:

```graphql
  comedies (first: 20) {
    name
    releaseYear
  }
```

### API Layer

Using `views`, one can create a layer of API that won't break
while making changes to the tables themselves.

PostGraphile supports reading from and writing to views; however PostgreSQL
lacks the powerful introspection capabilities on views that it has on tables,
so we cannot easily automatically infer the relations. However, you can [use
our "smart comments" functionality to add constraints to
views](/postgraphile/smart-comments/#constraints) which will make them a lot
more table-like (giving them a primary key so you can get a `nodeId`, adding
foreign key references between views and other views or tables, setting
columns as non-null).

Help expanding this page would be welcome, please use the "Suggest
improvements to this page" link above.
