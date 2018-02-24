---
layout: page
path: /postgraphile/installation-guide/
title: Installation Guide
---

# New Title
The Postgres database is rich with features well beyond that of any other database. However, most developers do not know the extent to which they can leverage the features in Postgres to completely express their application business logic in the database.

Often developers may find themselves re-implimenting authentication and authorization in their apps, when Postgres comes with application level security features out of the box. Or perhaps developers may rewrite basic insert functions with some extra app logic where that too may be handled in the database.

This reimplementation of features that come with Postgres is not just an inefficient way to spend developer resources, but may also result in an interface that is slower than if the logic was implemented in Postgres itself. PostGraphile aims to make developers more efficient and their APIs faster by packaging the repeatable work in one open source project that encourages community contributions.

In this tutorial we will walk through the Postgres schema design for a forum application with users who can login and write forum posts. While we will discuss how you can use the schema we create with PostGraphile, this article should be useful for anyone designing a Postgres schema.

## Table of Contents
  - [Install Postgres](#installing-postgres)
  - [Create a Database](#create-a-database)
  - [Install PostGraphile](#installing-postgraphile)

# Install Postgres
First, you are going to need to make sure Postgres is installed. You can skip this section if you already have Postgres installed 👍

If you are running on MacOS, it is highly recommended that you install and use [Postgres.app](http://postgresapp.com/). If you are on another platform, go to the [Postgres download page](https://www.postgresql.org/download/) to pick up a copy of Postgres. We recommend using a version of Postgres higher than `9.6.0` as Postgres `9.5` introduces Row Level Security (an important feature when building your business logic into the database) and `9.6` introduces `missing_ok` to the `current_setting(name, missing_ok)` function (which saves you some complexity).

After that, make sure your copy of Postgres is running locally on `postgres://localhost:5432` by running `psql` in a terminal. 5432 is the default port for local Postgres databases and is used by many Postgres tools.

```bash
$ psql "postgres://localhost:5432"                    # Connects to the default database at `postgres://localhost:5432`

psql: FATAL:  database "username" does not exist      # If you get something like this returned then Postgres is successfully installed!

psql: could not connect to server: Connection refused # A refused connection shows that Postgres is not running.
```

If you want to connect to another database, just pass that database address instead:

```bash
$ psql postgres://localhost:5432/testdb # Connects to the `testdb` database at `postgres://localhost:5432`
$ psql postgres://somehost:2345/somedb  # Connects to the `somedb` database at `postgres://somehost:2345`
```

Read the documentation on [Postgres connection strings](https://www.postgresql.org/docs/9.6/static/libpq-connect.html#LIBPQ-CONNSTRING) to learn more about alternative formats (including using a password).

# Create a Database

You'll next want to create a database. You can do this by using the terminal:

```
$ createdb mydb
```

This will create a Postgres database called "mydb". You can read more about this on the [Postgres Documentation site](https://www.postgresql.org/docs/9.6/static/tutorial-createdb.html). Now you can run `psql` with your database URL and get a SQL prompt:


```bash
$ psql "postgres://localhost:5432"    # Connects to the default database at `postgres://localhost:5432`

psql (9.6.*)
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

# Installing PostGraphile
It is easy to install PostGraphile with [npm](https://docs.npmjs.com/getting-started/installing-node):

```
$ npm install -g postgraphile
```

To run PostGraphile, you’ll use the same URL that you used for `psql` with the database name added:

```bash
$ postgraphile -c "postgres://localhost:5432/mydb"      # Connects to the `mydb` database at `postgres://localhost:5432`
$ postgraphile -c "postgres://somehost:2345/somedb"     # Connects to the `somedb` database at `postgres://somehost:2345`
```

You can also run PostGraphile with the watch flag:

```bash
$ postgraphile -c "postgres://localhost:5432/mydb" --watch
```

With the `--watch` flag, PostGraphile will automatically update your GraphQL API whenever the Postgres schemas you are introspecting change.
