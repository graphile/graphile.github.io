---
layout: page
path: /postgraphile/crud-mutations/
title: CRUD Mutations
---

## CRUD Mutations

CRUD, or "Create, Read, Update, Delete", is a common paradigm in data
manipulation APIs; "CRUD Mutations" refer to all but the "R". PostGraphile
will automatically add CRUD mutations to the schema for each table; this
behaviour can be disabled via the `--disable-default-mutations` CLI setting
(or the `disableDefaultMutations: true` library setting) if you prefer to
define all of your mutations yourself (e.g. with [custom
mutations](/postgraphile/custom-mutations/)).

Using the `users` table from the [parent article](/postgraphile/tables/),
depending on the PostGraphile settings you use (and the permissions you've
granted), you might get the following mutations:

* createUser - Creates a single `User`. [See example](/postgraphile/examples/#Mutations__Create).
* updateUser - Updates a single `User` using its globally unique id and a patch.
* updateUserById - Updates a single `User` using a unique key and a patch. [See example](/postgraphile/examples/#Mutations__Update).
* updateUserByUsername - Updates a single `User` using a unique key and a patch.
* deleteUser - Deletes a single `User` using its globally unique id.
* deleteUserById - Deletes a single `User` using a unique key. [See example](/postgraphile/examples/#Mutations__Delete).
* deleteUserByUsername - Deletes a single `User` using a unique key.

**The `update` and `delete` mutations are created only if the table contains a
`primary key` column.**

You also get the following query fields ("Read"):

* user - Returns a single `User` using its globally unique `ID`.
* userById - Reads a single `User` using its globally unique `ID`.
* userByUsername - Reads a single `User` using its unique `username`.
* allUsers - Returns a [connection](/postgraphile/connections/) enabling
  pagination through a set of (visible) `User`.

### Examples

```graphql
# Create a User and get back details of the record we created
mutation {
  createUser(
    input: {
      user: { id: 1, name: "Bilbo Baggins", username: "bilbo" }
    }
  ) {
    user {
      id
      name
      username
      createdAt
    }
  }
}

# Update Bilbo using the user.id primary key
mutation {
  updateUserById(
    input: { id: 1, userPatch: { about: "An adventurous hobbit" } }
  ) {
    user {
      id
      name
      username
      about
      createdAt
    }
  }
}

# Delete Bilbo using the unique user.username column and return the mutation ID
mutation {
  deleteUserByUsername(input: { username: "bilbo" }) {
    deletedUserId
  }
}
```