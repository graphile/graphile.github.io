---
layout: page
path: /postgraphile/usage-cli/
title: PostGraphile CLI
---

## Command Line Interface

The easiest way to get up and running with PostGraphile is to use the Command Line Interface.

Install PostGraphile globally via npm:

```bash
npm install -g postgraphile
```

This will make the `postgraphile` command available. You can then run:

```
postgraphile -c postgres://localhost/mydb -s public -a -j
```

where `-c` is the connection string (defaults to postgres://localhost/), `-s` is the schema name (defaults to "public"), `-a` enables Relay support and `-j` enables dynamic JSON.

### CLI options

There are more CLI options available to customise the GraphQL server:

<!-- CLI_DOCBLOCK_BEGIN -->

* `-h`, `--help`  
  output usage information
* `-V`, `--version`  
  output the version number
* `--plugins <string>`  
  a list of postgraphile plugins (not Graphile-Build plugins) to load, MUST be the first option
* `-c`, `--connection <string>`  
  the Postgres connection. if not provided it will be inferred from your environment, example: postgres://user:password@domain:port/db
* `-s`, `--schema <string>`  
  a Postgres schema to be introspected. Use commas to define multiple schemas
* `-w`, `--watch`  
  watches the Postgres schema for changes and reruns introspection if a change was detected
* `-n`, `--host <string>`  
  the hostname to be used. Defaults to `localhost`
* `-p`, `--port <number>`  
  the port to be used. Defaults to 5000
* `-m`, `--max-pool-size <number>`  
  the maximum number of clients to keep in the Postgres pool. defaults to 10
* `-r`, `--default-role <string>`  
  the default Postgres role to use when a request is made. supercedes the role used to connect to the database
* `-j`, `--dynamic-json`  
  enable dynamic JSON in GraphQL inputs and outputs. uses stringified JSON by default
* `-N`, `--no-setof-functions-contain-nulls`  
  if none of your `RETURNS SETOF compound_type` functions mix NULLs with the results then you may enable this to reduce the nullables in the GraphQL schema
* `-a`, `--classic-ids`  
  use classic global id field name. required to support Relay 1
* `-M`, `--disable-default-mutations`  
  disable default mutations, mutation will only be possible through Postgres functions
* `--show-error-stack`  
  show JavaScript error stacks in the GraphQL result errors
* `--extended-errors <string>`  
  a comma separated list of extended Postgres error fields to display in the GraphQL result. Example: 'hint,detail,errcode'. Default: none
* `--append-plugins <string>`  
  a comma-separated list of plugins to append to the list of GraphQL schema plugins
* `--prepend-plugins <string>`  
  a comma-separated list of plugins to prepend to the list of GraphQL schema plugins
* `--read-cache <path>`  
  [experimental] reads cached values from local cache file to improve startup time (you may want to do this in production)
* `--write-cache <path>`  
  [experimental] writes computed values to local cache file so startup can be faster (do this during the build phase)
* `--export-schema-json <path>`  
  enables exporting the detected schema, in JSON format, to the given location. The directories must exist already, if the file exists it will be overwritten.
* `--export-schema-graphql <path>`  
  enables exporting the detected schema, in GraphQL schema format, to the given location. The directories must exist already, if the file exists it will be overwritten.
* `-X`, `--no-server`  
  [experimental] for when you just want to use --write-cache or --export-schema-* and not actually run a server (e.g. CI)
* `-q`, `--graphql <path>`  
  the route to mount the GraphQL server on. defaults to `/graphql`
* `-i`, `--graphiql <path>`  
  the route to mount the GraphiQL interface on. defaults to `/graphiql`
* `-b`, `--disable-graphiql`  
  disables the GraphiQL interface. overrides the GraphiQL route option
* `-o`, `--cors`  
  enable generous CORS settings. this is disabled by default, if possible use a proxy instead
* `-l`, `--body-size-limit <string>`  
  set the maximum size of JSON bodies that can be parsed (default 100kB) The size can be given as a human-readable string, such as '200kB' or '5MB' (case insensitive).
* `--cluster-workers <count>`  
  [experimental] spawn <count> workers to increase throughput
* `--enable-query-batching`  
  [experimental] enable the server to process multiple GraphQL queries in one request
* `-e`, `--jwt-secret <string>`  
  the secret to be used when creating and verifying JWTs. if none is provided auth will be disabled
* `--jwt-verify-algorithms <string>`  
  a comma separated list of the names of the allowed jwt token algorithms
* `-A`, `--jwt-verify-audience <string>`  
  a comma separated list of audiences your jwt token can contain. If no audience is given the audience defaults to `postgraphile`
* `--jwt-verify-clock-tolerance <number>`  
  number of seconds to tolerate when checking the nbf and exp claims, to deal with small clock differences among different servers
* `--jwt-verify-id <string>`  
  the name of the allowed jwt token id
* `--jwt-verify-ignore-expiration`  
  if `true` do not validate the expiration of the token defaults to `false`
* `--jwt-verify-ignore-not-before`  
  if `true` do not validate the notBefore of the token defaults to `false`
* `--jwt-verify-issuer <string>`  
  a comma separated list of the names of the allowed jwt token issuer
* `--jwt-verify-subject <string>`  
  the name of the allowed jwt token subject
* `--jwt-role <string>`  
  a comma seperated list of strings that create a path in the jwt from which to extract the postgres role. if none is provided it will use the key `role` on the root of the jwt.
* `-t`, `--jwt-token-identifier <identifier>`  
  the Postgres identifier for a composite type that will be used to create JWT tokens
* `--token <identifier>`  
  DEPRECATED: use --jwt-token-identifier instead
* `--secret <string>`  
  DEPRECATED: Use jwt-secret instead
* `--jwt-audiences <string>`  
  DEPRECATED Use jwt-verify-audience instead
* `--legacy-relations <omit|deprecated|only>`  
  some one-to-one relations were previously detected as one-to-many - should we export 'only' the old relation shapes, both new and old but mark the old ones as 'deprecated', or 'omit' the old relation shapes entirely
* `--legacy-json-uuid`  
  ONLY use this option if you require the v3 typenames 'Json' and 'Uuid' over 'JSON' and 'UUID'

<!-- CLI_DOCBLOCK_END -->

The following features and not part of PostGraphile core, but are available from the Supporter and/or Pro plugins - see [Go Pro!](/postgraphile/pricing/) for more information.

* `-S`, `--simple-subscriptions`  
  [SUPPORTER] ⚡️[experimental] add simple subscription support
* `--subscription-authorization-function [fn]`  
  [SUPPORTER] ⚡️[experimental] PG function to call to check user is allowed to subscribe
* `--read-only-connection <string>`  
  [PRO] ⚡️[experimental] a PostgreSQL connection string to use for read-only queries (i.e. not mutations)
* `--default-pagination-cap [int]`  
  [PRO] ⚡️[experimental] Ensures all connections have first/last specified and are no large than this value (default: 50), set to -1 to disable; override via smart comment `@paginationCap 50`
* `--graphql-depth-limit [int]`  
  [PRO] ⚡️[experimental] Validates GraphQL queries cannot be deeper than the specified int (default: 16), set to -1 to disable
* `--graphql-cost-limit [int]`  
  [PRO] ⚡️[experimental] Only allows queries with a computed cost below the specified int (default: 1000), set to -1 to disable
