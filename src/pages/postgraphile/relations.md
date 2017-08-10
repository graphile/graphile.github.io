---
layout: page
path: /postgraphile/relations/
title: Relations
---

## Relations

We automatically discover relations between tables by inspecting their foreign
keys, and use this to build relations into the generated GraphQL schema.

We can detect one-to-many and many-to-one relations. One-to-one and
many-to-many relations are exposed in the same way but do not always give the
best API currently.

It's also possible to add constraints on one-to-many relations such as [filtering
with a condition](/postgraphile/filtering/).

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
