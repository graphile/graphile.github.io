---
layout: page
path: /postgraphile/custom-queries/
title: Custom Queries
---

## Custom Queries

Like [computed columns](/postgraphile/computed-columns/), you can also add
root-level Query fields by creating a [PostgreSQL function][procedures]. The arguments to
these functions will be exposed via GraphQL also - named arguments are
preferred, if your arguments are not named we will assign them an
auto-generated name such as `arg1`. The rules that apply to these are the
following:

- if the function accepts arguments, the first argument must NOT be a table type (see computed columns above)
- must return a named type - we do not currently support anonymous types
- must NOT return `VOID`
- must be marked as `STABLE`
- must be defined in one of the introspected schemas

### Example

So let’s write a search query for our [forum example][] using the PostgreSQL
[`LIKE`][] operator (we’ll actually use `ILIKE` because it is case
insensitive). The custom query we create is included in the forum example’s
schema, so if you want to run that example locally you can try it out.

The procedure would look like the following. Indentation is non-standard so we can fit in comments to explain what’s going on.

```sql
-- Our `post` table is created with the following columns. Columns unnecessary
-- to this demo were omitted. You can find the full table in our forum example.
create table post (
  …
  headline         text not null,
  body             text,
  …
);

-- Create the function named `search_posts` with a text argument named `search`.
create function search_posts(search text)
  -- This function will return a set of posts from the `post` table. The
  -- `setof` part is important to PostGraphQL, check out our procedure docs to
  -- learn why.
  returns setof post as $$
    -- Write our advanced query as a SQL query!
    select *
    from post
    where
      -- Use the `ILIKE` operator on both the `headline` and `body` columns. If
      -- either return true, return the post.
      headline ilike ('%' || search || '%') or
      body ilike ('%' || search || '%')
  -- End the function declaring the language we used as SQL and add the
  -- `STABLE` marker so PostGraphQL knows its a query and not a mutation.
  $$ language sql stable;
```

And that’s it! You can now use this function in your GraphQL like so:

```graphql
{
  searchPosts(search: "Hello world", first: 5) {
    pageInfo {
      hasNextPage
    }
    totalCount
    nodes {
      headline
      body
    }
  }
}
```

[procedures]: /postgraphile/procedures/
[forum example]: https://github.com/graphile/postgraphile/tree/master/examples/forum
[`LIKE`]: http://www.postgresql.org/docs/current/static/functions-matching.html
