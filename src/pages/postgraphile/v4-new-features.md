---
layout: page
path: /postgraphile/v4-new-features/
title: v4 Feature Guide
---

## v4 Feature Guide

Though the entry point to v4 is almost identical to v3 (with a few additional
options!), the guts of PostGraphile have been re-written from the ground up -
about 80% of the codebase has been replaced with smaller dependencies in the
form of our new plugin-base schema generator.

You can read more about migrating from v3 to v4 in our migration guide (link at
bottom).

#### Performance: goodbye N+1 queries!

**NOTE**: performance of super simple queries in v4 has improved even further
since these figures were detailed!

The performance of PostGraphile has massively increased over PostGraphQL v3;
and the memory usage has decreased too! If you run your database and
PostGraphile on different servers then you should find query times are improved
even further by the (significant!) reduction in the number of SQL queries that
we generate.

I created an [example database
schema](https://github.com/graphile/postgraphile_changes/blob/master/db/reset.sh)
based on the forum example (but with some bells and whistles), filled it with
some data, and then benchmarked a [number of queries](https://github.com/graphile/postgraphile_changes/tree/master/graphql)
against it (running everything locally on my machine (a 2011 iMac), using the
latest LTS release of Node.js for both v3 and v4).

The most extreme improvements came in the form of
[ThreadViewWithEmoji.graphql](https://github.com/graphile/postgraphile_changes/blob/master/graphql/ThreadViewWithEmoji.graphql).
This is a query that emulates loading the data to show a single thread page
within a complex forum - the thread itself (and its author), plus the first 20
posts within that thread, their authors, and the first 100 emoji responses that
each of the posts have received. It uses a computed column for the user
`fullName`s, but other than that it's just regular relations.

* concurrency: 1
  * v3: 644ms average latency, 1.51 req/s (peaking at 416MB RAM)
  * v4: 58ms average latency, 17.0 req/s (peaking at 98MB RAM)
  * Summary: 1030% more requests/second, 76% reduction in RAM usage, and less than 1/10th the latency
* concurrency: 10
  * v3: 5477ms average latency, 1.77 req/s (peaking at 694MB RAM)
  * v4: 341ms average latency, 29.55 req/s (peaking at 98MB RAM)
  * Summary: 1570% more requests/second, 85.9% reduction in RAM usage, and nearly 1/20th the latency
* concurrency: 100
  * v3: 63999ms average latency, 1.56 req/s (peaking at 1.5GB RAM)
  * v4: 2805ms average latency, 35.2 req/s (peaking at 114MB RAM)
  * Summary: 2160% more requests/second, 92.5% reduction in RAM usage, and less than 1/20th the latency

Simpler queries still reveal good performance improvements. One such example is
[ProfileView.graphql](https://github.com/graphile/postgraphile_changes/blob/master/graphql/ProfileView.graphql)
which emulates loading the data to show a single forum user's profile - their
personal details, the latest post they've written (and the thread it's in) and
a total count of all posts they've written. At a concurrency level of 1, v4
achieves 195 req/s vs v3's 118 req/s (both execute with sub-10ms latency). At
concurrency 100 v4 achieves a whopping 407 req/s with average latency sub-250ms
(v3 achieves a pretty good 232 req/s at ~430ms average latency).

I think this shows that PostGraphile v4 is capable of scaling better than v3
when queries are complex and that's without spending any time actually
optimising the generated SQL queries yet - I think we'll be able to improve
performance quite a bit further still.

#### Plugins plugins plugins

The GraphQL schema that PostGraphile generates (and even the introspection it
performs on the database!) is now constructed out of a number of
`graphile-build` plugins. `graphile-build` was invented for PostGraphile
(though it is also suitable for use in other GraphQL projects) to enable easy
extensibility of the core system. This means we can now have community led
experiments such as
[postgraphile-plugin-connection-filter](https://github.com/mattbretl/postgraphile-plugin-connection-filter)
(which adds a much more powerful filter engine to PostGraphile that the built in
`condition` argument) without having to fork core. These plugins can be
maintained separately, and might be merged into core at a later point.

It's also possible to turn off, or even replace, built in plugins - and of
course to add your own. So you can really customise PostGraphile now!

Be warned though, writing a plugin is a fair undertaking right now - it's going
to take a while for the right interfaces and helpers to appear, so right now
you're wrestling with the raw API which can be pretty gnarly!

#### Order! Order!

Connections now support ordering by an array of columns rather than just one -
a much requested feature!

#### Column-level SELECT grants may now work

As part of the performance work, we now select only the fields we need (and we also inline computed columns, in case you're interested!). As such, if you have column-level SELECT grants you may find that this works with PostGraphile now. Note, however, that I do not recommend using these - instead I recommend splitting your concerns into multiple tables and use the one-to-one relationship feature to link them.

#### Simple collections

PostGraphile has long supported Relay-compatible connections, but it now
supports simple list-based collections too. They're disabled by default, but
you can enable both interfaces with `--simple-collections both` or use the
simpler interface exclusively with `--simple-collections only`.

#### One-to-one relationships

If you have tables like this:

```sql
create table foo (
  id serial primary key
);

create table bar (
  foo_id int not null primary key references foo,
  name text
);
```

in V3 the one-to-one nature of the relationship was not accounted for, so you would have to query like:

```graphql
{
  fooById(id: 1) {
    # Due to this being one-to-one, at most one row would ever be returned,
    # however we didn't account for this and returned a connection anyway
    barsByFooId {
      edges {
        node {
          name
        }
      }
    }
  }
}
```

with v4's native support for these relations you can now use this much neater query:

```graphql
{
  fooById(id: 1) {
    barByFooId {
      name
    }
  }
}
```

No more unnecessary indirection!

Don't worry though, we still have the old relation too, we've just deprecated it.

#### Cache invalidation (Serverless)

People have been running PostGraphile on AWS Lambda and similar environments, and one of the common issues that I hear is that boot up time is too slow. V4 addresses this in two ways:

1.  we offer the `--read-cache` and `--write-cache` options that allow plugins (including the introspection plugin!) to cache work that they do up front - note that we do _not_ handle invalidating this cache, so that remains your responsibility.
2.  by changing the minimum requirements of PostGraphile to Node.js 8.6 we can make use of native async/await support, resulting in much less code for Node to parse and execute.

If you want to improve things even further, you should consider bundling your server dependencies into one JS file with something like `webpack` so that Node spends less time looking at the filesystem!

#### Omitting things

If there's something (a column, table, function, filter, relation) that you
don't want to express to GraphQL you can now remove it using our [smart
comments](/postgraphile/smart-comments/) feature. This feature will likely
be improved over the coming months, so let us know what you think!

#### Naming things

You no longer have to trust us to come up with the best names for your fields.
You can override individual fields using our [smart
comments](/postgraphile/smart-comments/) feature, or override the names that we
auto-generate by using a plugin to overwrite [our
inflector](https://github.com/graphile/graphile-build/blob/8505f3e32f10c4e1297691f288d187517ec97fb9/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L57-L441)
with your own.

#### Better support, better errors

* Many previously invalid enums are now made valid
* When the introspection results in an empty name, an error is thrown explaining why
* Support `point` type
* When a name clashes for some reason, an error is thrown detailing what the field was, and on what type it is.
* When you specify `--schema` and that schema doesn't exist, you will be warned
* Tables that end in `_input` or `_patch` are renamed to FooInputRecord or similar to avoid clashes with mutation types on other tables

#### Deprecation / smart comments

It's now possible to deprecate fields, tables, functions, etc by adding a "smart comment"; e.g.

```sql
comment on column c.person.site is '@deprecated Use `website` instead\nThe user''s homepage';
```

Smart comments (known internally as `tags`) are not well documented yet, and
they currently only support the `deprecated` feature; however we will be adding
more and more smart comments as time passes, they might be used to do things
such as hiding columns from GraphQL, overriding the names of things in GraphQL,
and much more. If you're interested in helping out here (or just making
suggestion!) please [check out the
tests](https://github.com/graphile/graphile-build/blob/master/packages/graphile-build-pg/__tests__/tags.test.js).

And file an issue!

#### pg@7.x and duck-typed pg

In v3 it was quite common to have conflicts with `pg` - where you had your own
version installed, and PostGraphile installed it's own version, and when you
passed a pgPool over to PostGraphile it would throw an error. Well no more! We
now look at the pgPool you've handed us and if it quacks like ~~a duck~~
`pg.Pool` then we'll trust you and treat it as a pg.Pool.

#### Lots of hidden features

There's absolutely loads of things going on under the hood that we've not
officially exposed yet. You can use some of this goodness (e.g.
`pgColumnFilter`) by tapping into the `graphileBuildOptions` setting, but
you'll currently have to go digging to see what they are and how they work; and
until they're documented they're seen as experimental so there's no guarantees
that they won't be removed or modified.
