---
layout: page
path: /postgraphile/extending/
title: GraphQL Schema Plugins
---

## GraphQL Schema Plugins

*NOTE: This page relates to changing your GraphQL schema. If you're instead looking to change how the web layer of PostGraphile works (e.g. for validating web requests), see [Server Plugins](/postgraphile/plugins/).*

*NOTE: if you're looking for an easy way to remove/rename things, check out [smart comments](/postgraphile/smart-comments/).*

PostGraphile's schema generator is built from a number of [Graphile Build
plugins](/graphile-build/plugins/). You can write your own plugins (see below),
but we also make some helpers available in `graphile-utils` that help you to
do common tasks.

### The easy way: `graphile-utils`

The `graphile-utils` module contains some helpers for extending your
PostGraphile (or Graphile Build) GraphQL schema without having to understand
the complex plugin system.

The main one you'll care about to start with is `makeExtendSchemaPlugin`.

#### makeExtendSchemaPlugin

Using makeExtendSchemaPlugin you can write a plugin that will merge additional
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
- CLI: ``--append-plugins `pwd`/MySchemaExtensionPlugin.js``
- Library: `appendPlugins: [require('./MySchemaExtensionPlugin')]`


The `build` argument to the makeExtendSchemaPlugin callback contains lots of
information and helpers defined by various plugins, most importantly it
includes the introspection results (`build.pgIntrospectionResultsByKind`),
inflection functions (`build.inflection`), and SQL helper (`build.pgSql`, which
is just an instance of [pg-sql2](https://www.npmjs.com/package/pg-sql2)).

The callback should return an object with two keys:

- `typeDefs`: a graphql AST generated with the `gql` helper from
  `graphile-utils` (note this is NOT from the `graphql-tag` library, ours works
  in a slightly different way).
- `resolvers`: an object that's keyed by the GraphQL type names of types
  defined (or extended) in `typeDefs`, the values of which are objects keyed by
  the field names with values that are resolver functions.

For a larger example of how typeDefs and resolvers work, have a look at the
[graphql-tools
docs](https://www.apollographql.com/docs/graphql-tools/generate-schema.html) -
ours work in a similar way.

Note that the resolve functions defined in `resolvers` will be sent the
standard 4 GraphQL resolve arguments (`parent`, `args`, `context`,
`resolveInfo`); but in addition they will be passed a 5th argument that
contains graphile-specific helpers. One such helper is
`selectGraphQLResultFromTable`, which inspects the incoming GraphQL query and
automatically pulls down the relevant rows from the database (including nested
relations) - which you can then return from the resolver. You can use the
`sqlBuilder` object to customise the generated query, changing the order,
adding `where` clauses, `limit`s, etc.

The `sqlBuilder` has a number of methods which affect the query which will be generated. The main ones you're like to want are:

- `where(sqlFragment)`; e.g. ``sqlBuilder.where(build.pgSql.fragment`is_admin is true`)``
- `orderBy(() => sqlFragment, ascending)`; e.g. ``sqlBuilder.orderBy(() => build.pgSql.fragment`created_at`, false)``
- `limit(number)`; e.g. `sqlBuilder.limit(1)`
- `offset(number)`; e.g. `sqlBuilder.offset(1)`
- `select(() => sqlFragment, alias)`; e.g. ``sqlBuilder.select(() => build.pgSql.fragment`gen_random_uuid()`, '__my_random_uuid')`` - it's advised to start your alias with two underscores to prevent it clashing with any potential columns exposed as GraphQL fields.


```js{7-36}
const { postgraphile } = require("postgraphile");
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const express = require("express");

const app = new express();

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
          resolveInfo,
          { selectGraphQLResultFromTable }
        ) => {
          const rows = await selectGraphQLResultFromTable(
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
        user: User @recurseDataGenerators
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
          resolveInfo,
          { selectGraphQLResultFromTable }
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
            // account as the source of the data.
            const [row] =
              await selectGraphQLResultFromTable(
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

            // We pass the fetched result via the
            // `user` field to match the
            // @recurseDataGenerators directive
            // used above. GraphQL mutation
            // payloads typically have additional
            // fields.
            return {
              user: row,
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

Note that the `@recurseDataGenerators` directive here tells PostGraphile to act
as if the RegisterUserPayload didn't exist and instead the `user` field was
returned by the mutation directly. This is because we often add other fields to
mutation payloads, such as `query` for the root Query type.


### Loading additional plugins

```bash
# For a local file:
postgraphile \
  --append-plugins `pwd`/add-http-bin-plugin.js \
  -c postgres://localhost/mydb

# Or, for an npm plugin:
postgraphile \
  --append-plugins postgraphile-plugin-connection-filter \
  -c postgres://localhost/mydb
```

If you're using the CLI you can use option `--append-plugins` to load additional
plugins.  You specify a comma separated list of module specs. A module spec is
a path to a JS file to load, optionally followed by a colon and the name of the
export (you must omit this if the function is exported via
`module.exports = function MyPlugin(...){...}`). E.g.

- `--append-plugins my-npm-module` (requires `module.exports = function NpmPlugin(...) {...}`)
- `--append-plugins /path/to/local/module.js:MyPlugin` (requires `exports.MyPlugin = function MyPlugin(...) {...}`)

If you're using postgraphile as a library you can instead use the appendPlugins
option which is simply an array of functions (_you perform your own requiring_!)

Remember: multiple versions of graphql in your `node_modules` will cause
problems; so we recommend using the `graphql` object that's available on the
`Build` object (second argument to hooks).


### Writing your own plugins

The core PG-related plugins can be found here:

https://github.com/graphile/graphile-build/tree/master/packages/graphile-build-pg/src/plugins

These plugins introduce small amounts of functionality, and build upon each
other. The order in which the plugins are loaded is significant, and can be
found from the `defaultPlugins` export in
[`src/index.js`](https://github.com/graphile/graphile-build/blob/master/packages/graphile-build-pg/src/index.js)
of the `graphile-build-pg` module.

You can extend PostGraphile's GraphQL schema by adding plugins before or after
the default plugins. You may even opt to replace the entire list of plugins
used to build the schema. Graphile Build plugins are built on top of the
[GraphQL reference JS implementation](http://graphql.org/graphql-js/), so it is
recommended that you have familiarity with that before attempting to write your
own plugins.


### Adding root query/mutation fields

A common request is to add additional root-level fields to your schema, for
example to integrate external services. To do this we must add a
'GraphQLObjectType:fields' hook and then add our new field:

```js
// add-http-bin-plugin.js
const fetch = require("node-fetch");

function AddHttpBinPlugin(builder, { pgExtendedTypes }) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields, // Input object - the fields for this GraphQLObjectType
      { extend, getTypeByName }, // Build object - handy utils
      { scope: { isRootQuery } } // Context object - used for filtering
    ) => {
      if (!isRootQuery) {
        // This isn't the object we want to modify:
        // return the input object unmodified
        return fields;
      }

      // We don't want to introduce a new JSON type as that will clash,
      // so let's find the JSON type that other fields use:
      const JSONType = getTypeByName("JSON");

      return extend(fields, {
        httpBinHeaders: {
          type: JSONType,
          async resolve() {
            const response = await fetch("https://httpbin.org/headers");
            if (pgExtendedTypes) {
              // This setting is enabled through postgraphile's
              // `--dynamic-json` option, if enabled return JSON:
              return response.json();
            } else {
              // If Dynamic JSON is not enabled, we want a JSON string instead
              return response.text();
            }
          },
        },
      });
    }
  );
}

