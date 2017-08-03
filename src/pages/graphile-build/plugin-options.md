---
layout: page
path: /graphile-build/plugin-options/
title: Plugin Options
---

## Plugin Options

The following options apply to the default plugins:

- `nodeIdFieldName` - defaults to `id` which might clash with your other
  fields. It is not recommended to change it, but you might consider `nodeId`
  instead. (Use of `__id` is discouraged because GraphQL wants to deprecate
  non-introspection fields that begin with `__`)

Plugins may define further options if they wish
