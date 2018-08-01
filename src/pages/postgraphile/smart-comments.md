---
layout: page
path: /postgraphile/smart-comments/
title: Smart Comments
---

## Smart Comments

You can customise your PostGraphile GraphQL schema by adding comments to tables, columns, functions, relations, etc. within your PostgreSQL database. These changes could be renaming something (via `@name newNameHere`), or omitting things from your GraphQL schema (via `@omit`), or anything else a plugin supports!

We call this functionality "Smart Comments" and it allows you to easily customise the generated GraphQL schema without making breaking changes to your database.

If you're using PostGraphile in `--watch` mode, you should be able to see in PostGraphile's GraphiQL client that the related types and fields will reflect the change almost immediately. If you're not using `--watch` then you may need to restart the server for smart comment changes to take effect.

### Table of Contents
  - [Smart comment spec](#smart-comment-spec)
  - [Deprecating](#deprecating)
  - [Renaming](#renaming)
  - [Omitting](#omitting)

### Smart comment spec

Comments can be added to various entities within PostgreSQL; we add a special syntax to these comments that enables PostGraphile to treat them as smart comments.

A smart comment is made up of one or more "tags" and optionally followed by the remaining comment. Tags may have a string payload (which follows a the tag and a space, and must not contain newline characters) and are separated by newlines. Tags always start with an `@` symbol and must always come before the remaining comment, hence all smart comments start with an `@` symbol. If a tag has no payload then its value will be the boolean `true`, otherwise it will be a string. If the same tag is present more than once in a smart comment then its final value will become an array of the individual values for that tag.

The following text could be parsed as a smart comment (**the smart comment values shown are examples only, and don't have any meaning**):

```
@name meta
@isImportant
@jsonField date timestamp
@jsonField name text
@jsonField episode enum ONE=1 TWO=2
This field has a load of arbitrary tags.
```

and would result in the following JSON tags object:

```json
{
  "name": "meta",
  "isImportant": true,
  "jsonField": [
    "date timestamp",
    "name text",
    "episode enum ONE=1 TWO=2"
  ]
}
```

and the description on the last line would be made available as documentation as non-smart comments are.

```
This field has a load of arbitrary tags.
```

To put newlines in smart comments we recommend the use of the [`E` "escape" string constants](https://www.postgresql.org/docs/10/static/sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS), wherein you can use `\n` for newlines. For example the text above could be added to a comment on a field via:

```sql
comment on column my_schema.my_table.my_column is
  E'@name meta\n@isImportant\n@jsonField date timestamp\n@jsonField name text\n@jsonField episode enum ONE=1 TWO=2\nThis field has a load of arbitrary tags.';
```

There are a few smart comment tags built into PostGraphile, but support for more can be added via plugins.

Note that the parser is deliberately very strict currently, we might make it more flexible in future; you might want to check out the [test suite](https://github.com/graphile/graphile-build/blob/master/packages/graphile-build-pg/__tests__/tags.test.js).

### Deprecating

You can deprecate a database column using the `@deprecated` tag. If you need multiple lines, you can specify the tag multiple times, one per line of output text.

```sql
comment on column my_schema.my_table.my_column is
  E'@deprecated Use myOtherColumn instead.';
```

### Renaming

You can add a smart comment to an entity to rename that entity. For tables, columns, custom types and many functions you can use the `@name` tag followed by the new name. For more complex things we use different tags, such as for foreign key constraints we have `@fieldName` and `@foreignFieldName`.


The following can be renamed: 

#### Tables

```sql
comment on table post is 
  E'@name message';
```

#### Columns 

```sql
comment on column my_table.my_column is 
  E'@name alternativeColumnName';
```

#### Relations 

```sql
comment on constraint thread_author_id_fkey on thread is 
  E'@foreignFieldName threads\n@fieldName author';
```

#### Unique-key record finders

```sql
comment on constraint person_pkey on person is 
  E'@fieldName findPersonById';
```

#### Computed columns

```sql
comment on function person_full_name(person) is 
  E'@fieldName name';
```

#### Custom queries

```sql
comment on function search_posts(text) is 
  E'@name returnPostsMatching';
```

#### Custom mutations

```sql
comment on function authenticate(text, text) is 
  E'@name login';
```

#### Custom mutation function result names

```sql
comment on function removeSomething(text) is 
  E'@resultFieldName success';
comment on function authenticate(text, text) is 
  E'@resultFieldName token\n@name login';
```

#### Types

```sql
comment on type flibble is 
  E'@name flamble';
```

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
    select (body)::flibble from post
$$ language sql;

comment on type flibble is E'@name flamble';
comment on function getFlamble() is E'@name allFlambles';
```

Smart comments are also reflected in GraphiQL. Here, we are querying the table `original_table` by looking at `allOriginalTables`:

<div class="full-width">

![GraphiQL displaying allOriginalTables](./smart-comments-rename-example1.png)

</div>

Next, we add the smart comment `E'@name renamed_table'` on `original_table` and the rename is instantly reflected in GraphiQL: 

<div class="full-width">

![GraphiQL displaying the renamed allOriginalTables](./smart-comments-rename-example2.png)

</div>

So now the query needs to use the new name for the table: 

<div class="full-width">

![GraphiQL displaying allRenamedTables](./smart-comments-rename-example3.png)

</div>

### Omitting

To remove an entity from your API, create a comment on the entity in question and use `@omit`. If you only want to omit the entity from certain operations you can list them. For example, `@omit update` on a table would prevent the table from having an update-related functionality whilst still including queries, create and delete. `@omit update` on a column would prevent the column appearing in the `Patch` type, so it cannot be updated (but can still be created) via GraphQL.

Here's a quick-reference for the operations we currently support (you'll want to experiment with them as there wasn't space to put all the caveats in the table!):

<div class='big-table'>

⁣ | Action |	Table effect	| Column effect | Function effect
--- | --- |------|------|-------
C | **`create`** |	omit `create` mutation	| omit from `create` |	-
R | **`read`**	| omit completely |	completely omitted |	-
U | **`update`** |	omit `update` mutations |	omit from `update` | -
D | **`delete`**	| omit `delete` mutations | - |	-
F | **`filter`**	| omit `condition` arg |	omit from `condition` |	no filtering
O | **`order`**	| omit `orderBy` arg | omit from `orderBy` | no ordering
A | **`all`**	| no `allFoos` query	| - |	-
M | **`many`**	| no foreign key fields |	- |	-
X | **`execute`**	| -	| -	| function not present

</div>

> **Warning:** This functionality is not intended for implementing permissions, it's for removing things from your API that you don't need. You should back these up with database permissions if needed.

#### Unique-key record finders
To exclude Unique-key record finders (_e.g._ `photoByUrl` or `personById`) from your GraphQL schema, add an `@omit` comment on the constraint

```sql
comment on constraint person_pkey on person is 
  E'@omit';
```
>**Note:** Only `@omit` alone does the desired job. Listing any operation(s) (`create`, `filter`, `many`...) will yield no results.

#### Usage

Add a comment on your entity with the following format: 

```sql
comment on table table_name is E'@omit <actions>'; 
```

Multiple actions can be listed using commas (no spaces!), as in the following example which disables mutations on a table:

```sql
comment on table table_name is E'@omit create,update,delete';
```

#### Example

On a simple table called `book` we have added a smart comment omitting the `update` and `delete` operations:

```sql
create table forum_example.book (
  col1 int
);

comment on table forum_example.book is E'@omit update,delete';
```

The results are immediately reflected in GraphiQL. We can also disable `create` operations:

```sql
comment on table forum_example.book is E'@omit create,update,delete';
```

On the left, you can see the documentation for all the fields and types regarding `book` before the `create` operation was omitted. On the right, you can see the reduced fields and types once the `create` operation is omitted.

![GraphiQL displaying an omit smart comment example](./smart-comments-omit-example.png)
