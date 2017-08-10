---
layout: page
path: /postgraphile/performance/
title: Performance
---

## Performance

We leverage graphile-build's [look-ahead](/graphile-build/look-ahead/) features
when resolving a GraphQL request so that a single root level query, no matter
how nested, is compiled into just one SQL query. PostgreSQL has an excellent
query planner which optimises and executes this query for us, avoiding the need
for multiple round-trips to the database and thus solving the N+1 problem
that is found in many GraphQL APIs.

For example the following query would be compiled into one SQL statement:

```graphql
{
  allPosts {
    edges {
      node {
        id
        title
        author: userByAuthorId {
          ...UserDetails
        }
        comments {
          text
          author: userByAuthorId {
            ...UserDetails
            recentComments {
              date
              post: postByPostId {
                title
                author {
                  ...UserDetails
                }
              }
              text
            }
          }
        }
      }
    }
  }
}

fragment UserDetails on User {
  id
  username
  bio: bioByUserId {
    preamble
    location
    description
  }
}
```
