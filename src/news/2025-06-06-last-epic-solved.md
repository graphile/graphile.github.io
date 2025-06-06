---
layout: post
title: "Grafast beta: last epic solved!"
date: 2025-06-06T17:00:00Z
path: /news/20250606-last-epic-solved/
thumbnail: /images/news/grafast-wordmark-2023.svg
thumbnailAlt: "The Grafast logo"
tags: announcements, releases, grafast, postgraphile
noToc: false

summary:
  "Polymorphism overhauled for greater efficiency and ergonomics. This is the
  last breaking change to plan resolvers we are expecting for v1."
---

_Announced 2025-06-06 by the Graphile Team_

<p class='intro'>
In the first Gra<em>fast</em> Working Group, we outlined 4 <em>major</em> issues in Gra<em>fast</em> that needed to be addressed before we could think about general release. The fourth, and final, epic has now been solved! 
</p>

- ✅ Global dependencies — solved via “unary” steps
- ✅ Early exit — solved via “flags”
- ✅ Eradicating eval
- ✅ **Polymorphism — this release!**

In previous versions of Gra*fast* there was the possibility of exponential plan
branching due to the naive method of resolution of abstract types — a known
issue raised in the first Gra*fast* working group as one of four “epics” to be
solved before v1.0. This release of `grafast@0.1.1-beta.22` (used as the core
execution engine in `postgraphile@5.0.0-beta.41`) fixes this final epic through
a complete overhaul of the polymorphism system. Let’s take a look!

### Polymorphism Epic Achieved

By moving the responsibility of polymorphic resolution from field plan resolvers
into the abstract types themselves, we’ve centralized this logic, simplified
field plan resolvers, and unlocked more optimization opportunities and greater
execution efficiency. We no longer have the concept of “polymorphic capable”
steps: any step may now be used for polymorphism. Abstract types now gain a
`planType` method responsible for taking a “specifier” from the field plan
resolver and returning a step representing the name of its concrete object type
along with subplans for each possible object types.

To solve the problem of exponential branching, we merge the new “specifier”
steps from all of the previous polymorphic branches into a single combined step
before planning the next level of polymorphism.

Users of PostGraphile’s Postgres-based polymorphism should not need to take any
action to benefit from these changes, and may notice that their SQL queries are
now slightly smaller.

