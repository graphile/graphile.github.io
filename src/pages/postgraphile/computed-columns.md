---
layout: page
path: /postgraphile/computed-columns/
title: Computed Columns
---

## Computed Columns

"Computed columns" add what appears to be an extra column (field) to the
GraphQL table type, but unlike actual columns the value for this field is the
result of calling a function. This function can accept additional arguments
that influence its result, and can return a scalars, records, lists or sets.
Sets (denoted by `RETURNS SETOF ...`) are exposed as
[connections](/postgraphile/connections/).

_Performance note: we inline these function calls into the original `SELECT`
statement, so there's no N+1 issues - it's very efficient._

To create a function that PostGraphile will recognise as a computed column,
it must obey the following rules:

* adhere to [common PostGraphile function restrictions](/postgraphile/function-restrictions/)
* name must begin with the name of the table it applies to, followed by an underscore (`_`)
* first argument must be the table type
* must NOT return `VOID`
* must be marked as `STABLE` (or `IMMUTABLE`)
* must be defined in the same PostgreSQL schema as the table

### Example

This example creates two computed columns, one returning a simple varchar and
the other a connection. Note that `||` in PostgreSQL is string concatenation.

```sql{14-17,20-27}
create table my_schema.users (
  id serial not null primary key,
  first_name varchar not null,
  last_name varchar not null
);

create table my_schema.friendships (
  user_id integer not null,
  target_id integer not null,
  primary key (user_id, target_id)
);

-- Creates `User.name` string field
create function my_schema.users_name(u my_schema.users)
returns varchar as $$
  select u.first_name || ' ' || u.last_name;
$$ language sql stable;

-- Creates `User.friends` connection
create function my_schema.users_friends(u my_schema.users)
returns setof my_schema.users as $$
  select users.*
  from my_schema.users
  inner join my_schema.friendships
  on (friendships.target_id = users.id)
  where friendships.user_id = u.id;
$$ language sql stable;
```

You can also expose addition arguments via your computed column function, and these will be exposed via GraphQL:

```sql{1,4}
-- Creates `User.greet(greeting: String!)` string field
create function my_schema.users_greet(
  u my_schema.users,
  greeting text
) returns varchar as $$
  select greeting || ', ' || u.first_name || ' ' || u.last_name || '!';
$$ language sql stable strict;
```
