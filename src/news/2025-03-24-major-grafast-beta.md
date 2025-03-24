---
layout: post
title: "Major Grafast beta: three down, one to go"
date: 2025-03-24T17:00:00Z
path: /news/20250324-major-grafast-beta/
thumbnail: /images/news/coder.svg
thumbnailAlt: "A developer looks at her monitor while holding a cup of tea."
tags: announcements, releases, grafast, postgraphile
noToc: false

summary:
  "This release contains more than 3 months of work, and is a major step towards
  release readiness."
---

_Announced 2025-03-24 by Benjie_

<p class='intro'>
In the first Gra<em>fast</em> Working Group, we outlined 4 <em>major</em> issues in Gra<em>fast</em>
  that needed to be addressed before we could think about general release. With
  this release, 3 of these are now complete!
</p>

- ✅⤵️ Global dependencies - solved via "unary" steps
- ✅⤵️ Early exit - solved via "flags"
- ✅🎉 **Eradicating eval - this release!**
- 🤔🔜 Polymorphism

After 3 months of gruelling work, we're proud to announce that the third of
these, eradicating eval, is now addressed with the launch of
`grafast@0.1.1-beta.21` (used as the core execution engine in
`postgraphile@5.0.0-beta.39`). Let's look into what that has meant.

## Input evaluation moved to runtime

