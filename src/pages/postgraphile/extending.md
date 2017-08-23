---
layout: page
path: /postgraphile/extending/
title: Extending PostGraphile
---

## Extending PostGraphile

PostGraphile's schema generator is built from a number of [Graphile Build plugins](/graphile-build/plugins/). The plugins can be found here:

https://github.com/graphile/graphile-build/tree/master/packages/graphile-build-pg/src/plugins

These plugins introduce small amounts of functionality, and build upon each
other. The order in which the plugins are loaded is significant, and can be
found from the `defaultPlugins` export in
[`src/index.js`](https://github.com/graphile/graphile-build/blob/master/packages/graphile-build-pg/src/index.js)
of the `graphile-build-pg` module.

You can extend PostGraphile's GraphQL schema by appending to, prepending to or
even replacing the list of plugins used to build the schema. Graphile Build
plugins are built on top of the [GraphQL reference JS
implementation](http://graphql.org/graphql-js/), so it is recommended that you
have familiarity with that before attempting to add your own plugins.

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

### Wrapping an existing resolver

Sometimes you might want to override what an existing field does. Due to the
way that PostGraphile works (where the root Query field resolvers are the only
ones who perform SQL queries) this is generally most useful at the top level.
For example if you want to perform a certain action after a record is created
you could wrap the create mutation:


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
