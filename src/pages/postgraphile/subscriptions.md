---
layout: page
path: /postgraphile/subscriptions/
title: GraphQL Subscriptions
---

## GraphQL Subscriptions

PostGraphile Core doesn't yet have subscriptions support built in. There is
much talk about what a GraphQL subscriptions solution might look like in
[issue #92](https://github.com/graphile/postgraphile/issues/92).

Patreon backers (and those who have purchased the Pro plugin) may try out an
early simple subscriptions feature via the [Supporter
Plugin](/postgraphile/plugins/). We'd love to hear your feedback on this
implementation. The rest of this article details how to use this feature.

## Simple Subscriptions [SUPPORTER]

### Enabling with the CLI

To enable Simple Subscriptions via the CLI, just load the supporter plugin
and pass the `--simple-subscriptions` flag.

```
postgraphile \
  --plugins @graphile/plugin-supporter \
  --simple-subscriptions \
  -c postgres://mydb
```

### Enabling with an Express app

When using PostGraphile as a library, you may enable Simple Subscriptions by
passing the `pluginHook` with the supporter plugin and using
`simpleSubscriptions: true`.

We emulate part of the Express stack, so if you require sessions you can pass
additional Connect/Express middlewares (sorry, we don't support Koa middlewares
here at this time) via the `websocketMiddlewares` option.

Here's an example:

```js
const express = require("express");
const { postgraphile, makePluginHook } = require("postgraphile");
const {
  default: PostGraphileSupporter,
} = require("@graphile/plugin-supporter");

const pluginHook = makePluginHook([PostGraphileSupporter]);

const postgraphileOptions = {
  pluginHook,
  simpleSubscriptions: true,
  websocketMiddlewares: [
    // Add whatever middlewares you need here, note that they should only
    // manipulate properties on req/res, they must not sent response data. e.g.:
    //
    //   require('express-session')(),
    //   require('passport').initialize(),
    //   require('passport').session(),
  ],
};

const app = express();
app.use(postgraphile(databaseUrl, "app_public", postgraphileOptions));
app.listen(parseInt(process.env.PORT, 10) || 3000);
```


### Using

Simple subscriptions exposes a `listen` field to the `Subscription` type that
can be used for generic subscriptions to a named topic. This topic can be
triggered using PostgreSQL's built in LISTEN/NOTIFY functionality (but
remember to add the prefix - see below).

```graphql
type ListenPayload {
  query: Query
  relatedNode: Node
  relatedNodeId: ID
}

type Subscription {
  listen(topic: String!): ListenPayload!
}
```

Please note that PostGraphile's bundled copy of GraphiQL does not support
subscriptions at this time - you must use an alternative client such as
Altair or GraphQL Playground.

### Topic prefix

All topics requested from GraphQL are automatically prefixed with
`postgraphile:`\* to avoid leaking other topics your application may be using
- GraphQL consumers will not need to know about this, but you will need to
remember to add it to the topic when you perform `NOTIFY` otherwise
subscribers will not see the messages.

\* _Customisable via `pgSubscriptionPrefix` setting._

For example a user may perform the following subscription:

```graphql
subscription {
  listen(topic: "hello") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Foo {
        id
        title
      }
    }
  }
}
```

To cause the subscription to receive a message, you could run the following
in PostgreSQL:

```sql
select pg_notify(
  'postgraphile:hello',
  '{}'
);
```

Resulting in this GraphQL payload:

```json
{
  "data": {
    "listen": {
      "relatedNodeId": null,
      "relatedNode": null
      }
    }
  }
}
```

Which is sufficient to know that the event _occurred_. Chances are that you
want to know more than this...

It's also possible to send a `Node` along with your GraphQL payload using the
`__node__` field on the `pg_notify` body (which is interpreted as JSON). The
`__node__` field is similar to the `nodeId` (or `id` if you use
`--classic-ids`) field in your GraphQL requests, except it's the raw JSON
before it gets stringified and base64 encoded. (The reason for this is that
Postgres' JSON functions leave some optional spaces in, so when they are base64
encoded the strings do not match.)

