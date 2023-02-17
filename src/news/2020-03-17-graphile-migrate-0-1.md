---
layout: post
title: Graphile Migrate 0.1 Released
date: 2020-03-17T01:00:00Z
path: /news/20200317-migrate-01/
thumbnail: /images/news/graphile-migrate.svg
thumbnailAlt: "Cartoon people release red arrows up into the sky"
tags: announcements, releases, migrate
noToc: true

summary:
  "Graphile Migrate 0.1 is a big milestone for the project, with it finally
  leaving 0.0.x territory - That's right, it's no longer 'Highly' experimental!
  This release is a significant jump from the previous versions and includes
  many new commands, more configuration options, and a suite of new features."
---

_Announced 2020-03-17_

<p class='intro'>
The Graphile team are pleased to announce that Graphile Migrate 0.1 is out in pre-release. This is a big milestone for the project, with it finally leaving 0.0.x territory and leaving behind the word "highly" in the phrase "highly experimental"! This release is a significant jump from the previous versions and includes many new commands, more configuration options, as well as a suite of new features.
</p>

Graphile Migrate is an opinionated, SQL-powered, productive roll-forward
migration tool for Postgres. In true Graphile style, it is simple, familiar,
fully functional and fast: Save a file and the database is updated in
milliseconds. There's no custom DSL to learn, just use Postgres syntax. Graphile
Migrate pairs well with [PostGraphile](/postgraphile/) and the wider Graphile
suite of tools. You can find it
[on GitHub](https://github.com/graphile/migrate/).

<div class="flex flex-wrap justify-around">
<img alt="Cartoon people release red arrows up into the sky" src="/images/news/graphile-migrate.svg" style="max-height: 300px" />
</div>

### Migrate 0.1 features

There are many new features and a 🚨 breaking change in Migrate 0.1. Make sure
you read the full release notes and the new and improved Readme of the project
[on GitHub](https://github.com/graphile/migrate/).

- New commands:
  - init to set up a new environment
  - compile to compile an SQL file (filling out placeholders) and output the
    result
  - run to compile and run an SQL file
  - completion to install CLI autocompletion
- More configuration options are exposed
- Support for the current migration to be a directory
- Support for naming commits
- Ability to run `afterRest` SQL actions as a superuser
- Add ability to run `graphile-migrate status` without requiring a database
  connection
- Stronger linting, stronger types and lots of other housekeeping
- 🚨 potential checksum breaking change

The full, technical details can be found in the
[release notes in the project repo.](https://github.com/graphile/migrate/releases/tag/v0.1.0)

### Thank you Graphile Sponsors and contributors!

We extend our gratitude to everyone who has filed issues and pull requests
against Graphile Migrate, contributors and user feedback are invaluable to open
source projects and help to push the software to be the best possible version of
itself it can be. Can you believe that there are currently no open issues or
pull requests in this project? We don't expect that to last long!

This freedom to innovate and make our tooling available for free would not be
possible without our sponsors. The GitHub Sponsor program has been key in
enabling us to spend paid time on our open source work. If you appreciate what
we do, encourage your company to sponsor us to help us keep dedicating time and
resources to our open source developer tooling. There's more information on
[our sponsor page](https://graphile.org/sponsor).

<div class="flex flex-wrap justify-around">
<img alt="Graphile thanks the community" src="/images/thanks.png" />
</div>
