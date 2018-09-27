---
layout: page
path: /postgraphile/relations/
title: Relations
---

## Relations

We automatically discover relations between database tables by inspecting
their foreign keys, and use this to build relations into the generated
GraphQL schema.

An example of a foreign key constraint when defining a table would be the
`REFERENCES` keyword below:

```sql{4}
CREATE TABLE app_public.users (
  -- ...
  organization_id int NOT NULL
    REFERENCES app_public.organizations ON DELETE CASCADE,
  -- ...
);
```

Alternatively a foreign key constraint can be added after table creation:

```sql
ALTER TABLE users
  ADD CONSTRAINT users_organization_id_fkey
  FOREIGN KEY (organization_id)
  REFERENCES organizations
  ON DELETE CASCADE;
```

You can read more about defining foreign key constraints, including
constraints that utilise multiple columns, in the [PostgreSQL
documentation](https://www.postgresql.org/docs/10/static/ddl-constraints.html#DDL-CONSTRAINTS-FK).

PostGraphile detects and exposes one-to-one, one-to-many and many-to-one
relations automatically. Many-to-many relationships can be traversed via
their join table, but we don't have shortcut relations for these yet.

By default, relations are exposed as GraphQL fields using a camelCase
combination of the target type and the source fields (inflectors:
`singleRelationByKeys`, `singleRelationByKeysBackwards`, and
`manyRelationByKeys`). Unique constraints expose a GraphQL table type
directly, non-unique constraints expose a
[connection](/postgraphile/connections/). The GraphQL connections that these
relations expose support pagination, [filtering](/postgraphile/filtering/),
and ordering.

### Example database schema

```sql
create schema a;
create schema c;

create table c.person (
  id serial primary key,
  name varchar not null,
  about text,
  email varchar not null unique,
  created_at timestamp default current_timestamp
);

create table a.post (
  id serial primary key,
  headline text not null,
  body text,
  -- `references` 👇  sets up the foreign key relation
  author_id int4 references c.person(id)
);
```

### Example query against this schema

```graphql
{
  allPosts {
    nodes {
      headline
      body

      # this relation is automatically exposed
      personByAuthorId {
        id
        name
        about
      }
    }
  }
}
```
