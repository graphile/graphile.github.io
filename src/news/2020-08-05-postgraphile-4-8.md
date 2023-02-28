---
layout: post
title: "PostGraphile Releases Version 4.8 - Excellent Enums"
date: 2020-08-05T01:00:00Z
path: /news/20200805-postgraphile-48/
thumbnail: /images/news/postgraphile-developer.svg
thumbnailAlt: "A developer sat at a desk with a computer monitor and laptop"
tags: announcements, releases, postgraphile
noToc: true

summary:
  "Graphile is pleased to announce the release of PostGraphile version 4.8.0, an
  upgrade recommended for all PostGraphile users, which introduces support for
  enum tables and geometric types."
---

_Announced 2020-08-05 by the Graphile Team_

<p class='intro'>
Graphile is pleased to announce the release of PostGraphile version 4.8.0, an upgrade recommended for all PostGraphile users, which introduces support for enum tables and geometric types.
</p>

### Enum Tables

PostGraphile now supports "enum tables"; we have previously recommended against
using PostgreSQL enums if the enums are ever likely to change after creation.
This is because PostgreSQL enums cannot be added to within a transaction, and
cannot ever have a value removed.

Instead, we recommend creating a table where the enum value is the primary key,
and use foreign key constraints to reference this value.

This functionality is now written inside of PostGraphile. This means you may
need to revisit your database permissions if you wish to use this functionality
⁠— don't worry, it only queries the table if it sees the `@enum` smart comment.

An enum table must have a text (or varchar / char) primary key, and may have
other columns. It must be done through using an `@enum` smart comment (and not a
smart tag file or plugin) due to the way in which PostGraphile v4's
introspection engine works. See
[our documentation](/postgraphile/enums/#with-enum-tables) for more information,
or the detailed
[technical release notes](https://github.com/graphile/postgraphile/releases/tag/v4.8.0).

<div class="flex flex-wrap justify-around">
<img alt="A developer sat at a desk with a computer monitor and laptop" src="/images/news/postgraphile-developer.svg" style="max-height: 300px" />
</div>

### All new features

-     Add support for "enum tables" ([GitHub link](https://github.com/graphile/graphile-engine/issues/635))
-     Add support for geometric types ([GitHub link](https://github.com/graphile/graphile-engine/issues/637))
-     Warn early if placeholders will be exhausted ([GitHub link](https://github.com/graphile/graphile-engine/issues/632))
-     `@pgSubscription` directive now supports initial events ([GitHub link](https://github.com/graphile/graphile-engine/issues/612)), thank you to _@enisdenjo_

Further details and full list of fixes in the
[technical release notes](https://github.com/graphile/postgraphile/releases/tag/v4.8.0).

<div class="tc">
<img alt="Thank you" src="/images/thanks.png" />
</div>

### The Graphile suite of tools

PostGraphile is just one in a suite of Graphile developer tools.
[Graphile Worker](https://github.com/graphile/worker) is a job queue for
Postgres running on Node, and
[Graphile Migrate](https://github.com/graphile/migrate) is an opinionated,
SQL-powered, productive roll-forward migration tool for Postgres. In true
Graphile style, these tools are simple, familiar, fully functional and fast.
Worker, in particular, pairs beautifully with PostGraphile projects, and is
currently downloaded over 15k times per week! Together, these projects can give
you the building blocks you need to make powerful and performant software
quickly and efficiently.

Graphile Starter is a "batteries included" off-the-shelf starter project
marrying these tools together with a design system, user and session management
and so much more; ready for you to take as a jumping-off point for your own
project. You can see our entire suite of projects [at our homepage](/).

### Thank you Sponsors!

Dear Sponsors: we love you! Thank you so much for continuing to support us
during these difficult pandemic times, the progress of the Graphile projects ⁠—
and of course the development of Version 5 ⁠— would not be possible without your
support ❤️

**PostGraphile Development:** work on Version 5 is underway, for more details
see the `#dev-postgraphile` channel on our Discord: https://discord.gg/graphile

<div class="flex flex-wrap justify-around">
<img alt="Cartoon Benjie and Jem send cartoon hearts up into the sky" src="/images/news/postgraphile-thankyou.svg" style="max-height: 300px" />
</div>

### Full release notes

Full detailed technical release notes can be found on GitHub:

- [v4.4.8 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.8.0)
- [v4.4.7 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.7.0)
- [v4.4.6 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.6.0)
- [v4.4.5 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.5.0)
