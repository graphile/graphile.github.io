---
layout: page
path: /postgraphile/computed-columns/
title: Computed Columns
---

## Computed Columns

Not all the data returned from PostGraphile has to be concrete data in your
database, we also support computing data on the fly. An example of this is our
"computed columns" feature where you can add what appears to be an extra column
(field) to the GraphQL type that represents your table which is actually
calculated by calling a function. We inline this function call into the
original select statement, so there's no N+1 issues with this - it's very
efficient.

You can create PostgreSQL functions that match the following criteria to add a
field to a table type. This field could be simple (such as `name` constructed
from `first_name || ' ' || last_name`) or could return a composite type (e.g.
database row) or even a whole connection. For this to work, the following rules
apply to the function you create:

* [Common PostGraphile function restrictions](/postgraphile/function-restrictions/)
* name must begin with the name of the table it applies to, followed by an underscore (`_`)
* first argument must be the table type
* must NOT return `VOID`
* must be marked as `STABLE`
* must be defined in the same schema as the table

### Example

This example creates two computed columns, one returning a simple varchar and
the other a connection. Note that these methods could also accept additional
arguments which would also automatically be added to the generated GraphQL
field:

```sql
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

create function my_schema.users_name(u my_schema.users)
returns varchar as $$
  select u.first_name || ' ' || u.last_name;
$$ language sql stable;

create function my_schema.users_friends(u my_schema.users)
returns setof my_schema.users as $$
  select users.*
  from my_schema.users
  inner join my_schema.friendships
  on (friendships.target_id = users.id)
  where friendships.user_id = u.id;
$$ language sql stable;
```
