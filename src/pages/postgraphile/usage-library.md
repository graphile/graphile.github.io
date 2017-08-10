---
layout: page
path: /postgraphile/usage-library/
title: PostGraphile as a Library
---
## Using PostGraphile as a Library

Some people may want to use PostGraphile as a dependency of their current
Node.js projects instead of as a CLI tool. If this is the approach you want to
take then you may either use PostGraphile as an HTTP middleware, or create and
execute queries against a PostGraphile schema using your own custom code. In
this article we will go the former, for the latter see [Schema-only
Usage](/postgraphile/usage-schema/).

### HTTP Middleware

To mount a PostGraphile instance on your own web server there is an export
`postgraphile` from the `postgraphile` package that can be used as HTTP
middleware for the following HTTP frameworks:

- [`connect`](http://npmjs.com/connect)
- [`express`](https://www.npmjs.com/package/express)
- [Vanilla `http`](https://nodejs.org/api/http.html)

_We also have alpha-quality support for [`koa`
2.0](https://www.npmjs.com/package/koa), if you notice any problems please raise a GitHub issue about it._

To use PostGraphile with `express`, for instance, just do the following:

```js
const express = require('express');
const { postgraphile } = require('postgraphile');

const app = express();

app.use(
  postgraphile(process.env.DATABASE_URL || 'postgres://localhost/')
);

app.listen(process.env.PORT || 3000);
```

Or to use it with the built-in `http` module:

```js
const http = require('http');
const { postgraphile } = require('postgraphile');

http.createServer(
  postgraphile(process.env.DATABASE_URL || 'postgres://localhost/')
).listen(process.env.PORT || 3000)
```

#### API: `postgraphile(pgConfig, schemaName, options)`

The `postgraphile` middleware factory function takes three arguments, all of which are optional.

- **`pgConfig`**: An object or string that will be passed to the [`pg`][] library and used to connect to a PostgreSQL backend, OR a pg.Pool to use.
- **`schemaName`**: A string, or array of strings, which specifies the PostgreSQL schema(s) you to expose via PostGraphile; defaults to 'public'
- **`options`**: An object containing other miscellaneous options. Options include:
  - `classicIds`: Enables classic ids for Relay support. Instead of using the field name `nodeId` for globally unique ids, PostGraphile will instead use the field name `id` for its globally unique ids. This means that table `id` columns will also get renamed to `rowId`.
  - `dynamicJson`: Setting this to `true` enables dynamic JSON which will allow you to use any JSON as input and get any arbitrary JSON as output. By default JSON types are just a JSON string.
  - `disableDefaultMutations`: Setting this to `true` will prevent the creation of the default mutation types & fields. Database mutation will only be possible through Postgres functions.
  - `graphiql`: Set this to `true` to enable the GraphiQL interface.
  - `graphqlRoute`: The endpoint the GraphQL executer will listen on. Defaults to `/graphql`.
  - `graphiqlRoute`: The endpoint the GraphiQL query interface will listen on (**NOTE:** GraphiQL will not be enabled unless the `graphiql` option is set to `true`). Defaults to `/graphiql`.
  - `pgDefaultRole`: The default Postgres role to use. If no role was provided in a provided JWT token, this role will be used.
  - `jwtSecret`: The secret for your JSON web tokens. This will be used to verify tokens in the `Authorization` header, and signing JWT tokens you return in procedures.
  - `jwtAudiences`: The audiences to use when verifing the JWT token. If not set the audience will be `['postgraphile']`.
  - `jwtRole`: A comma separated list of strings that give a path in the jwt from which to extract the postgres role. If none is provided it will use the key `role` on the root of the jwt.
  - `jwtPgTypeIdentifier`: The Postgres type identifier for the compound type which will be signed as a JWT token if ever found as the return type of a procedure. Can be of the form: `my_schema.my_type`. You may use quotes as needed: `"my-special-schema".my_type`.
  - `watchPg`: When true, PostGraphile will watch your database schemas and re-create the GraphQL API whenever your schema changes, notifying you as it does. This feature requires an event trigger to be added to the database by a superuser. When enabled PostGraphile will try to add this trigger, if you did not connect as a superuser you will get a warning and the trigger won’t be added.
  - `showErrorStack`: Enables adding a `stack` field to the error response.  Can be either the boolean `true` (which results in a single stack string) or the string `json` (which causes the stack to become an array with elements for each line of the stack).
  - `extendedErrors`: Extends the error response with additional details from the Postgres error.  Can be any combination of `['hint', 'detail', 'errcode']`.  Default is `[]`.
  - `disableQueryLog`: Turns off GraphQL query logging. By default PostGraphile will log every GraphQL query it processes along with some other information. Set this to `true` to disable that feature.
  - `enableCors`: Enables some generous CORS settings for the GraphQL endpoint. There are some costs associated when enabling this, if at all possible try to put your API behind a reverse proxy.
  - `exportJsonSchemaPath`: Enables saving the detected schema, in JSON format, to the given location. The directories must exist already, if the file exists it will be overwritten.
  - `exportGqlSchemaPath`: Enables saving the detected schema, in GraphQL schema format, to the given location. The directories must exist already, if the file exists it will be overwritten.
  - `bodySizeLimit`: Set the maximum size of JSON bodies that can be parsed (default 100kB). The size can be given as a human-readable string, such as '200kB' or '5MB' (case insensitive).

[connect]: https://www.npmjs.com/connect
[express]: https://www.npmjs.com/express
[graphql/express-graphql#82]: https://github.com/graphql/express-graphql/pull/82
[`pg`]: https://www.npmjs.com/pg
[morgan]: https://www.npmjs.com/morgan

