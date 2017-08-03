---
layout: page
path: /graphile-build-pg/relations/
title: Relations
---

## Relations

We automatically discover relations between tables and add these to the
generated GraphQL types so long as you use foreign keys.

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
  author_id int4 references c.person(id)
);
```

```graphql
{
  allPosts {
    nodes {
      headline
      body
      personByAuthorId {
        id
        name
        about
      }
    }
  }
}
```
