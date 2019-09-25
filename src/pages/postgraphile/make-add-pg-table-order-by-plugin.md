---
layout: page
path: /postgraphile/make-add-pg-table-order-by-plugin/
title: graphile-utils makeAddPgTableOrderByPlugin
---

## makeAddPgTableOrderByPlugin (graphile-utils v4.4.5+)

**WARNING**: _this plugin generator doesn't currently have any tests, so it's
status is **experimental**. If you can spare the time to write some tests (or
sponsor me to do so) then we can promote it to stable._

PostGraphile adds `orderBy` arguments to various of the table collection
fields it builds so that you can control the order in which you receive the
results. Sometimes, however, you want to order by something a little more
complex than the fields on that table; maybe you want to order by a field on
a related table, or by a computation, or something else.

This plugin generator helps you build new `orderBy` enum values so that you
can sort more flexibly (though you should keep in mind that they are enum
values so they cannot accept arguments).

## Example

To sort a list of forums (stored in the table `app_public.forums`) by the
date they were last posted in (posts are stored in `app_public.posts`) you
might create a plugin like this:

```js
/* TODO: test this plugin works! */
module.exports = makeAddPgTableOrderByPlugin(
  "app_public",
  "forums",
  ({ pgSql: sql }) => {
    const sqlIdentifier = sql.identifier(Symbol("lastPostInForum"));
    return orderByAscDesc(
      "LAST_POST_CREATED_AT",
      ({ queryBuilder }) => sql.fragment`(
        select ${sqlIdentifier}.created_at
        from app_public.posts as ${sqlIdentifier}
        where ${sqlIdentifier}.forum_id = ${queryBuilder.getTableAlias()}.id
        order by ${sqlIdentifier}.created_at desc
        limit 1
      )`
    );
  }
);
```

This adds the `LAST_POST_CREATED_AT_ASC` and `LAST_POST_CREATED_AT_DESC` enum
values to the `ForumOrderBy` enum, so you can now order forums by these
values in another table.

We used the `orderByAscDesc` helper to easily create the `_ASC` and `_DESC`
variants without needing redundant code.

## Function types

The signature of the `makeAddPgTableOrderByPlugin` function is:

```ts
function makeAddPgTableOrderByPlugin(
  schemaName: string,
  tableName: string,
  ordersGenerator: (build: Build) => MakeAddPgTableOrderByPluginOrders,
  hint = `Adding orders with makeAddPgTableOrderByPlugin to "${schemaName}"."${tableName}"`
): Plugin;

interface MakeAddPgTableOrderByPluginOrders {
  [orderByEnumValue: string]: {
    value: {
      alias?: string;
      specs: Array<OrderSpec>;
      unique: boolean;
    };
  };
}

type OrderSpec = [string | SQL, boolean] | [string | SQL, boolean, boolean];
```

We also expose the `orderByAscDesc` helper which makes it easier to build the
`_ASC` and `_DESC` orders which are typically identical except for name and
reversed sort:

```ts
export function orderByAscDesc(
  baseName: string,
  columnOrSqlFragment: string | SQL,
  unique = false
): MakeAddPgTableOrderByPluginOrders;
```

Only set `unique` to true if you can guarantee that the sort order is unique.
