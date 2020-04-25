---
layout: page
path: /postgraphile/make-wrap-resolvers-plugin/
title: makeWrapResolversPlugin audit & soft-delete example (graphile-utils)
---
### Example plugin for audit columns & soft delete (created_at, updated_at, deleted_at) 

The below code contains a single plugin that detects if the mutation target table contains
`created_at` or `updated_at` columns and overrides the query payload values with current date.

The same plugin also detects if the mutation target table contains a `deleted_at` column and 
overrides the delete command with custom sql query (which, in this case, is `update [table] set deleted_at = now()`).

> NOTE to Benjie & the team: This example is provided with my limited knowledge as I have just started 
> plugin development and with this disclaimer I can note that by using lodash and my solution for returning
> the Delete mutation result to client is a hack that shows my limited knowledge ✌️😉
>
> ps. Please modify this page however you want to fit more generic usage of Postgraphile.    

```js
const _ = require('lodash')
const { makeWrapResolversPlugin } = require('graphile-utils')

module.exports = makeWrapResolversPlugin(
  context => {
    if (context.scope.isRootMutation) {
      return { scope: context.scope }
    }
    return null;
  },
  ({ scope }) => async (resolver, user, args, context, _resolveInfo) => {

    const { pgClient } = context

    if (
      scope.isPgUpdateMutationField &&
      // check if pgFieldIntrospection contains "updated_at" column
      _.find(_.get(scope, 'pgFieldIntrospection.attributes', []), {
        kind: 'attribute',
        name: 'updated_at'
      })
    ) {
      // modify input.patch with updatedAt value (eg. timestamp)
      _.set(args, 'input.patch.updatedAt', (new Date()).toISOString())
    } else if (
      scope.isPgCreateMutationField &&
      // check if pgFieldIntrospection contains "created_at" column
      _.find(_.get(scope, 'pgFieldIntrospection.attributes', []), {
        kind: 'attribute',
        name: 'created_at'
      })
    ) {
      let objectName = _.first(_.keys(args.input))
      _.set(args, `input.${objectName}.createdAt`, (new Date()).toISOString())
    } else if (
      scope.isPgDeleteMutationField &&
      _.find(_.get(scope, 'pgFieldIntrospection.attributes', []), {
        kind: 'attribute',
        name: 'deleted_at'
      })
    ) {

      // hack: reconstructing schema + table name from pgFieldIntrospection. 
      const table = _.get(scope, 'pgFieldIntrospection.namespaceName') + '.' + _.get(scope, 'pgFieldIntrospection.name')
      // hack: reconstructing return payload GraphqlType from table name.
      const gqlName = '@' + _.camelCase(_.get(scope, 'pgFieldIntrospection.name'))
      let resultPayload = {
        data: {
          __identifiers: [],
        },
      }

      await pgClient.query('savepoint soft_delete');
      try {
        const result = await pgClient.query(`
            update ${table} 
            set deleted_at = now()
            where id = $1 returning *
        `, [args.input.id])
        const row = _.first(result.rows)
  
        // hack: injecting table data for soft-deleted row to graphql result.
        if (row) {
          let dataObject = {}
          _.each(row, (value, key) => {
            if (_.isDate(value)) {
              value = value.toISOString()
            }
            dataObject[_.camelCase(key)] = value
          })
          resultPayload.data[gqlName] = dataObject
        }

      } catch (e) {
        await pgClient.query('rollback to savepoint soft_delete')
        throw e
      } finally {
        await pgClient.query('release savepoint soft_delete')
      }

      // instead of returning normal resolver, return the changes implemented by our custom code.
      return resultPayload
    }

    return await resolver()
  }
)
```

The `deleted_at` columns can be filtered from query results with 
[PgOmitArchived plugin](https://github.com/graphile-contrib/pg-omit-archived/) by using settings 

```js
const express = require("express");
const { postgraphile } = require("postgraphile");
const PgOmitArchived = require("@graphile-contrib/pg-omit-archived");

const app = express();

app.use(
  postgraphile(process.env.DATABASE_URL, "app_public", {
    /* 👇👇👇 */
    appendPlugins: [
      PgOmitArchived.custom("deleted_at")
    ],
    graphileBuildOptions: {
      pgDeletedColumnName: "deleted_at"
    },
    /* ☝️☝️☝️ */
  }),
);

app.listen(process.env.PORT || 3000)
```