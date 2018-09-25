---
layout: page
path: /postgraphile/inflection/
title: Inflection
---

## Inflection

In PostGraphile, we have the concept of "inflection" which details how things
in PostgreSQL are named in the generated GraphQL schema.

The default inflections in PostGraphile attempts to map things to natural
names in GraphQL whilst attempting to avoid naming conflicts. For example:

* Table names are singularised and changed to UpperCamelCase: `pending_users` → `PendingUser`
* Column names are changed to camelCase: `created_at` → `createdAt`
* Relations reference the target type and the referencing columns: `postsByAuthorId` (see "advice" below about making this shorter!)

### Overriding Inflection - One-off

If you want to rename just one field or type, your best bet is to use a [smart
comment](/postgraphile/smart-comments/); e.g. for a table you might do:

```sql
COMMENT ON TABLE post IS E'@name message';
```

### Overriding Inflection - General

It's possible to override individual inflectors with a plugin. We've defined a
helper for this purpose called
[`makeAddInflectorsPlugin`](https://github.com/graphile/graphile-engine/tree/master/packages/graphile-utils#makeaddinflectorsplugin)
which can be found in the `graphile-utils` package.

For example, if you want `*Patch` types to instead be called `*ChangeSet`
you could make a plugin such as this one:

```js{5-7}
// MyInflectionPlugin.js
const { makeAddInflectorsPlugin } = require("graphile-utils");

module.exports = makeAddInflectorsPlugin({
  patchType(typeName: string) {
    return this.upperCamelCase(`${typeName}-change-set`);
  },
});

// Load this plugin with `postgraphile --append-plugins /path/to/MyInflectionPlugin.js`
```

The default Graphile Engine inflectors (`pluralize`, `singularize`,
`upperCamelCase`, `camelCase` and `constantCase`) can be found
[in makeNewBuild.js](https://github.com/graphile/graphile-engine/blob/6b0cb9e4e91050c98f1a9c62b73e3613a6c78f09/packages/graphile-build/src/makeNewBuild.js#L811-L815).

The additional inflectors used in PostGraphile can be found [in
PgBasicsPlugin.js](https://github.com/graphile/graphile-engine/blob/6b0cb9e4e91050c98f1a9c62b73e3613a6c78f09/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L296-L699).
There's a lot of them!

### Advice

The relation field names are quite explicit to avoid accidental conflicts,
and can make your schema quite verbose, e.g. `userByAuthorId`,
`userByEditorId`, `userByPublisherId`, etc.

Some people like this verbosity,
however if you prefer shorter names we encourage you use [the
`@graphile-contrib/pg-simplify-inflector`
plugin](https://github.com/graphile-contrib/pg-simplify-inflector). This
would automatically change those fields to be named `author`, `editor` and
`publisher` respectively.

```
postgraphile --append-plugins @graphile-contrib/pg-simplify-inflector
```

I, Benjie, prefer to use the pg-simplify-inflector in all my projects.