Assuming that you have a table of the form
`foos(id serial primary key, title text, ...)` you can add the `__node__` field
as follows and the record with id=32 will be made available as the `relatedNode`
in the GraphQL subscription payload:

```sql
select pg_notify(
  'postgraphile:hello',
  json_build_object(
    '__node__', json_build_array('foos', 32)
  )::text
);
```

Resulting in this GraphQL payload:

```json
{
  "data": {
    "listen": {
      "relatedNodeId": "WyJmb29zIiwzMl0=",
      "relatedNode": {
        "nodeId": "WyJmb29zIiwzMl0=",
        "id": 32,
        "title": "Howdy!"
      }
    }
  }
}
```

> **NOTE**: This solution is still taking shape, so it's not yet certain how other fields
> on the NOTIFY message JSON will be exposed via GraphQL. You are advised to
> treat the content of this message JSON as if it's visible to the user, as at
> some point it may be.

> **NOTE**: In PostgreSQL the channel is an "identifier" which by default is
> limited to 63 characters. Subtracting the `postgraphile:` prefix leaves 50
> characters for your topic name.

### Subscription security

By default, any user may subscribe to any topic, whether logged in or not, and
they will remain subscribed until they close the connection themselves. This
can cause a number of security issues; so we give you a method to implement
security around subscriptions.

By specifying `--subscription-authorization-function [fn]` on the PostGraphile CLI (or using the
`subscriptionAuthorizationFunction` option) you can have PostGraphile call the
function you specified to ensure that the user is
allowed to subscribe to the relevant topic. The function must accept one text
argument `topic` and must return a string or raise an exception (note: the `topic`
argument WILL be sent including the `postgraphile:` prefix).

A typical implementation will look like this:

```sql
CREATE FUNCTION
  app_hidden.validate_subscription(topic text)
RETURNS TEXT AS $$
BEGIN
  IF ... THEN
    RETURN ...::text;
  ELSE
    RAISE EXCEPTION 'Subscription denied'
      USING errcode = '.....';
  END IF;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;
```

You must define this function with your custom security logic. To use this
function you'd pass the CLI flag:
`--subscription-authorization-function app_private.validate_subscription`

The text value returned is used to tell the system when to cancel the
subscription - if you don't need this functionality then you may return a
_static_ unique value, e.g. generate a random UUID (manually) and then return
this same UUID over and over from your function, e.g.:

```sql
CREATE FUNCTION app_hidden.validate_subscription(topic text)
RETURNS TEXT AS $$
BEGIN
  IF ... THEN
    RETURN '4A2D27CD-7E67-4585-9AD8-50AF17D98E0B'::text;
  ELSE
    RAISE EXCEPTION 'Subscription denied' USING errcode = '.....';
  END IF;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;
```

When a message is published to the topic identified by the return value of this
function (NOTE: this topic will NOT be prefixed with `postgraphile:` because it
should be private), the associated subscription will automatically be terminated.

### Naming your topics

You might want to make the topic a combination of things, for example the
subject type and identifier - e.g. 'channel:123'. If you do this then your
function could determine which subject the user is attempting to subscribe to,
check the user has access to that subject, and finally return a PostgreSQL
topic that will be published to in the event the user is kicked from the
channel, e.g. `'channel:123:kick:987'` (assuming '987' is the id
of the current user).

### Example walk-through

First, set up a `.postgraphilerc.js` containing the following:

```js
module.exports = {
  options: {
    plugins: ["@graphile/plugin-supporter"],
    connection: "postgres:///subs",
    schema: ["app_public"],
    simpleSubscriptions: true,
  },
};
```

Next, in terminal 1, run:

```
createdb subs || true
postgraphile
```

In terminal 2, connect to the subs DB using `psql subs` and run the following:

```sql
create schema if not exists app_public;
create schema if not exists app_private;

create table if not exists app_public.foo (
 id serial primary key,
 title text not null
);

create or replace function
  app_private.validate_subscription(topic text)
  returns text as
$$
 select 'CANCEL_ALL_SUBSCRIPTIONS'::text;
$$ language sql stable;
```

