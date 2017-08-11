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

For example, for a table `superheroes`, depending on the PostGraphile settings
you use, you might get the following mutations:

- createSuperhero - Creates a single `Superhero`.
- updateSuperhero - Updates a single `Superhero` using its globally unique id and a patch.
- updateSuperheroByRowId - Updates a single `Superhero` using its row id and a patch.
- deleteSuperhero - Deletes a single `Superhero` using its globally unique id.
- deleteSuperheroByRowId - Deletes a single `Superhero` using its row id.

You also get the following query fields:

- superhero - Returns a single `Superhero` using its globally unique `ID`.
- superheroByRowId - Returns a single `Superhero` using its database row ID.
- allSuperheroes - Returns a [connection](/postgraphile/connection/) enabling pagination through all (visible) superheroes.

TODO: add example