_Ref:
[https://github.com/graphile/crystal/issues/2060](https://github.com/graphile/crystal/issues/2060)_

Since the beginning, Gra*fast* has had the ability to add plan resolvers not
just to fields, not just to arguments, but also to input object fields
(including those within lists). This made Gra*fast*'s planning really ergonomic
for things like nested filters, which was great for PostGraphile! But it turns
out it's really problematic for certain shapes of input — planning would put
constraints on the variables compatible with the plan, requiring potentially
unlimited numbers of operation plans needing to be built for the same GraphQL
document. Worse: for large input trees involving lists, the number of steps
generated could be overwhelming, resulting in the deduplication phase taking
excessive time.

One particular user example that could cause 4 minutes of planning time from
just a 100kB input made it clear that we had overreached with using plan
resolvers too deep into inputs; so we've scaled it back so that you can only add
plan resolvers to fields and arguments, you can no longer attach `applyPlan` or
`inputPlan` to input object fields. This was something that we used a lot
internally (hence the huge time investment migrating away!), but very few people
(no-one?) used externally so it was ripe for removal.

That problematic query that took 4 minutes to plan before? It now takes 1.1ms to
plan, yielding a 200,000x speedup!

### What does this mean for my codebase?

Hopefully good things! Please update to the latest `@beta` of all the
PostGraphile and/or Gra*fast* related modules you're using (including plugins)
and for most users everything should work as before, only better.

I've outlined some of the most common changes you may need to make below, but if
you are impacted by any other changes, please ask for help in the chat — AFAIK
most of the other things that have had significant changes are used by almost
no-one except me, so it doesn't make sense for me to invest time documenting it
here. If you're curious, many items are documented in both the changelogs and
the pull requests where the changes occurred.

#### Change `fieldArgs.get` to `fieldArgs.getRaw`

Because we've removed `inputPlan`, the `fieldArgs.get(key)` method is no more;
instead use `fieldArgs.getRaw(key)` which is equivalent unless the inputs had
plans (which they cannot any more).

#### Converting `applyPlan` and `inputPlan`

If your input object fields did have plan resolvers then instead of having
Grafast automatically call them on each and every input field recursively at
plan-time, we now have the `applyInput` and `bakedInput` steps that represent
runtime application or transform of these inputs recursively via a single step
in our plan diagram.

We've managed to make this new runtime system very similar in shape to the old
plan-time system, so PostGraphile plugins don't need to change much — this was
largely enabled by how closely we managed to get the Grafast plan syntax to the
syntax of code you would normally write at runtime. The first change is to
rename `applyPlan` to `apply`, and `inputPlan` to `baked`. From there, your code
might just work straight away, or it might need some more small tweaks (e.g.
`fieldArgs` is no longer present, it's been replaced with simply the runtime
value of the current field).

#### No more `$step.eval*()`

The eval methods are now marked as internal so you will get TypeScript errors if
you try and use them. They will likely be removed at some point after release,
so you should be sure to migrate away from using them at your earliest
opportunity. But you weren't using them anyway… right?

#### ExecutableStep renamed to Step

This one is more cosmetic…

Since we no longer have plan resolvers deep in inputs, we no longer have the
`ModifierStep` system that was used for managing them (it's been replaced with
`Modifier` which happens at runtime). Since we no longer have ModifierStep, we
no longer need `BaseStep` to be separate from and inherited by `ExecutableStep`,
so we've merged them. Since this is the base class for _all_ steps now, we've
renamed it to simply `Step`.

_We have kept an <code>ExecutableStep</code> export for backwards
compatibility._

## PostGraphile changes

In addition to the changes above that impact everything that uses Gra*fast*,
here are some of the changes that specifically impact PostGraphile users.

### SQL generation moved to runtime

PostGraphile's various SQL-running steps like PgSelectStep now build their
queries at runtime rather than plantime. They use the "builder" pattern, where
much of the SQL query can be established at plan-time, but final tweaks can be
applied at run-time (register tweaks via the `$pgSelect.apply($callback)`
method) before the query is built.

### SQL efficiency increased

Since we have more information at run-time, our SQL queries were able to become
even simpler, 10% smaller on average across our test suite! This nets us a
modest performance improvement inside PostgreSQL, but the shift to runtime does
cost us a little performance in the JS layer since queries now need to be built
for every request, rather than once per plan. We're happy with this tradeoff;
one of the core goals of PostGraphile V5 (and the motivation for Grafast in the
first place) was to shift load from the PostgreSQL layer (which is non-trivial
to scale) to the Node.js layer (which is easy to scale horizontally).

### Postgres Arrays now parse 5x faster

I've also [backported](https://github.com/bendrucker/postgres-array/pull/19)
these [fixes](https://github.com/bendrucker/postgres-array/pull/20) into the
`postgres-array` npm module for everyone that uses `pg` to benefit from.

### Easier to write SQL fragments

Added a new feature to `pg-sql2` that allows us to handle non-SQL parameter
embeds with custom code, making it easier to write custom SQL, e.g. if a value
is already coming from SQL you can embed it directly without having to invoke
placeholder:

```diff
 const $fooId = $foo.get('id');
-$pgSelect.where(sql`foo_id = ${$pgSelect.placeholder($fooId)}`);
+$pgSelect.where(sql`foo_id = ${$fooId}`);
```

We've also added the ability to embed dynamic SQL fragments that can be
dependent on runtime values (these values must be unary, i.e. they must come
from GraphQL field arguments or derivatives thereof):

```ts
const $includeArchived = fieldArgs.getRaw("includeArchived");
const $condition = lambda($includeArchived, includeArchived =>
  includeArchived ? sql.true : sql`is_archived is false`
);
$pgSelect.where($condition);
```

## Additional changes

### makeGrafastSchema

- 🚨The structure of `makeGrafastSchema` as it relates to arguments and input
  object fields has changed a little; use TypeScript to guide you. I'm hoping
  this is the last change of its kind before release.
- New shortcuts added for argument `applyPlan()` and input field `apply()`
  methods.
- Trimmed a load of unnecessary exported code, such as empty objects and field
  resolvers that do the same as the default field resolver.
- Fix bug in `makeGrafastSchema` that fails to build schema sometimes if a field
  uses a function shortcut rather than object definition.
- Fix bug in `makeGrafastSchema` that sometimes doesn't allow defining input
  objects

🚨 If you use `graphile-export` to export your schema as executable code, be
sure to regenerate your schemas as the old generated code could be
misinterpreted by the new `makeGrafastSchema`.

### graphile-export

- Massively improved the executable code output from `graphile-export` in
  combination with the changes to `makeGrafastSchema` above.
- PostGraphile's "kitchen sink" schema export code now outputs 37KLOC rather
  than 47KLOC - a significant reduction in complexity!

### Improved plan diagrams

- Plan diagrams now reveal (via `@s` text) if a step is meant to be streamed.
- Constant steps improved.
- `Object: null prototype` simplified to `§` in output.
- Hoist steps during `optimize` phase.
- We no longer render dependencies on the `undefined` constant, because it's
  messy and doesn't add value
- We group when there are multiple dependencies to the same step from the same
  step, and label the line with the count instead.

### Step classes

When writing your own step classes:

- `ExecutionValue` has gained a new `.unaryValue()` method that returns the
  unary value for unary execution values, and throws an error for non-unary
  execution values. This is much safer than the previous `.at(0)` trick which
  did not assert that you were actually dealing with a unary execution value.
- If you were using `@stream` (incremental delivery) and had written your own
  `Step` class with stream support, first of all: amazing! Please let me know
  you did that! Secondly, you'll need to either rename your `stream` function to
  `execute` or merge its code into your existing `execute` method if you have
  one. It turns out there wasn't much point in separating them, and you can
  confer a lot of benefit from merging them.

### Other Gra*fast* improvements

- Compatible mutation operations can now complete synchronously via
  `grafastSync()`
- Fixes bug in input objects where keys that weren't set would still be present
  with value `undefined`
- Fix bug in step caching relating to polymorphism
- New `items()` conventional method for extracting the items from a collection
  (makes for easier compatibility with connections)
- Error handling improved
- Lists improved - especially error handling and deduplication logic; as well as
  allowing returning connection-capable steps in list positions
- Optimization to Gra*fast*'s internal execution values, which are used heavily
  in hot paths.
