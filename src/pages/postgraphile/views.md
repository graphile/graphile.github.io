---
layout: page
slug: /postgraphile/views/
title: Views
---

## Views

PostGraphile supports reading from and writing to views; however PostgreSQL
lacks the powerful introspection capabilities on views that it has on tables,
so we cannot easily automatically infer the relations. However, you can [use
our "smart comments" functionality to add constraints to
views](/postgraphile/smart-comments/#constraints) which will make them a lot
more table-like (giving them a primary key so you can get a `nodeId`, adding
foreign key references between views and other views or tables, setting
columns as non-null).

Help expanding this page would be welcome, please use the "Suggest
improvements to this page" link above.
