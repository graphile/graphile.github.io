---
layout: page
path: /news/postgraphile-version-4-1/
title: PostGraphile Releases Version 4.1 - Better Webpackability!
date: 2018-12-06T00:00:01.000Z
thumbnail: /images/undraw_developer_activity.png
thumbnailAlt:
  "A developer working at a laptop, the GitHub contribution graph is projected
  behind him"
noToc: true

summary:
  "Building upon the huge performance gains found in Version 4, the release of
  Version 4.1 has a huge improvement to startup performance in serverless
  environments. This update also brings a large number of enhancements including
  much broader PostgreSQL function support, an enhanced GraphiQL interface, and
  a lot more helpers for writing plugins."
---

### The original GraphQL API for PostgreSQL: now with improved Lambda support

_Announced 2018-12-06_

Building upon the huge performance gains found in Version 4, Benjie Gillam is
pleased to announce the release of Version 4.1 of PostGraphile, now with a huge
improvement to startup performance in serverless environments. This update also
brings a large number of enhancements including much broader PostgreSQL function
support, an enhanced GraphiQL interface, and a lot more helpers for writing
plugins.

[See the entire release notes on GitHub](https://github.com/graphile/postgraphile/releases/tag/v4.1.0).

### Better webpackability

Thanks to funding from [Connecting Good](https://cogo.co/), PostGraphile Version
4.1 enhances startup performance for webpack and serverless/Amazon Lambda users:

- Bundle size is around 10 times smaller
- Unzip time is up to 140 times faster
- Cold start time is now under half a second

This has been achieved through targeted work optimising PostGraphile’s
"webpackability" - how well it could be processed by the popular webpack tool.
Previously, many features of PostGraphile could not be included in webpack's
output, resulting in >4000 files to be zipped up and sent to Lambda. Now a
PostGraphile application can be reduced to just 2 files, leading to a smaller
zip file and a faster startup time.

**Do you use PostGraphile in serverless environments?** If so, make sure to
update to Version 4.1 and [let us know](https://discord.gg/graphile) about your
performance gains.

### Big contributions from the Graphile community

<div class="flex flex-wrap justify-around">
<img alt="PostGraphile thanks our contributors" src="/images/undraw_developer_activity.png" />
</div>

Version 4.1 also includes a big update from frequent contributor
[@mattbretl](https://github.com/mattbretl), who has introduced support for a
wider range of PostgreSQL functions. This reduces the constraints developers
have to work within, freeing them to use the right PostgreSQL function type for
the task, leading to even faster development times.

### Help us to help you!

PostGraphile is crowd-funded open-source software, it relies on crowd-sourced
funding from individuals and companies to keep advancing.

By significantly reducing the amount of work needed to achieve business goals,
PostGraphile results in huge savings for users. Your organization should
contribute some of these savings back so everyone can benefit from more frequent
releases with better performance, better compatibility, better documentation,
easier customization, and more features - leading to even greater savings or
profits for your organization.

Huge thanks to the 60 individuals and companies already sponsoring PostGraphile!

<strong>[Click here to sponsor PostGraphile development now.](/sponsor/)</strong>

<div class="flex flex-wrap justify-around">
<img alt="PostGraphile thanks the community" src="/images/thanks.png" />
</div>