module.exports = AddHttpBinPlugin;
```

(If you wanted to add a mutation you'd use `isRootMutation` rather than `isRootQuery`.)

We can then load our plugin into PostGraphile via:

```
postgraphile --append-plugins `pwd`/add-http-bin-plugin.js -c postgres://localhost/mydb
```

Note that the return types of added fields (e.g. `JSONType` above) do not need
to be implemented via Graphile Build's
[`newWithHooks`](/graphile-build/build-object/#newwithhookstype-spec-scope) -
you can use standard GraphQL objects too. (However, if you do not use
`newWithHooks` then the objects referenced cannot be extended via plugins.)

### Wrapping an existing resolver

Sometimes you might want to override what an existing field does. Due to the
way that PostGraphile works (where the root Query field resolvers are the only
ones who perform SQL queries) this is generally most useful at the top level.

The following example modifies the 'createLink' mutation so that it performs
some additional validation (thrown an error if the link's `title` is too short)
and performs an action after the link has been saved. You could use a plugin
like this to achieve many different tasks, including emailing a user after
their account is created or logging failed authentication attempts.

```js
function performAnotherTask(linkId) {
  console.log(`We created link ${linkId}!`);
}

module.exports = function CreateLinkWrapPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields:field",
    (
      field,
      { pgSql: sql },
      { scope: { isRootMutation, fieldName }, addArgDataGenerator }
    ) => {
      if (!isRootMutation || fieldName !== "createLink") {
        // If it's not the root mutation, or the mutation isn't the 'createLink'
        // mutation then we don't want to modify it - so return the input object
        // unmodified.
        return field;
      }

      // We're going to need link.id for our `performAnotherTask`; so we're going
      // to abuse addArgDataGenerator to make sure that this field is ALWAYS
      // requested, even if the user doesn't specify it. We're careful to alias
      // the result to a field that begins with `__` as that's forbidden by
      // GraphQL and thus cannot clash with a user's fields.
      addArgDataGenerator(() => ({
        pgQuery: queryBuilder => {
          queryBuilder.select(
            // Select this value from the result of the INSERT:
            sql.query`${queryBuilder.getTableAlias()}.id`,
            // And give it this name in the result data:
            "__createdRecordId"
          );
        },
      }));

      // It's possible that `resolve` isn't specified on a field, so in that case
      // we fall back to a default resolver.
      const defaultResolver = obj => obj[fieldName];

      // Extract the old resolver from `field`
      const { resolve: oldResolve = defaultResolver, ...rest } = field;

      return {
        // Copy over everything except 'resolve'
        ...rest,

        // Add our new resolver which wraps the old resolver
        async resolve(...resolveParams) {
          // Perform some validation (or any other action you want to do before
          // calling the old resolver)
          const RESOLVE_ARGS_INDEX = 1;
          const { input: { link: { title } } } = resolveParams[
            RESOLVE_ARGS_INDEX
          ];
          if (title.length < 3) {
            throw new Error("Title is too short!");
          }

          // Call the old resolver (you SHOULD NOT modify the arguments it
          // receives unless you also manipulate the AST it gets passed as the
          // 4th argument; which is quite a lot of effort) and store the result.
          const oldResolveResult = await oldResolve(...resolveParams);

          // Perform any tasks we want to do after the record is created.
          await performAnotherTask(oldResolveResult.data.__createdRecordId);

          // Finally return the result.
          return oldResolveResult;
        },
      };
    }
  );
};
```

### Removing things from the schema

**If you're looking for an easy way to remove a few things, check out [smart
comments](/postgraphile/smart-comments/).**
If you want to remove a class of things from the schema then you can remove
the plugin that adds them; for example if you no longer wanted to allow
ordering by all the columns of a table (i.e. only allow ordering by the primary
key) you could omit
[PgOrderAllColumnsPlugin](https://github.com/graphile/graphile-build/blob/master/packages/graphile-build-pg/src/plugins/PgOrderAllColumnsPlugin.js).
If you didn't want computed columns added you could omit
[PgComputedColumnsPlugin](https://github.com/graphile/graphile-build/blob/master/packages/graphile-build-pg/src/plugins/PgComputedColumnsPlugin.js).

However, sometimes you need more surgical precision, and you only want to
remove one specific type of thing. To achieve this you need to add a hook to the
thing that owns the thing you wish to remove - for example if you
want to remove a field `bar` from an object type `Foo` you could hook
`GraphQLObjectType:fields` and return the set of fields less the one you want
removed. 

Here's an example of a plugin generator you could use to generate plugins to
remove individual fields. This is just to demonstrate how a plugin to do this
might work, [smart comments](/postgraphile/smart-comments/) are likely a better
approach.

```js
const omit = require("lodash/omit");

function removeFieldPluginGenerator(objectName, fieldName) {
  const fn = function(builder) {
    builder.hook("GraphQLObjectType:fields", (fields, _, { Self }) => {
      if (Self.name !== objectName) return fields;
      return omit(fields, [fieldName]);
    });
  };
  // For debugging:
  fn.displayName = `RemoveFieldPlugin:${objectName}.${fieldName}`;
  return fn;
}

const RemoveFooDotBarPlugin = removeFieldPluginGenerator("Foo", "bar");

module.exports = RemoveFooDotBarPlugin;
```
