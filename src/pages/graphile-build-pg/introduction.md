---
layout: page
path: /graphile-build-pg/introduction/
title: Graphile-Build-PG Introduction
---

## Introduction

`graphile-build-pg` is a collection of plugins for Graphile-Build that enable
you to quickly generate a powerful GraphQL schema from a PostgreSQL schema -
automatically creating types and fields based on PostgreSQL tables, columns,
relations, functions and more.

Some of the features we offer:

- [Connections for easy pagination](/graphile-build-pg/connections/)
- [Auto-discovered relations](/graphile-build-pg/relations/)
- [Automatic CRUD mutations](/graphile-build-pg/crud-mutations/)
- [Computed columns](/graphile-build-pg/computed-columns/)
- [Custom query functions](/graphile-build-pg/custom-queries/)
- [Custom mutation functions](/graphile-build-pg/custom-mutations/)

### Performance

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
