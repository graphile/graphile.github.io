---
layout: page
path: /postgraphile/live-queries/
title: Live Queries
---

## Live Queries

<p class='intro'>
Live queries let you monitor an entire query for changes, automatically
sending you an updated version whenever any of the previously returned
data changes.
</p>

_This feature requires PostGraphile v4.4.0 or higher._

To enable live queries support in PostGraphile, you will need:

- to pass `--live` (or `live: true`)
- to provide a plugin that can inform PostGraphile of realtime changes

### Realtime provider plugins

You may track changes to your database data in many ways, for example
using database triggers and LISTEN/NOTIFY, using logical decoding, or
even by streaming from an external source such as Kafka.

Currently we have one first-party realtime provider plugin, `@graphile/subscriptions-lds`:

#### @graphile/subscriptions-lds

This plugin uses the Logical Decoding features of PostgreSQL to get a stream
of data changes very efficiently from the database (using its replication
interface). When a change occurs, if any of the live queries would be
affected by it, they're informed of the change and PostGraphile re-runs
the query and sends the results to the client - this ensures that database
permissions are always respected, and that no caching issues occur.

To enable this plugin, you must alter your PostgreSQL configuration `postgresql.conf`
and ensure that the following settings are enabled:

```
wal_level = logical
max_wal_senders = 10
max_replication_slots = 10
```

You must also install the `wal2json` extension into PostgreSQL if you don't
already have it (normally takes under 10 seconds):

```
git clone https://github.com/eulerto/wal2json.git
cd wal2json
USE_PGXS=1 make
USE_PGXS=1 make install
```

Now PostgreSQL is ready, you can enable live queries support in PostGraphile.
First, install the plugin:

```
yarn add @graphile/subscriptions-lds
```

Because of the power the replication interface gives, it's necessary to use
a superuser or database owner account, so in addition to your normal connection
string you must also pass an "owner" connection string which has elevated
privileges. (If you're not using RLS/etc and normally use PostGraphile with
a superuser/database owner account then this is unnecessary.)

On the CLI:

```
postgraphile \
  --connection postgres://postgraphile_user:postgraphile_pass@host/db \
  --live \
  --owner-connection postgres://db_owner:db_owner_pass@host/db \
  --append-plugins @graphile/subscriptions-lds \
  ...
```

Via the library:

```js
app.use(
  postgraphile(process.env.AUTH_DATABASE_URL, SCHEMA, {
    // ...

    // Enable live support in PostGraphile
    live: true,
    // We need elevated privileges for logical decoding
    ownerConnectionString: process.env.ROOT_DATABASE_URL,
    // Add this plugin
    appendPlugins: [
      //...
      require("@graphile/subscriptions-lds").default,
    ],
  })
);
```

More detailed instructions are available in the [@graphile/subscriptions-lds
README](https://www.npmjs.com/package/@graphile/subscriptions-lds).

### Limitations

Note that each live provider plugin has its own limitations, and may not be
able to detect all changes. For example `@graphile/subscriptions-lds` can
detect changes to results queried from tables, but cannot currently detect
changes to results queried from views and functions. In particular, computed
columns are not kept up to date (although they are re-calculated whenever a
table update triggers the subscription).

### Performance

Live queries are a lot more expensive than regular subscriptions - the server
must monitor a lot more sources to detect a change (monitoring each
individual record returned, plus monitoring for additions/removals from any
collection including filtering constraints), and changes will most likely be
more frequent as they're coming from multiple sources. Use live queries with
care - it's wise to keep the queries as small as possible since they must be
recalculated any time anything within the query results changes.
