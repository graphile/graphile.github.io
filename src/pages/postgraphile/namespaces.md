---
layout: page
path: /postgraphile/namespaces/
title: Namespaces
---

## Namespaces (PostgreSQL "schemas")

In PostgreSQL, each database consists of a number of "schemas". The default
schema is named "public" and many users only ever deal with this one schema.

In PostGraphile we advise you to use schemas to help organise your
application - you can use one schema for the tables that will be exposed to
GraphQL, another for the tables that should be completely private (e.g. where
you store the bcrypted user passwords or other secrets never to be exposed!),
and you can use other schemas too, whatever makes sense for your application.

To create a schema in PostgreSQL:

```sql
CREATE SCHEMA app_public;
```

To create or reference something in that schema, just prepend the name of the
thing with the schema name, e.g:

```sql
CREATE TABLE app_public.users ( ... );
CREATE FUNCTION app_public.best_user() ...;

SELECT * FROM app_public.users;
SELECT * FROM app_public.best_user();
```

### Advice

Having built quite a few applications on PostGraphile now, I (Benjie) have
settled on the following:

* `app_public` - tables and functions to be exposed to GraphQL
* `app_hidden` - same privileges as `app_public`, but simply not exposed to GraphQL
* `app_private` - secrets that require elevated privileges to access
* `app_jobs` - where my [job queue](https://gist.github.com/benjie/839740697f5a1c46ee8da98a1efac218) lives

I personally don't use the `public` schema for anything other than as the
[default location that PostgreSQL extensions get
installed](https://www.postgresql.org/docs/10/static/sql-createextension.html).

Using this pattern is **not required** and in fact you can just use the
default `public` schema if you so chose. By default, PostGraphile will
automatically ignore resources installed by extensions, so you don't need to
omit these manually. Other tables and functions can be omitted using the
[smart comments](/postgraphile/smart-comments/) functionality.
