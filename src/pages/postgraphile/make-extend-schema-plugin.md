---
layout: page
path: /postgraphile/make-extend-schema-plugin/
title: graphile-utils makeExtendSchemaPlugin
---

## makeExtendSchemaPlugin (graphile-utils)

**NOTE: this documentation applies to PostGraphile v4.1.0+**

The `graphile-utils` module contains some helpers for extending your
PostGraphile (or Graphile Engine) GraphQL schema without having to understand
the complex plugin system.

The main one you'll care about to start with is `makeExtendSchemaPlugin`.

Using `makeExtendSchemaPlugin` you can write a plugin that will merge additional
GraphQL types and resolvers into your schema using a similar syntax to
`graphql-tools`. You just need to provide the `typeDefs` and `resolvers` to
use. Your plugin will likely take a shape like this:

```js{9,10}
const {
  makeExtendSchemaPlugin,
  gql,
} = require('graphile-utils');

const MySchemaExtensionPlugin =
  makeExtendSchemaPlugin(
    build => ({
      typeDefs: gql`...`,
      resolvers: ...
    })
  );
module.exports = MySchemaExtensionPlugin;
```

And would be added to your PostGraphile instance via

* CLI: `` --append-plugins `pwd`/MySchemaExtensionPlugin.js ``
* Library: `appendPlugins: [require('./MySchemaExtensionPlugin')]`

The `build` argument to the makeExtendSchemaPlugin callback contains lots of
information and helpers defined by various plugins, most importantly it
includes the introspection results (`build.pgIntrospectionResultsByKind`),
inflection functions (`build.inflection`), and SQL helper (`build.pgSql`, which
is just an instance of [pg-sql2](https://www.npmjs.com/package/pg-sql2)).

The callback should return an object with two keys:

* `typeDefs`: a graphql AST generated with the `gql` helper from
  `graphile-utils` (note this is NOT from the `graphql-tag` library, ours works
  in a slightly different way).
* `resolvers`: an object that's keyed by the GraphQL type names of types
  defined (or extended) in `typeDefs`, the values of which are objects keyed by
  the field names with values that are resolver functions.

For a larger example of how typeDefs and resolvers work, have a look at the
[graphql-tools
docs](https://www.apollographql.com/docs/graphql-tools/generate-schema.html) -
ours work in a similar way.

Note that the resolve functions defined in `resolvers` will be sent the
standard 4 GraphQL resolve arguments (`parent`, `args`, `context`,
`resolveInfo`); but the 4th argument (`resolveInfo`) will also contains
graphile-specific helpers.

### Reading database column values

When extending a schema, it's often because you want to expose data from Node.js
that would be difficult too difficult (or impossible) to access from PostgreSQL.
When defining a field on an existing table-backed type defined by PostGraphile,
it's useful to access data from the underlying table in the resolver.

To do this you can use the `@requires(columns: […])` field directive to declare
the data dependencies of your resolver. This guarantees that when the resolver
is executed, the data is immediately available.

Here's an example to illustrate.

In the database you have a `product` table (imagine an online store), that
PostGraphile will include in the GraphQL schema by creating a type `Product`
with fields `id`, `name`, `price_in_us_cents`.

```sql
create table product (
  id uuid primary key,
  name text not null,
  price_in_us_cents integer not null
);
```

This would result in the following GraphQL type:

```graphql
type Product {
  id: UUID!
  name: String!
  priceInUsCents: Int!
}
```

However imagine you're selling internationally, and you want to expose the price
in other currencies directly from the `Product` type itself. This kind of
functionality is trivial to perform in Node.js (e.g. by making a REST call to a
foreign exchange service over the internet) but might be a struggle from with
PostgreSQL.

```js{2,4,6-27,33}
const { postgraphile } = require("postgraphile");
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const express = require("express");
const { convertUsdToAud } = require("ficticious-npm-library");

const MyForeignExchangePlugin = makeExtendSchemaPlugin(build => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type Product {
        priceInAuCents: Int! @requires(columns: ["price_in_us_cents"])
      }
    `,
    resolvers: {
      Product: {
        priceInAuCents: async (
          product
        ) => {
          // Note that the columns are converted to fields, so the case changes
          // from `price_in_us_cents` to `priceInUsCents`
          const { priceInUsCents } = product;
          return await convertUsdToAud(priceInUsCents);
        },
      },
    },
  };
});

const app = express();
app.use(
  postgraphile(process.env.DATABASE_URL, ["app_public"], {
    graphiql: true,
    appendPlugins: [MyForeignExchangePlugin],
  })
);
app.listen(3030);
```

### The `selectGraphQLResultFromTable` helper

The `resolveInfo.graphile.selectGraphQLResultFromTable` function is vital if you want
to return data from the database from your new GraphQL field. It is
responsible for hooking into the query look-ahead features of
`graphile-build` to inspect the incoming GraphQL query and pull down the
relevant data from the database (including nested relations). You are then
expected to return the result of this fetch via your resolver. You can use
the `sqlBuilder` object to customise the generated query, changing the order,
adding `where` clauses, `limit`s, etc. Note that if you are not returning a
record type directly (for example you're returning a mutation payload, or a
connection interface), you should use the `@pgField` directive on the fields
of your returned type so that the Look Ahead feature continues to work.

The `sqlBuilder` uses an SQL AST constructed via
[`pg-sql2` methods](https://github.com/graphile/pg-sql2/blob/master/README.md)
to dynamically create powerful SQL queries without risking SQL injection
attacks. The `sqlBuilder` has a number of methods which affect the query which
will be generated. The main ones you're likely to want are:

* `where(sqlFragment)`; e.g. `` sqlBuilder.where(build.pgSql.fragment`is_admin is true`) ``
* `orderBy(() => sqlFragment, ascending)`; e.g. `` sqlBuilder.orderBy(() => build.pgSql.fragment`created_at`, false) ``
* `limit(number)`; e.g. `sqlBuilder.limit(1)`
* `offset(number)`; e.g. `sqlBuilder.offset(1)`
* `select(() => sqlFragment, alias)`; e.g. `` sqlBuilder.select(() => build.pgSql.fragment`gen_random_uuid()`, '__my_random_uuid') `` - it's advised to start your alias with two underscores to prevent it clashing with any potential columns exposed as GraphQL fields.

```js{7-36}
const { postgraphile } = require("postgraphile");
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const express = require("express");

