---
layout: page
path: /postgraphile/production/
title: Running PostGraphile in Production
---

## Running PostGraphile in Production

When you run PostGraphile in production you'll want to ensure that people
cannot easily trigger denial of service (DOS) attacks against you. Due to the
nature of GraphQL it's easy to construct a small query that could be very
expensive for the server to run, for example:

```graphql
allUsers {
  nodes {
    postsByAuthorId {
      nodes {
        commentsByPostId {
          userByAuthorId {
            postsByAuthorId {
              nodes {
                commentsByPostId {
                  userByAuthorId {
                    postsByAuthorId {
                      nodes {
                        commentsByPostId {
                          userByAuthorId {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

There's lots of techniques for protecting your server from these kinds of
queries; the [Pro Plugin](/postgraphile/plugins) [PRO] helps you implement a
few of them. One of the most effective techniques, if you can use it, is the
that of "persisted queries" as a query whitelist. This technique will only work
if you control all the GraphQL clients that you wish to talk to your GraphQL
endpoint and if they use only static queries. If you're expecting 3rd parties
to query your API then persisted queries will not help you, and this is where
the other techniques come in handy.

The rest of this article relates to Pro Plugin's approach to addressing these
issues.

### Sending queries to read replicas

Probably the most important thing regarding scalability is making sure that your
master database doesn't bow under the pressure of all the clients talking to it.
One way to reduce this pressure is to offload read operations to read replicas.
In GraphQL it's easy to tell if a request will perform any writes or not: if
it's a `query` then it's read-only, if it's a `mutation` then it may perform
writes.

Using `--read-only-connection <string>` [PRO] you may give PostGraphile a
separate connection string to use for queries, to compliment the connection
string passed via `--connection` which will now be used only for mutations.

(If you're using middleware, then you'll want to pass a read-only pool to the
`readReplicaPgPool` option instead.)

> NOTE: We don't currently support the multi-host syntax for this connection
> string, but you can use a PostgreSQL proxy such a PgPool or PgBouncer between
> PostGraphile and your database to enable connecting to multiple read
> replicas.

### Pagination caps

It's unlikely that you want users to request `allUsers` and receive back
literally all of the users in the database. More likely you want users to use
cursor-based pagination over this connection with `first` / `after`. The Pro
Plugin introduces the `--default-pagination-cap [int]` [PRO] option which
enables you to enforce a pagination cap on all connections. Whatever number
you pass will be used as the pagination cap, but you can override it on a
table-by-table basis using [smart comments](/postgraphile/smart-comments/) - in this case the `@paginationCap` smart comment.

```sql
comment on table users is
  E'@paginationCap 20\nSomeone who can log in.';
```

### Limiting GraphQL query depth

Most GraphQL queries tend to be only a few levels deep, queries like the deep
one at the top of this article are generally not required. You may use
`--graphql-depth-limit [int]` [PRO] to limit the depth of any GraphQL queries
that hit PostGraphile - any deeper than this will be discarded during query
validation.

### [EXPERIMENTAL] GraphQL cost limit

The most powerful way of preventing DOS is to limit the cost of GraphQL queries
that may be executed against your GraphQL server. The Pro Plugin contains a
very early implementation of this technique, but the costs are not very
accurate yet. You may enable a cost limit with `--graphql-cost-limit [int]`
[PRO] and the calculated cost of any GraphQL queries will be made available on
`meta` field in the GraphQL payload.

If your GraphQL query is seen to be too expensive, here's some techniques to
bring the calculated cost down:

* If you've not specified a limit (`first`/`last`) on a connection, we assume
  it will return 1000 results. If you're expecting fewer than this, specify the
  maximum you'd ever expect to receive.
* Cost is based on number of expected results (without looking at the
  database!) so lower your limits on connections.
* Connections multiply the cost of their children by the number of results
  they're expected to return, so lower the limits on connections.
* Nested fields multiply costs; so pulling a connection inside a connection
  inside a connection is going to be expensive - to address this, try placing
  lower `first`/`last` values on the connections or avoiding fetching nested
  data until you need to display it (split into multiple requests / only
  request the data you need).
* Subscriptions are automatically seen as 10x as expensive as queries - try
  and minimise the amount of data your subscription requests.
* Procedure connections are treated as more expensive than table connections.
* `totalCount` on a table has a fair cost
* `totalCount` on a procedure has a higher cost
* Using `pageInfo` adds significant cost to connections
* Computed columns are seen as fairly expensive - in future we may factor in
  PostgreSQL's `COST` parameter when figuring this out.

Keep in mind this is a **very early** implementation of cost analysis, there's
much improvement to be made. Feel free to reach out with any bad costs/queries
so we can improve it.
