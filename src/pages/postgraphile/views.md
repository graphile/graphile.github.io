---
layout: page
path: /postgraphile/views/
title: Views
---

## Views

Views are a great solution for abstraction.
PostGraphile supports reading from and writing to views; however PostgreSQL
lacks the powerful introspection capabilities on views that it has on tables,
so we cannot easily automatically infer the relations. However, you can [use
our "smart comments" functionality to add constraints to
views](/postgraphile/smart-comments/#constraints) which will make them a lot
more table-like (giving them a primary key so you can get a `nodeId`, adding
foreign key references between views and other views or tables, setting
columns as non-null).

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

### Flatten API

`Views` enable to flatten a nested object that is built from multiple tables.

```sql
CREATE TABLE app_public.person (
  id serial PRIMARY KEY
);

CREATE TABLE app_public.address (
  id serial PRIMARY KEY,
  country text,
  street text,
  person_id int references app_public.person (id)
);

CREATE VIEW person_view AS
  SELECT person.id, address.country, address.street
  FROM app_public.person person
  INNER JOIN app_public.address address on person.id = address.person_id;
```

And now the `GraphQL` query is flatten:

```graphql
person {
  id
  address {
    country
    street
  }
}

personView {
  id
  country
  street
}
```

**_NOTE: you can use [smart comments](/postgraphile/smart-comments) to change the GraphQL field name_**

### Authorization

Authorization can be enforced using `views` as well, for example, exposing some data only to authenticated users:

```sql
CREATE TABLE app_public.person (
  id serial PRIMARY KEY
);

CREATE TABLE app_public.personal_data (
  id serial PRIMARY KEY,
  secret1 text,
  secret2 int,
  person_id references app_public.person (id)
);

CREATE VIEW personal_data_view AS
  SELECT personal_data.*
  FROM app_public.personal_data personal_data
  INNER JOIN app_public.person person on person.id = current_settings('jwt.id');
```

### API Layer

Using `views`, one can create a layer of API that won't break
while making changes to the underlying tables (simple name changes can be solved using smart comments).


Help expanding this page would be welcome, please use the "Suggest
improvements to this page" link above.
