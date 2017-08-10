---
layout: page
path: /postgraphile/performance/
title: Performance
---

## Performance

A single root level query, no matter how nested, is compiled into one SQL query
which avoids multiple round-trips to the database. For example the following
query would be compiled into one SQL statement - no need for `DataLoader`!

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

This is accomplished using Graphile-Build's powerful
[look-ahead](/graphile-build/look-ahead/) features combined with PostgreSQL's
awesomely powerful queries.
