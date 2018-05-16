---
layout: page
path: /postgraphile/reserved-keywords/
title: Reserved Keywords
---

## Reserved Keywords/Table names

Some table names can cause issues with PostGraphile due to conflicts with built in logic.

- *"query"* / *"queries"* - You can't have a table with this name because it conflicts with the root-level `query` object inherent to the PostGraphile schema.
- *"node"* / *"nodes"* - Can't have a table with this name because it conflicts with the GraphQL root `node(...)` interface.
- *"order_by"* / *"orderBy"* - Used by PostGraphile for ordering, cannot be declared as a function argument or table column.