const app = express();

const MyRandomUserPlugin = makeExtendSchemaPlugin(build => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type Query {
        randomUser: User
      }
    `,
    resolvers: {
      Query: {
        randomUser: async (
          _query,
          args,
          context,
          resolveInfo
        ) => {
          // Remember: resolveInfo.graphile.selectGraphQLResultFromTable is where the PostGraphile
          // look-ahead magic happens!
          const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`app_public.users`,
            (tableAlias, sqlBuilder) => {
              sqlBuilder.orderBy(sql.fragment`random()`);
              sqlBuilder.limit(1);
            }
          );
          return rows[0];
        },
      },
    },
  };
});

app.use(
  postgraphile(process.env.DATABASE_URL, ["app_public"], {
    graphiql: true,
    appendPlugins: [MyRandomUserPlugin],
  })
);
app.listen(3030);
```

The above is a simple and fairly pointless example which would have been better
served by a [Custom Query SQL
Procedure](/postgraphile/custom-queries/#custom-query-sql-procedures); however
you can also use this system to define mutations or to call out to external
services. For example, you might want to add a custom `registerUser` mutation
which inserts the new user into the database and also sends them an email:

```js{17,23-91}
const MyRegisterUserMutationPlugin =
makeExtendSchemaPlugin(build => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input RegisterUserInput {
        name: String!
        email: String!
        bio: String
      }

      type RegisterUserPayload {
        user: User @pgField
        query: Query
      }

      extend type Mutation {
        registerUser(input: RegisterUserInput!):
          RegisterUserPayload
      }
    `,
    resolvers: {
      Mutation: {
        registerUser: async (
          _query,
          args,
          context,
          resolveInfo
        ) => {
          const { pgClient } = context;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // Our custom logic to register the user:
            const { rows: [user] } = await pgClient.query(
              `INSERT INTO app_public.users(
                name, email, bio
              ) VALUES ($1, $2, $3)
              RETURNING *`,
              [
                args.input.name,
                args.input.email,
                args.input.bio,
              ]
            );

            // Now we fetch the result that the GraphQL
            // client requested, using the new user
            // account as the source of the data. You
            // should always use
            // `resolveInfo.graphile.selectGraphQLResultFromTable` if you return database
            // data from your custom field.
            const [row] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`app_public.users`,
                (tableAlias, sqlBuilder) => {
                  sqlBuilder.where(
                    sql.fragment`${tableAlias}.id = ${
                      sql.value(user.id)
                    }`
                  );
                }
              );

            // Finally we send the email. If this
            // fails then we'll catch the error
            // and roll back the transaction, and
            // it will be as if the user never
            // registered
            await mockSendEmail(
              args.input.email,
              "Welcome to my site",
              `You're user ${user.id} - ` +
                `thanks for being awesome`
            );

            // Success! Write the user to the database.
            await pgClient.query("RELEASE SAVEPOINT graphql_mutation");

            // If the return type is a database record type, like User, then
            // you would return `row` directly. However if it's an indirect
            // interface such as a connection or mutation payload then
            // you return an object with a `data` property. You can add
            // additional properties too, that can be used by other fields
            // on the result type.
            return {
              data: row,
              query: build.$$isQuery,
            };
          } catch (e) {
            // Oh noes! If at first you don't succeed,
            // destroy all evidence you ever tried.
            await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
            throw e;
          }
        },
      },
    },
  };
});
```

Note that the `@pgField` directive here is necessary for PostGraphile to "look
ahead" and determine what to request from the database.

### Using the `@pgQuery` directive for non-root queries and better performance

To extend your schema with relational data between views for example it is necessary to combine some identificators by hand, because views do not support primary and/or foreign key to detect relation automatically by postgraphile. You could use Smart Comments (https://www.graphile.org/postgraphile/smart-comments/) to achieve this approach, but you can also write your own field definition to extend your schema using the '@pgQuery' directive:

```js
const { makeExtendSchemaPlugin, gql, embed } = require('graphile-utils');

module.exports = makeExtendSchemaPlugin(build => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type User {
        myCustomViewConnection: UserConnection @pgQuery(
          source: ${embed(sql.fragment`mySchema.users`)}
          withQueryBuilder: ${embed((queryBuilder, args) => {
            queryBuilder.where(sql.fragment`${queryBuilder.parentQueryBuilder.getTableAlias()}.view_primarykey_field = ${queryBuilder.getTableAlias()}.view_foreignkey_field`);
          })}
        )
      }
    `,
  };
});
```
Note that UserConnection is just one type of the schema as an example.


**NOTE**: Plugins access the database with the same privileges as everything else - they are subject to RLS/RBAC/etc. If your user does not have privileges to perform the action your plugin is attempting to achieve then you may need to create a companion database function that is marked as `SECURITY DEFINER` in order to perform the action with elevated privileges; alternatively you could just use this database function directly - see [Custom Mutations](/postgraphile/custom-mutations/) for more details.
