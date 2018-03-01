---
layout: page
path: /postgraphile/requirements/
title: PostGraphile Requirements
---

## Requirements

PostGraphile is packaged as a Node.js module, you can install it with `npm` or
`yarn` (depending on your preference) - we recommend `yarn`.

We recommend using the latest LTS version of Node.js (version 8.9.4 at time of
writing) and PostgreSQL (version 10.2 at time of writing), but we have limited
support for older versions.

### Node.js

From v4 onwards, PostGraphile requires Node.js version 8.6+ which provides
native support for `async`/`await` and supports many of the ES2017 and ES2018
features.

_(If you absolutely must run PostGraphile on a lower version of Node.js then
this is possibly via transpiling the source code via Babel and packaging it up
using something like `webpack` - get in touch if this is something you need)_

### PostgreSQL

For best results we recommend you use the latest stable release of PostgreSQL
(v10.2 at time of writing), however it should run well on 9.6 or higher and
anything that breaks v9.6 support will be deemed a breaking change. The
absolute earliest version it will run well against is v9.4, however we do not
support this version officially - we strongly recommend you upgrade.

#### PostgreSQL 9.4 [not officially supported]

Basic operation including introspection.

#### PostgreSQL 9.5 [not officially supported]

Introduces Row-Level Security - important for securing your schema.

#### PostgreSQL 9.6 [officially supported]

Introduces the `missing_ok` parameter to the `current_setting(name, missing_ok)`
function - without this you'll need to ensure all `current_setting(name)` calls
reference settings that always exist (e.g. you may need to set them on the
database itself).

`--watch` is also only officially supported on 9.6+ (although it might work on
9.5?)

#### PostgreSQL 10

PostgreSQL 10 solves a number of performance issues - the most interesting of
which for us is a significant performance boost to Row Level Security policies!

We don't have support right now for many of the new features in PostgreSQL 10
that are not compatible with PostgreSQL 9.6.

### Operating system

PostGraphile is developed on Mac OS X and tested on GNU/Linux; we would like to
support Windows but no-one in the core team uses Windows so we need your help
for this.
