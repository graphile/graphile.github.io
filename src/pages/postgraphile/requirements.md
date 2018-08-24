---
layout: page
path: /postgraphile/requirements/
title: PostGraphile Requirements
---

## Requirements

PostGraphile is packaged as a Node.js module, you can install it with `npm` or
`yarn` (depending on your preference) - we recommend `yarn`.

We recommend using the latest LTS version of Node.js (version 8.9.4 at time of
writing) and PostgreSQL (version 10.2 at time of writing), but we have limited
support for older versions.

### Your PostgreSQL database

These aren't exactly "requirements", but they will impact your PostGraphile
experience.

* **Use primary keys**: if you don't have primary keys on your tables then they
  won't get the `nodeId` globally unique identifier interface. Further if you
  don't have unique constraints then you won't be able to use the automatic
  update/delete mutations.
* **Use foreign keys**: we infer relations between tables using
  [foreign key constraints](https://www.postgresql.org/docs/10/static/ddl-constraints.html#DDL-CONSTRAINTS-FK);
  if you don't use these constraints then we won't know there's a relationship
  between the tables. There are plugins to get around this (using smart
  comments) but it's highly recommended that you use PostgreSQL's built in
  relations support.
* **Don't use column-based SELECT grants**: column-based grants work well for
  `INSERT` and `UPDATE` (especially when combined with `--no-ignore-rbac`!),
  but they don't make sense for `DELETE` and they cause issues when used with
  `SELECT`. Quite a few things in PostGraphile depend on full-table `SELECT`
  grants; if you don't want to use full-table grants then you will need to
  disable the default mutations and use custom mutations instead (because we
  use `RETURNING *` on the mutations), you may also have to miss out on
  computed columns (because we pass the entire row object to the function,
  though these typically still work if you're using `LANGUAGE sql` rather than
  `LANGUAGE plpgsql`/etc). It's recommended that you instead split your tables
  on permission boundaries and use one-to-one relations to join them together
  again - this also makes writing your RBAC/RLS policies simpler. If you want
  to omit a column entirely then you can use the
  [`@omit` smart comment](/postgraphile/smart-comments/#omitting).
* **Function restrictions**: we have pretty good support for PostgreSQL
  functions, but there's some
  [common function restrictions](/postgraphile/function-restrictions/)
  you should check out.
* **Use unique constraints** rather than unique indexes when appropriate: we
  use unique constraints to create mutations such as updateUserByUsername; note
  that "PostgreSQL automatically creates a unique index when a unique
  constraint or primary key is defined for a table." -- [PG
  docs](https://www.postgresql.org/docs/10/static/indexes-unique.html)

On top of this standard PostgreSQL best practices apply: use indexes carefully
for performance, use constraints to ensure your data is valid and consistent,
use triggers to take an action when something happens, etc.

### Node.js

From v4 onwards, PostGraphile requires Node.js version 8.6+ which provides
native support for `async`/`await` and supports many of the ES2017 and ES2018
features.

_(If you absolutely must run PostGraphile on a lower version of Node.js then
this is possibly via transpiling the source code via Babel and packaging it up
using something like `webpack` - get in touch if this is something you need)_

### PostgreSQL

For best results we recommend you use the latest stable release of PostgreSQL
(v10.2 at time of writing), however it should run well on 9.6 or higher and
anything that breaks v9.6 support will be deemed a breaking change. The
absolute earliest version it will run well against is v9.4, however we do not
support this version officially - we strongly recommend you upgrade.

#### PostgreSQL 9.4 [not officially supported]

Basic operation including introspection.

#### PostgreSQL 9.5 [not officially supported]

Introduces Row-Level Security - important for securing your schema.

#### PostgreSQL 9.6 [officially supported]

Introduces the `missing_ok` parameter to the `current_setting(name, missing_ok)`
function - without this you'll need to ensure all `current_setting(name)` calls
reference settings that always exist (e.g. you may need to set them on the
database itself).

`--watch` is also only officially supported on 9.6+ (although it might work on
9.5?)

#### PostgreSQL 10

PostgreSQL 10 solves a number of performance issues - the most interesting of
which for us is a significant performance boost to Row Level Security policies!

We don't have support right now for many of the new features in PostgreSQL 10
that are not compatible with PostgreSQL 9.6.

#### PostgreSQL 11 [not supported yet]

They removed a column from the system catalogues which breaks our introspection
query. We need to build a system for issuing different introspection queries
based on the database version.

[Track the issue here.](https://github.com/graphile/postgraphile/issues/796)

### Operating system

PostGraphile is developed on Mac OS X and tested on GNU/Linux; we would like to
support Windows but no-one in the core team uses Windows so we need your help
for this.
