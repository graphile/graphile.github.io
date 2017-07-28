---
layout: page
path: /
title: Extensible GraphQL APIs through Plugins
---

.header.container [

GraphQL-Build
=============

.row [
.col-6 [

Build your schema with plugins  
`buildSchema([...plugins])`

```graphql
type Person {
  # @deprecated Use 'name' instead
  # The person's first name
  firstName: String

  # @deprecated Use 'name' instead
  # The person's last name
  lastName: String

  # The person's full name
  name: String!
}
```

]
.col-6 [

Transform your schema with ease  
`buildSchema([...plugins, DeprecationFromCommentPlugin])`

```graphql
type Person {
  # The person's first name
  firstName: String @deprecated(reason: "Use 'name' instead")

  # The person's last name
  lastName: String @deprecated(reason: "Use 'name' instead")

  # The person's full name
  name: String!
}
```
]
]

]
