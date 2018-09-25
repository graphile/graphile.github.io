---
layout: page
path: /postgraphile/crud-mutations/
title: CRUD Mutations
---

## CRUD Mutations

We automatically add default CRUD mutations to the schema; this can be disabled
via the `--disable-default-mutations` CLI setting (or the
`disableDefaultMutations` library setting, or the `pgDisableDefaultMutations`
graphile-build-pg setting depending on how you're using this software).

For example, using the `person` table from the previous section, depending on
the PostGraphile settings you use, you might get the following mutations:

* createPerson - Creates a single `Person`.
* updatePerson - Updates a single `Person` using its globally unique id and a patch.
* updatePersonById - Updates a single `Person` using a unique key and a patch.
* updatePersonByEmail - Updates a single `Person` using a unique key and a patch.
* deletePerson - Deletes a single Person using its globally unique id.
* deletePersonById - Deletes a single `Person` using a unique key.
* deletePersonByEmail - Deletes a single `Person` using a unique key.

The `update` and `delete` mutations are created only if the table contains a
`primary key` column.

You also get the following query fields:

* person - Returns a single `Person` using its globally unique `ID`.
* personById - Reads a single `Person` using its globally unique `ID`.
* personByEmail - Reads a single `Person` using its unique `email`.
* allPeople - Returns a [connection](/postgraphile/connections/) enabling
  pagination through a set of (visible) `Person`.

### Examples

```graphql
# Create a Person and get back details of the record we created
mutation {
  createPerson(
    input: {
      person: { id: 1, name: "Bilbo Baggins", email: "bilbo@theshire.com" }
    }
  ) {
    person {
      id
      name
      email
      createdAt
    }
  }
}

# Update Bilbo using the person.id primary key
mutation {
  updatePersonById(
    input: { id: 1, personPatch: { about: "An adventurous hobbit" } }
  ) {
    person {
      id
      name
      email
      about
      createdAt
    }
  }
}

# Delete Bilbo using the unique person.email column and return the mutation ID
mutation {
  deletePersonByEmail(input: { email: "bilbo@theshire.com" }) {
    deletedPersonId
  }
}
```
