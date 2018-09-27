---
layout: page
path: /postgraphile/node-id/
title: nodeId / id / Globally Unique Object Identification
---

## Global Unique Object Identifier "nodeId"

We implement the [Relay Global Object Identification
Specification](https://facebook.github.io/relay/graphql/objectidentification.htm),
so any table that has a primary key will automatically have a unique `nodeId`
field available for queries and mutations. This is commonly used as the cache
key for your client library, e.g. with Apollo Client's `dataIdFromObject`:

```js{6}
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.nodeId || null
});

export const client = new ApolloClient({
  link: new HttpLink(),
  cache
});
```


**WARNING**: by default, we call the Global Object Identifier `nodeId` to
avoid clashing with the `id` field that's common practice in database design.
If you wish to call the Global Object Identifier field `id` instead (as is
mandated by the Relay specification), you can do so with our `--classic-ids`
CLI flag. In doing so, any `id` column will automatically be renamed to
`rowId`.