Then using a GraphQL client that supports subscriptions, such as [GraphQL Playground](https://github.com/graphcool/graphql-playground),
perform the following subscription:

```graphql
subscription {
  listen(topic: "hello") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Foo {
        id
        title
      }
    }
  }
}
```

You are not expecting an immediate result; first you have to trigger the event. To do so, back in your `psql` session in terminal 2, execute:

```sql
insert into app_public.foo (title) values ('Howdy!') returning *;
select pg_notify(
  'postgraphile:hello',
  json_build_object(
    '__node__', json_build_array(
      'foos',
      (select max(id) from app_public.foo)
    )
  )::text
);
```

You should find that the event has been received by the client and the 'Howdy!'
node has come through. You can run the above a few more times, or experiment a
bit by changing the values if you like.

Finally to cancel the subscription, execute the following SQL:

```sql
select pg_notify(
  'CANCEL_ALL_SUBSCRIPTIONS',
  json_build_object()::text
);
```

You should notice that your client is no longer subscribed.

**Bonus**: the SQL commands in this walk-through can be automated with this handy
bash script:

```bash
#!/bin/bash
set -e
createdb subs || true
psql -1X -v ON_ERROR_STOP=1 subs << HERE
create schema if not exists app_public;
create table if not exists app_public.foo (
 id serial primary key,
 title text not null
);
create schema if not exists app_private;
create or replace function app_private.validate_subscription(topic text)
returns text as \$\$
 select 'CANCEL_ALL_SUBSCRIPTIONS'::text;
\$\$ language sql stable;
HERE

sleep 1

psql -1X -v ON_ERROR_STOP=1 subs << HERE
 do \$\$
 declare
   v_foo app_public.foo;
 begin
   insert into app_public.foo (title) values ('Howdy!') returning * into v_foo;
   perform pg_notify(
     'postgraphile:hello',
     json_build_object('__node__', json_build_array('foos', v_foo.id))::text
   );
 end;
 \$\$ language plpgsql;
HERE

sleep 3

psql -1X -v ON_ERROR_STOP=1 subs << HERE
 do \$\$
 declare
   v_foo app_public.foo;
 begin
   insert into app_public.foo (title) values ('Goodbye!') returning * into v_foo;
   perform pg_notify(
     'postgraphile:hello',
     json_build_object('__node__', json_build_array('foos', v_foo.id))::text
   );
   perform pg_notify(
     'CANCEL_ALL_SUBSCRIPTIONS',
     json_build_object()::text
   );
 end;
 \$\$ language plpgsql;
HERE
```

#### Advanced setup

If you need websockets to be listened for before your first HTTP request comes
in (most people don't need this) then you must create a `rawHTTPServer`, mount
your express `app` in it, and then add subscription support to the raw server
via the `enhanceHttpServerWithSubscriptions` function, as shown below:

```js
const { postgraphile, makePluginHook } = require("postgraphile");
const {
  default: PostGraphileSupporter,
  enhanceHttpServerWithSubscriptions,
} = require("@graphile/plugin-supporter");
const { createServer } = require("http");
const express = require("express");

const pluginHook = makePluginHook([PostGraphileSupporter]);

const app = express();
const rawHTTPServer = createServer(app);

const postgraphileOptions = {
  pluginHook,
  simpleSubscriptions: true,
  websocketMiddlewares: [
    // Add whatever middlewares you need here, note that
    // they should only manipulate properties on req/res,
    // they must not sent response data. e.g.:
    //
    //   require('express-session')(),
    //   require('passport').initialize(),
    //   require('passport').session(),
  ],
};

const postgraphileMiddleware = postgraphile(
  databaseUrl,
  "app_public",
  postgraphileOptions
);

app.use(postgraphileMiddleware);

enhanceHttpServerWithSubscriptions(
  rawHTTPServer,
  postgraphileMiddleware,
  postgraphileOptions
);

rawHTTPServer.listen(parseInt(process.env.PORT, 10) || 3000);
```

The `enhanceHttpServerWithSubscriptions` takes three arguments:

1.  the raw HTTP server from `require('http').createServer()`
2.  the postgraphile middleware (this should be the _same_ middleware that you mount into your Express app)
3.  options, where you can optionally pass `middlewares` to enable `pgSettings(req) {...}` access to session-based things