---
layout: page
path: /postgraphile/postgresql-schema-design/
title: PostgreSQL Schema Design
---

# Postgres Schema Design
The Postgres database is rich with features well beyond that of any other database. However, most developers do not know the extent to which they can leverage the features in Postgres to completely express their application business logic in the database.

Often developers may find themselves re-implimenting authentication and authorization in their apps, when Postgres comes with application level security features out of the box. Or perhaps developers may rewrite basic insert functions with some extra app logic where that too may be handled in the database.

This reimplementation of features that come with Postgres is not just an inefficient way to spend developer resources, but may also result in an interface that is slower than if the logic was implemented in Postgres itself. PostGraphile aims to make developers more efficient and their APIs faster by packaging the repeatable work in one open source project that encourages community contributions.

In this tutorial we will walk through the Postgres schema design for a forum application with users who can login and write forum posts. While we will discuss how you can use the schema we create with PostGraphile, this article should be useful for anyone designing a Postgres schema.

## Table of Contents
- [Installation](#installation)
  - [Installing Postgres](#installing-postgres)
  - [Installing PostGraphile](#installing-postgraphile)

## Installation
### Installing Postgres
First, you are going to need to make sure Postgres is installed. You can skip this section if you already have Postgres installed 👍

If you are running on MacOS, it is highly recommended that you install and use [Postgres.app](http://postgresapp.com/). If you are on another platform, go to the [Postgres download page](https://www.postgresql.org/download/) to pick up a copy of Postgres. We recommend using a version of Postgres higher than `9.6.0` as Postgres `9.5` introduces Row Level Security (an important feature when building your business logic into the database) and `9.6` introduces `missing_ok` to the `current_setting(name, missing_ok)` function (which saves you some complexity).

After that, make sure your copy of Postgres is running locally on `postgres://localhost:5432`. This is the default location for local Postgres databases and is used by many Postgres tools.

In a terminal window, run `psql`. This is your most basic tool for querying your Postgres databse. By default `psql` will connect to `postgres://localhost:5432`. If you want to connect to another database, just pass that database as the first argument.

```bash
$ psql                                  # Connects to the default database at `postgres://localhost:5432`
$ psql postgres://localhost:5432/testdb # Connects to the `testdb` database at `postgres://localhost:5432`
$ psql postgres://somehost:2345/somedb  # connects to the `somedb` database at `postgres://somehost:2345`
```

Read the documentation on [Postgres connection strings](https://www.postgresql.org/docs/9.6/static/libpq-connect.html#LIBPQ-CONNSTRING) to learn more about alternative formats (including using a password).

After running `psql` with your database URL, you should be in a SQL prompt:

```
psql (9.5.*)
Type "help" for help.

=#
```

Run the following query to make sure things are working smoothly:

```
=# select 1 + 1 as two;
 two
-----
   2
(1 row)

=#
```

### Installing PostGraphile
It’s way easier to install PostGraphile. If you have npm, you practically have PostGraphile as well.

```
$ npm install -g postgraphile
```

To run PostGraphile, you’ll use the same URL that you used for `psql`:

```bash
$ postgraphile                                     # Connects to the default database at `postgres://localhost:5432`
$ postgraphile -c postgres://localhost:5432/testdb # Connects to the `testdb` database at `postgres://localhost:5432`
$ postgraphile -c postgres://somehost:2345/somedb  # connects to the `somedb` database at `postgres://somehost:2345`
```

You can also run PostGraphile with the watch flag:

```bash
$ postgraphile --watch
```

With the `--watch` flag, whenever the Postgres schemas you are introspecting change PostGraphile will automatically update your GraphQL API.

Let’s go on to setting up our database schemas.
