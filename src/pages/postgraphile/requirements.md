---
layout: page
path: /postgraphile/requirements/
title: PostGraphile Requirements
---

## Requirements

PostGraphile is a Node.js module, you can install it with either `npm` or
`yarn` depending on your preference. We recommend using the latest stable
version of Node.js (version 8 at time of writing) and PostgreSQL (version 9.6
at time of writing), but we have limited support for older versions.

### Node.js

PostGraphile requires Node v4 or above; but if you use v8 or above you'll get a
speed boost thanks to native support for async/await and other ES2017 features.


### PostgreSQL

PostGraphile is tested on PostgreSQL 9.4 and 9.5; and is developed against the
latest stable version of PostgreSQL (9.6 at the time of writing). However, you
should be aware that not all features are supported on every PostgreSQL
version.

#### PostgreSQL 9.4

Basic operation including introspection.

#### PostgreSQL 9.5

Introduces Row-Level Security - important for securing your schema.

#### PostgreSQL 9.6

Introduces the `missing_ok` parameter to the `current_setting(name, missing_ok)`
function - without this you'll need to ensure all `current_setting(name)` calls
reference settings that always exist (e.g. you may need to set them on the
database itself).

`--watch` is also only officially supported on 9.6+ (although it might work on
9.5?)

#### PostgreSQL 10

PostgreSQL 10 solves a number of performance issues - the most interesting of
which for us is a significant performance boost to Row Level Security policies!

### Operating system

PostGraphile is developed on Mac OS X and tested on GNU/Linux; we would like to
support Windows but no-one in the core team uses Windows so we need your help
for this.
