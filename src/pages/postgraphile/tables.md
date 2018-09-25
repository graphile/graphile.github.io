---
layout: page
path: /postgraphile/tables/
title: PostgreSQL Tables
---

## PostgreSQL Tables

PostGraphile automatically adds a number of elements to the generated GraphQL
schema based on the tables and columns found in the inspected schema.

An example of a PostgreSQL table is:

```sql
CREATE TABLE app_public.users (
  id serial PRIMARY KEY,
  username citext NOT NULL unique,
  name text NOT NULL,
  organization_id int NOT NULL
    REFERENCES app_public.organizations ON DELETE CASCADE,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### Read
<!--!RUN
dropdb test
createdb test
psql -1X test <<HERE
CREATE EXTENSION IF NOT EXISTS citext;
CREATE SCHEMA app_public;

CREATE TABLE app_public.organizations (
  id serial primary key
);

CREATE TABLE app_public.users (
  id serial PRIMARY KEY,
  username citext NOT NULL unique,
  name text NOT NULL,
  organization_id int NOT NULL
    REFERENCES app_public.organizations ON DELETE CASCADE,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
HERE
npx postgraphile -c 'test' -s 'app_public' --no-server --export-schema-graphql postgraphile-tables-1.graphql
-->

If the `SELECT` permission is granted for the table or any of its columns\* (or if we're ignoring RBAC, as we do by default), then:

**Tables** becomes a GraphQL type, named in UpperCamelCase & singularized ([inflector: `tableType`](https://github.com/graphile/graphile-engine/blob/f332cb11fc32c7b50428c8d19d88121ead00d95d/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L485-L487)).

**Columns** become GraphQL fields of the relevant GraphQL type, named in
camelCase ([inflector:
`tableType`](https://github.com/graphile/graphile-engine/blob/f332cb11fc32c7b50428c8d19d88121ead00d95d/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L488-L490)).

**Tables** expose an `allFoos` [connection](/postgraphile/connections/) field on the root Query type.

**Relations** (foreign key constraints, like the `REFERENCES` above) are exposed as GraphQL fields using a camelCase
combination of the target type and the source fields (inflectors:
`singleRelationByKeys`, `singleRelationByKeysBackwards`, and
`manyRelationByKeys`). Unique constraints expose a GraphQL table type directly, non-unique constraints expose a [connection](/postgraphile/connections/). Read more about [relations](/postgraphile/relations/).

**Unique indexes** (including the **primary key**) are expose as individual
getter fields on the root Query type (inflector: `rowByUniqueKeys`) which
resolve to a GraphQL table type. This works for both single-key and multi-key
unique constraints (but _not_ partial indexes at this time).

\* **_NOTE: We strongly [advise against](/postgraphile/requirements/) using column-based `SELECT` grants with PostGraphile. Instead, split your permission concerns into separate tables and join them with one-to-one relations._**

### Create

If the `INSERT` permission is granted for the table or any of its columns (or if we're ignoring RBAC, as we do by default), then:

**Tables** get a `createFoo` mutation added to the root Mutation type, along with the associated input and payload types. [Click for an example](/postgraphile/examples/#Mutations__Create).

### Update

If the `UPDATE` permission is granted for the table or any of its columns (or if we're ignoring RBAC, as we do by default), then:

**Tables with a primary key** get an `updateFoo` mutation (which gets passed the [Globally Unique Identifier](/postgraphile/node-id/)) added to the root Mutation type, along with the associated input and payload types.

Every **unique index** (including the **primary key**) of a table gets an `updateFooByKeys` mutation (which gets passed the relevant keys) added to the root Mutation type, along with the associated input and payload types. [Click for an example](/postgraphile/examples/#Mutations__Update).

### Delete

If the `DELETE` permission is granted for the table (or if we're ignoring RBAC, as we do by default), then:

**Tables with a primary key** get a `deleteFoo` mutation (which gets passed the [Globally Unique Identifier](/postgraphile/node-id/)) added to the root Mutation type, along with the associated payload types.

Every **unique index** (including the **primary key**) of a table gets an `deleteFooByKeys` mutation (which gets passed the relevant keys) added to the root Mutation type, along with the associated payload types. [Click for an example](/postgraphile/examples/#Mutations__Delete).
