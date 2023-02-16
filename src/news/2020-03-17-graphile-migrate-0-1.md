---
layout: post
title: Graphile Migrate 0.1 Released
date: 2020-03-17T01:00:00Z
path: /news/20200317-migrate-01/
thumbnail: /images/news/graphile-migrate.svg
thumbnailAlt: "Cartoon people release red arrows up into the sky"
tags: announcements, releases, migrate
---

<p class='intro'>
Graphile Migrate 0.1 is out in pre-release! That's right - we're no longer in
0.0.x territory! This release has a lot of work in it, so it's quite a
significant bump from the previous release. Make sure you familiarise yourself
with the release notes https://github.com/graphile/migrate/releases/tag/v0.1.0
particularly the breaking changes, and have a read of the fully updated README.
Thanks to everyone who filed issues and PRs against Graphile Migrate and of
course to our sponsors who made this significant undertaking possible! ❤️
Believe it or not, Graphile Migrate now has zero open issues and zero pull
requests! (I don't expect this to last long...)
</p>

v0.1.0 - simply "experimental" 😉

    Status changed from "HIGHLY EXPERIMENTAL" to simply "EXPERIMENTAL" 😉
    Add support for "the current migration" to be a directory if desired (@benjie expanding on PR by @lukaspili)
    Add support for naming commits if desired (@benjie expanding on PR by @pixelpax)
    Add ability to run afterReset SQL actions as superuser
    Add ability to run graphile-migrate status without requiring a database connection
    Wrap migrations with advisory locks incase two servers attempt to migrate at the same time
    Use a proper CLI parser, so extraneous arguments now throw an error
    Add new commands:
        init to set up a new environment
        compile to compile an SQL file (filling out placeholders) and output the result
        run to compile and run an SQL file
        completion to install CLI autocompletion (untested)
    Expose more configuration options:
        migrationsFolder to choose where migrations go
        blankMigrationContent to choose what goes into the current migration when it's created
    Committed migrations are now chmodded to 0440 (world and group read only)
    More consistent header handling (and documentation)
    Documentation
        All commands now self-documenting with --help
        Committed migration file and other SQL files documented in FORMATS.md
        Some of the types now have documentation
        Be more consistent (and explain!) about "root" vs "superuser"
    Lots and lots and lots of housekeeping
        Tests
        Module updates (@singingwolfboy)
        Stronger linting
        Broader linting
        Sorted imports
        Stronger types
