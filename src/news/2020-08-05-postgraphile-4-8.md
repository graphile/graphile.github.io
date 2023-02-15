---
layout: post
title: PostGraphile Releases Version 4.8 - Excellent Enums
date: 2020-08-05T01:00:00Z
path: /news/20200805-postgraphile-48/
tags: announcements, releases, postgraphile
---

Announcements

Dear Sponsors: we love you! Thanks so much for continuing to support us during
these difficult times, the progress below, across the other Graphile projects,
and of course toward V5 would not be possible without your support ❤️

PostGraphile Development: work on version 5 is underway, for more details see
#dev-postgraphile channel on our Discord: https://discord.gg/graphile

pgRITA: if you've ever thought "I'd love to have the Graphile maintainer
checking over my database schema design," then we're extremely excited to share
our news with you! We've built a service (using Graphile Starter 💪 ) that will
analyze your database design against a list of rules we've compiled over the
last few years of consultancy and support, explains any detected issues, and in
many cases provides tailored SQL fixes to inspire your next migration. Income
from this service will help fund Graphile's OSS endeavours, and what's more, it
has a free plan with some essential rules that pair beautifully with
PostGraphile. Sign up today, no credit card necessary: https://pgrita.com/

Other projects: in case you've not previously heard of Graphile Starter,
Graphile Worker or Graphile Migrate you should check them out. Worker in
particular pairs beautifully with PostGraphile projects, and is currently
downloaded over 15k times per week! Features Enum Tables

PostGraphile now supports "enum tables"; for years I've recommended against
using PostgreSQL enums iff the enums are ever likely to change after creation,
specifically because PostgreSQL enums cannot be added to within a transaction,
and cannot ever have a value removed. Instead, I recommend creating a table
where the enum value is the primary key, and using foreign key constraints to
reference this value. I've now written this functionality up inside of
PostGraphile (this is the first thing in introspection that queries actual user
tables rather than just the system catalog, so you may need to revisit your
database permissions if you wish to use this functionality - don't worry, it
only queries the table if it sees the @enum smart comment).

An enum table must have a text (or varchar or char) primary key, and may have
other columns. It must have the @enum smart comment, and this must be done via a
smart comment (and not a smart tag file or plugin) due to the way in which
PostGraphile v4's introspection engine works.

Example:

All new features

    Add support for "enum tables" (engine #635) (e6bde66)
    Add support for geometric types (engine #637) (419ec87)
    Warn early if placeholders will be exhausted (engine #632) (5c22e41)
    @pgSubscription directive now supports initial events (engine #612, @enisdenjo) (e862aad)

Fixes

    Fixed an issue where --watch would stop working if an error occurred and --retry-on-init-fail was specified (engine #624) (4ef1b7b)
    Fixed an issue where a single (i.e. unique) "backwards" relationship was not watched via live queries (engine #625) (7f0225e)
    Fixed a regression with queryCacheMaxSize due to our new LRU implementation (#1312, @zacherkkila)
    Type fixes for addPgTableOrderByPlugin (engine #629, @hansololai) (91dbf6f)
    Fixed an error message typo (001de88)
    Added tslib to all the TypeScript packages
    Fix issue where jwtSignOptions went undocumented and omitted from the TypeScript types (#1324)