For the few of you who have been brave enough to hand write polymorphic plan
resolvers: first of all, thank you for trying it out! Hand written polymorphic
plan resolvers will need to be updated to match the new paradigm, this will
involve moving the polymorphic resolution from field plan resolvers into the new
`planType` method on the relevant abstract type (interface or union) and
adjusting the logic to fit the new pattern. Steps such as `polymorphicBranch`,
`pgPolymorphism`, and other polymorphism related steps no longer exist as they
are no longer supported or needed in this new paradigm. For guidance on how to
write the `planType` method, see
[the Gra*fast* docs](https://grafast.org/grafast/polymorphism) and please reach
out to us on Discord or GitHub issues — we’d love to help you get migrated.

Excitingly this is the last change to hand written plan resolvers that we expect
to make for v1.0 (other than some improvements around TypeScript types), so
we're getting a lot closer to release candidate stage!

### TypeDefs / plans overhaul

In order to make the libraries more type safe, `makeGrafastSchema` (from
`grafast`) and `makeExtendSchemaPlugin` (from `postgraphile/utils`) have
deprecated the `typeDefs`/`plans` pattern since `plans` (like `resolvers` in the
traditional format) ended up being a mish-mash of lots of different types
(objects, scalars, enums, etc) and `__`-prefixed fields (`__resolveType`,
`__isTypeOf`, etc) for methods on the type itself.

Going forwards, the configuration should be split into `typeDefs` with
`objects`, `interfaces`, `unions`, `inputObjects`, `scalars` and `enums` as
appropriate. Type-level properties such as
`resolveType`/`isTypeOf`/`planType`/`scope`/etc are no longer prefixed with `__`
and, to avoid conflicts with these type-level properties, object and input
object fields should be specified inside a new `plans` property and enum values
within the new `values` property.

**The old pattern will still work** (this is not a breaking change), but we
recommend moving to the new shape and will use it for all of our examples in the
documentation from now on.

Migration is quite straightforward:

1. **Add new top-level properties**. Add `objects`, `interfaces`, `unions`,
   `inputObjects`, `scalars`, and `enums` as top level properties alongside
   `typeDefs` and `plans`. Each should be an empty object. You can skip any
   where you’re not defining types of that kind.

1. **Split definitions based on type kind**. For each type defined in `plans`
   move it into the appropriate new object (based on keyword defining the type;
   i.e. `type` &rarr; `objects`, `interface` &rarr; `interfaces`, `union` &rarr;
   `unions`, `input object` &rarr; `inputObjects`, `scalar` &rarr; `scalars`,
   `enum` &rarr; `enums`).

1. **Move field plans into nested `plans: {...}` object**. For each type defined
   in the new `objects` and `inputObjects` objects: create a `plans: { ... }`
   entry inside the type and move all fields (anything not prefixed with `__`)
   inside this new (nested) property.

1. **Move enum values into nested `values: {...}` object**. For each type
   defined in the new `enums` object: create a `values: { ... }` entry inside
   the type and move all values (anything not prefixed with `__`) inside this
   new (nested) property.

1. **Remove `__` prefixes**. For each type across
   `objects`/`interfaces`/`unions`/`interfaceObjects`/`scalars` and `enums`:
   remove the `__` prefix from any methods/properties.

Example:

```diff
 typeDefs: ...,
-plans: {
+objects: {
   User: {
-    __isTypeOf(v) {
+    isTypeOf(v) {
       return v.username != null;
     },
    plans: {
       fieldName($source, fieldArgs) {
         // ...
       },
+    },
   },
+},
+interfaces: {,
   MyInterface: {
-    __resolveType($specifier) {
+    resolveType($specifier) {
       // ...
     }
   }
+},
+enums: {
   MyEnum: {
     ONE
     TWO
     THREE
   }
 },
```

_(Aside: I pasted the
[markdown version](https://github.com/graphile/graphile.github.io/blob/6693b91d5dd9980b676876524d0a14d370800dcf/src/news/2025-06-06-last-epic-solved.md#L78-L150)
of these instructions into ChatGPT and it managed to convert a number of plugins
perfectly! YMMV.)_

Other changes:

- `ObjectPlans`/`GrafastPlans`/`FieldPlans`/`InputObjectPlans`/`ScalarPlans` all
  changed to singular
- `InterfaceOrUnionPlans` split to `InterfacePlan`/`UnionPlan` (identical
  currently)
- Shape of `ObjectPlan`/`InterfacePlan`/`UnionPlan` has changed;
  `DeprecatedObjectPlan`/etc exist for back-compatibility
- `FieldArgs` can now accept an input shape indicating the args and their types
- `FieldPlanResolver<TArgs, TParentStep, TResultStep>` has switched the order of
  the first two generic parameters:
  `FieldPlanResolver<TParentStep, TArgs, TResultStep>` — this is to reflect the
  order of the arguments to the function. Also null has been removed from the
  generics.
- Various generics (including `GrafastFieldConfig`) that used to take a GraphQL
  type instance as a generic parameter no longer do — you need to use external
  code generation because TypeScript cannot handle the dynamic creation.
- `GrafastFieldConfig` last two generics swapped order.
- `GrafastArgumentConfig` generics completely changed

### Gra*fast* Features

#### New Steps

- Coalesce: Accepts a number of steps and represents the first one of them that
  isn’t nullish

#### Step Classes

- Experimental support for adding “references” to other steps at plan-time only
  (via `refId = this.addRef($step)` and reciprocal `$step = this.getRef(refId)`
  methods). Useful for optimization; but use with great caution. Currently
  undocumented due to experimental nature.

#### Grafserv

Add `@whatwg-node/server` HTTP adaptor, thanks to @kzlar 🎉

### Improved type-safety

- `each()` now reflects the type of the list item even if it’s not a “list
  capable” step
- `loadOne()`/`loadMany()` can now track the underlying nullability of the
  callback

🚨 This will potentially break your plan types quite a bit. In particular, the
`LoadOneCallback` and `LoadManyCallback` types now have 5 (not 4) generic
parameters, the new one is inserted in the middle (after the second parameter)
and indicates the true return type of the callback (ignoring promises) — e.g.
`Maybe<ReadonlyArray<Maybe<ItemType>>>` for `LoadManyCallback`. They have
sensible defaults if you only specify the first two generics.

### Other breaking changes

- Minimum version of Node.js bumped to Node 22 (the latest LTS).
- Grafserv: Naked GraphQL errors (such as those you’d see from coercion) are now
  treated as safe to output.
- graphile-export now supports and possibly requires ESLint v9.

### Bug fixes

- Gra*fast*: Fix bug in deduplication that only compared flags on first
  dependency.
- Gra*fast*: Fix a number of edge-case issues relating to incremental delivery
- PostGraphile: Fix bug in nullable nodeID handling for computed column
  arguments with the Relay preset that was causing the entire select to be
  inhibited on null/undefined.
- PostGraphile: Fix bug with `@ref ... plural` smart tag where multiple
  `@refVia` are present but the target type is not abstract.

### And here’s the rest...

- Gra*fast*: plan JSON now has layer plans as a list rather than a tree, to
  account for combination layer plans that have many parents.
- Gra*fast*: Implement deduplication of loadOne() / loadMany() and jsonParse()
  steps
- Gra*fast*: Planning field inputs now uses a cache so planning time should
  reduce marginally and step ids will be less inflated.
- Gra*fast:* Don’t call `applyPlan` on arguments if the value is not specified
  (not even a variable) and there’s no default value.
- Gra*fast*: Fixes bug where undefined values might not be flagged with
  FLAG_NULL
- PostGraphile: General plan efficiency improvements
- Ruru: Upgrade to Mermaid 11, and reduce verbosity of polymorphism in plan
  diagrams.
- Ruru: Removes a lot of cruft from plan diagrams by hiding certain over-used
  global dependencies.
- Grafserv: Add `ctx.ws?.normalizedConnectionParams` which can be treated as
  headers (i.e. has lower-cased keys).
- @dataplan/pg: `pgSelectFromRecord` no longer requires a mutable array
- Graphile Export: graphile-export now uses ES2022 syntax for ESLint check on
  exported schema, fixing compatibility with `@graphile/pg-aggregates`.
- Graphile Export: Fix detection of SQL when `pg-sql2` isn’t available at
  runtime, and improve misleading error around class instances
- pg-sql2: `util.inspect(someSql)` will now output a much nicer string

### Thank you Sponsors

Gra*fast* and PostGraphile are crowd-funded open-source software, they rely on
crowd-sourced funding from individuals and companies to keep advancing.

If your company benefits from Gra*fast*, PostGraphile or the wider Graphile
suite, you should consider asking them to fund our work. By significantly
reducing the amount of work needed to achieve business goals and reducing
running costs, Graphile’s software results in huge time and money savings for
users. We encourage companies to contribute a portion of these savings back,
enabling the projects to advance more rapidly, and result in even greater
savings for your company.
[Find out more about sponsorship here on our website](/sponsor/).

<div class="flex flex-wrap justify-around">
<img alt="Cartoon Benjie and Jem send cartoon hearts up into the sky" src="/images/news/postgraphile-thankyou.svg" style="max-height: 300px" />
</div>
