---
layout: page
path: /postgraphile/smart-comments/
title: Smart Comments
---

## Smart Comments

PostGraphile includes a feature which allows you to write smart comments on your tables, columns, relations, functions (and more) which are then used to alter the way the entities are exposed in the generated schema. As of version 4, smart comments can be used for renaming, and also to omit parts of the schema from being used.

This allows you to make easy changes to an existing schema without making breaking changes. 


## Table of Contents
  - [Smart rename](#smart-rename)
  - [Smart omit](#smart-omit)

## Smart rename

You can add a smart comment to an entity to rename that entity. Simply create a comment referring to the entitiy in question and use `@name` followed by the new name. You will find that all the related types and fields in GraphQL will reflect the change. If they don't update immediately, then you may have forgotten to enable `--watch` mode; you can restart the server to load the changes.

### Example

Here is a basic table, with the name changed from `original_table` to `renamed_table`:

```sql
create table original_table (
  col1 int
);

comment on table original_table is E'@name renamed_table';
```

The column can also be renamed: 

```sql
comment on column original_table.col1 is E'@name colA';
``` 

The same can be done for types and custom queries: 

```sql
create type flibble as (f text);

create function getFlamble() returns SETOF flibble as $$
    select body from post
$$ language sql;

comment on type flibble is E'@name flamble';
comment on function getFlamble() is E'@name allFlambles';
```

### Usage

The following can be renamed: 

tables
```sql
comment on table post is 
  E'@name message';
```
columns 
```sql
comment on column my_schema.my_table.my_column is 
  E'@name alternativeColumnName';
```
 relations 
 ```sql
 comment on constraint thread_author_id_fkey on thread is 
  E'@foreignFieldName threads\n@fieldName author';
```
unique-key record finder
```sql
comment on constraint person_pkey on person is 
  E'@fieldName findPersonById;
```
computed columns
```sql
comment on function person_full_name(person) is 
  E'@fieldName name';
```
custom queries
```sql
comment on function search_posts(text) is 
  E'@name returnPostsMatching';
```
custom mutations
```sql
comment on function authenticate(text, text) is 
  E'@name login';
```
custom mutation function results
```sql
comment on function authenticate(text, text) is 
  E'@name login\n@resultFieldName token';
```
types
```sql
comment on type flibble is 
  E'@name flamble';
```

## Smart omit
