---
layout: page
path: /graphile-build-pg/introduction/
title: Graphile-Build-PG Introduction
---

## Introduction

`graphile-build-pg` is a collection of plugins for Graphile-Build that enable
you to automatically generate GraphQL types and fields based on a PostgreSQL
schema (or schemas) - automatically creating types and fields based on
PostgreSQL tables, columns, relations, functions and more.

### Consuming these plugins

It's recommended that you consume these plugins via the
[`postgraphile-core`](https://github.com/graphile/graphile-build/tree/master/packages/postgraphile-core)
module which is used internally by
[`PostGraphQL`](https://github.com/postgraphql/postgraphql). This module is
fairly small and exposes the following methods:

- `createPostGraphQLSchema(pgConfig, schemas, options)` - returns a promise to a GraphQL schema
- `watchPostGraphQLSchema(pgConfig, schemas, options, onNewSchema)` - returns a
  promise that returns a `release` function that you can call to stop watching;
  the `onNewSchema` callback will be called every time a new schema is
  generated, and it is guaranteed to be called before the promise resolves.

If you prefer to use the plugins yourself it's advised that you use the
`defaultPlugins` export from `graphile-build-pg` and then create a new array
based on that into which you may insert or remove specific plugins. This is
because it is ordered in a way to ensure the plugins work correctly (and we may
still split up or restructure the plugins within it).

### Introspection / Schemas

We look through the PG catalog to see what tables, functions, relations etc are
available in your schemas. You provide the list of schemas to inspect via the
`pgSchemas` setting, e.g. `pgSchemas: ["public"]`.

If you're interested to see how we do this, the introspection query can be
found [in our
GitHub](https://github.com/graphile/graphile-build/blob/master/packages/graphile-build-pg/res/introspection-query.sql).

### Connections

We implement Relay's connection spec, so instead of returning simply a list of
records we return a connection which allows you to perform pagination with
ease. We also extend Relay's connection spec a little to give you some extra features
such as:

- `totalCount` - the total number of records matching the record
- `nodes` - just the nodes (no `edge` wrapper) useful if you don't want the cursor for every entry
- `pageInfo.startCursor` and `pageInfo.endCursor` - useful for pagination if you use `nodes { ... }` rather than `edges { cursor, node { ... } }`

### Relations

We automatically discover relations between tables and add these to the
generated GraphQL types so long as you use foreign keys.

### Computed columns

You can create PostgreSQL functions that match the following criteria to add a
field to a table type. This field could be simple (such as `name` constructed
from `first_name || ' ' || last_name`) or could return a composite type (e.g.
database row) or even a whole connection. For this to work, the following rules
apply to the function you create:

- name must begin with the name of the table it applies to, followed by an underscore (`_`)
- first argument must be the table type
- must return a named type - we do not currently support anonymous types
- must NOT return `VOID`
- must be marked as `STABLE`
- must be defined in the same schema as the table

This example creates two computed columns, one returning a simple varchar and
the other a connection. Note that these methods could also accept additional
arguments which would also automatically be added to the generated GraphQL
field:

```sql
create table my_schema.users (
  id serial not null primary key,
  first_name varchar not null,
  last_name varchar not null
);

create table my_schema.friendships (
  user_id integer not null,
  target_id integer not null,
  primary key (user_id, target_id)
);

create function my_schema.users_name(u my_schema.users) returns varchar as $$
  select u.first_name || ' ' || u.last_name;
$$ language sql stable;

create function my_schema.users_friends(u my_schema.users) returns setof my_schema.users as $$
  select *
  from my_schema.users
  inner join my_schema.friendships
  on (friendships.target_id = users.id)
  where friendships.user_id = u.id;
$$ language sql stable;
```

TODO: ensure this example works

### Custom queries

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

### CRUD mutations

We automatically add default CRUD mutations to the schema; this can be disabled
via the `pgDisableDefaultMutations` setting.

TODO: add example

### Custom mutations

You can create PostgreSQL functions that perform mutations too, for these
functions the following rules apply:

- must return a named type - we do not currently support anonymous types; can return `VOID`
- must be marked as `VOLATILE` (which is the default)
- must be defined in one of the introspected schemas

### Performance

A single root level query, no matter how nested, is compiled into one SQL query
which avoids multiple round-trips to the database. For example the following
query would be compiled into one SQL statement - no need for `DataLoader`!

```graphql
{
  allPosts {
    edges {
      node {
        id
        title
        author: userByAuthorId {
          ...UserDetails
        }
        comments {
          text
          author: userByAuthorId {
            ...UserDetails
            recentComments {
              date
              post: postByPostId {
                title
                author {
                  ...UserDetails
                }
              }
              text
            }
          }
        }
      }
    }
  }
}

fragment UserDetails on User {
  id
  username
  bio: bioByUserId {
    preamble
    location
    description
  }
}
```

This is accomplished using Graphile-Build's [look-ahead](/graphile-build/look-ahead/) features.

