---
layout: page
path: /postgraphile/custom-mutations/
title: Custom Mutations
---

## Custom Mutations

If the built in [CRUD Mutations](/postgraphile/crud-mutations/) are not
sufficient for your purposes, there's options for adding custom mutations to
your GraphQL schema.

### Custom Mutation SQL Procedures

You can create PostgreSQL functions that perform complex mutations. For these
functions the following rules apply:

- must return a **named** type - we do not currently support anonymous types; can return `VOID`
- must be marked as `VOLATILE` (which is the default)
- must be defined in one of the introspected schemas

Here's an example of a custom mutation, which will generate the graphql `acceptTeamInvite(teamId: Int!)` mutation:

```sql
CREATE FUNCTION app_public.accept_team_invite(team_id integer)
RETURNS app_public.team_members
AS $$
  UPDATE app_public.team_members
    SET accepted_at = now()
    WHERE accepted_at IS NULL
    AND team_members.team_id = accept_team_invite.team_id
    AND member_id = app_public.current_user_id()
    RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
```

Notes on the above function:

- `STRICT` is optional, it means that if any of the arguments are null then the
  mutation will not be called (and will thus return null with no error).
- `SECURITY INVOKER` is the default, it means the function will run with the
  _security_ of the person who _invoked_ the function
- `SECURITY DEFINER` means that the function will run with the _security_ of
  the person who _defined_ the function, typically the database owner - this
  means that the function may bypass RLS, RBAC and other security concerns. Be
  careful when using `SECURITY DEFINER` - think of it like `sudo`!
- we use `LANGUAGE sql` here, but you can use `LANGUAGE plpgsql` if you need
  variables or looping or if blocks or similar concerns; or if you want to
  write in a more familiar language you can use `LANGUAGE plv8` (JavaScript,
  requires extension), or one of the built in `LANGUAGE` options such as
  Python, Perl or Tcl

A note on **named types**: if you have a function that `RETURNS SETOF table(a
int, b text)` then PostGraphile will not pick it up. This is easy to fix, just
define a named type:

```sql
CREATE TYPE my_function_return_type AS (
  a int,
  b text
);
```

and then change your function to `RETURNS SETOF my_function_return_type`.

### Custom Mutation Graphile Plugins

If you prefer adding mutations on the JavaScript side, you can use
`ExtendSchemaPlugin` from `graphile-utils`; see [Schema
Plugins](/postgraphile/extending/) for more information.

### GraphQL Schema Stitching

You can also stitch multiple GraphQL schemas together, you can read more about
doing this with PostGraphile here: [Authenticated and Stitched Schemas with
PostGraphile, Passport and
Stripe](https://medium.com/@sastraxi/authenticated-and-stitched-schemas-with-postgraphile-passport-and-stripe-a51490a858a2).
