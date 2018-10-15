---
layout: page
path: /postgraphile/versioning-policy/
title: Versioning Policy
---

## What is PostGraphile's versioning policy?

TL;DR: breaking changes to the GraphQL schema require a major version update.
Breaking changes to the plugin interface would typically require a major
version update, but in rare cases may be included in a minor version update.

PostGraphile (without third party plugins) follows semver: `major.minor.patch`.
Small fixes go into a patch, nice new features go into a minor release, and
breaking changes would require a major release.

PostGraphile wants to help you make maintainable GraphQL APIs, as such any
change that will break your existing GraphQL schema (e.g. by making something
nullable that wasn't previously, or removing a field) would be a breaking
change and require a major version update (e.g. 4.0.0 -> 5.0.0). To work around
this, we will often add command-line flags (or library options) to opt into new
functionality before it is enabled by default. An example of this is
`--no-ignore-rbac`, which you should probably be using!

The new plugin interface introduced in PostGraphile v4.0.0 is not as mature as
the generated GraphQL schema. Due to this, plugins are seen as more
"experimental" and breaking changes to the plugin interfaces may in certain
exceptional situations be included in a minor version update (e.g. 4.0.0 -> 4.1.0).
This will change in a later major release of PostGraphile, once the plugin
interface is more stable. Despite this, breaking changes to the plugin
interface are seen as a major issue and will be avoided as much as possible.
Interfaces that are documented on the Graphile website will not be broken
without a **very good reason**.
