---
layout: page
slug: /graphile-build-pg/settings/
title: Settings
---

## Settings

The following settings are supported:

* `pgConfig`\*: either the PostgreSQL connection string ('postgres://user:password@host/dbname') or a pgClient with which to introspect the database
* `pgSchemas`\*: an array of schema names to introspect, e.g. `['public']`
* `pgInflection`: the inflection object to use for naming fields/types/arguments/values. See: [postgraphile/src/inflections.js](https://github.com/graphile/graphile-engine/blob/master/packages/postgraphile/src/inflections.js)
* `pgExtendedTypes`: set `true` (default) to use JSON and other advanced types, set `false` to use strings instead
* `pgJwtTypeIdentifier`: the fully qualified name of a compound type which, if seen, will be converted to a signed JWT token and returned as a string instead.
* `pgJwtSecret`: the secret with which to sign the above token
* `pgDisableDefaultMutations`: set to `true` if you don't want to use our default [CRUD mutations](/postgraphile/crud-mutations/)

\* Required
