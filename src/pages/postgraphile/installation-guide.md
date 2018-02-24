---
layout: page
path: /postgraphile/installation-guide/
title: Quick Start Guide
---

# Quick Start Guide

In order to use PostGraphile, you'll need to have Node and Postgres installed. This quick start guide will walk you through installing these prerequisites and creating your first Postgres database in order that you can get PostGraphile up and running.


## Table of Contents
  - [Install Node](#install-node)
  - [Install Postgres](#install-postgres)
  - [Create a Database](#create-a-database)
  - [Install PostGraphile](#install-postgraphile)

## Install Node
You need Node installed to run PostGraphile. You can skip this section if you already have Node version `8.6` or higher installed.

If you're using OS X or Windows, use one of the installers from the [Node.js download page](https://nodejs.org/en/download/). Make sure you select the version labelled LTS. Linux users can scroll down the page and find the version that works with their system.

Once installed run `node -v` in a terminal to check your version. PostGraphile requires version `8.6` or higher.

At this point it's worth also updating the "Node Package Manager" (npm) which came bundled with Node, to make sure that you'll get the latest PostGraphile package installed later:

```
npm install npm@latest -g
```

## Install Postgres
First, you are going to need to make sure Postgres is installed. You can skip this section if you already have Postgres version `9.6.0` or higher installed.

If you are running on MacOS, it is highly recommended that you install and use [Postgres.app](http://postgresapp.com/). If you are on another platform, go to the [Postgres download page](https://www.postgresql.org/download/) to pick up a copy of Postgres. We recommend using a version of Postgres higher than `9.6.0`. You can read more about the reasoning behind this requirement [in our documentation](/postgraphile/requirements/).

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

## Create a Database

Next, create a database. You can do this by using the terminal:

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

## Install PostGraphile
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

Running PostGraphile will give you two endpoints:

```
  ‣ GraphQL endpoint served at http://localhost:5000/graphql
  ‣ GraphiQL endpoint served at http://localhost:5000/graphiql
```

The second endpoint can be opened in a web browser to give you access to your database through `GraphiQL` - [a visual GraphQL explorer](https://github.com/graphql/graphiql).
