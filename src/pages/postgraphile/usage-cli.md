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

- `-h`, `--help`  
  output usage information
- `-V`, `--version`  
  output the version number
- `-c`, `--connection <string>`  
  the PostgreSQL connection string, if not provided it will be inferred from your environment, example: `postgres://user:password@domain:port/dbname`
- `-s`, `--schema <string>`  
  a PostgreSQL schema to be introspected. Use commas to define multiple schemas
- `-w`, `--watch`  
  watches the PostgreSQL schema for changes and reruns introspection if a change was detected
- `-n`, `--host <string>`  
  the hostname to be used. Defaults to `localhost`
- `-p`, `--port <number>`  
  the port to be used. Defaults to 5000
- `-m`, `--max-pool-size <number>`  
  the maximum number of clients to keep in the PostgreSQL pool. defaults to 10
- `-r`, `--default-role <string>`  
  the default PostgreSQL role to use when a request is made. supercedes the role used to connect to the database
- `-q`, `--graphql <path>`  
  the route to mount the GraphQL server on. defaults to `/graphql`
- `-i`, `--graphiql <path>`  
  the route to mount the GraphiQL interface on. defaults to `/graphiql`
- `-b`, `--disable-graphiql`  
  disables the GraphiQL interface. overrides the GraphiQL route option
- `-t`, `--token <identifier>`  
  the PostgreSQL identifier for a composite type that will be used to create tokens
- `-o`, `--cors`  
  enable generous CORS settings. this is disabled by default, if possible use a proxy instead
- `-a`, `--classic-ids`  
  use classic global id field name; required to support Relay
- `-j`, `--dynamic-json`  
  enable dynamic JSON in GraphQL inputs and outputs (uses stringified JSON by default)
- `-M`, `--disable-default-mutations`  
  disable default mutations, mutation will only be possible through custom PostgreSQL volatile functions
- `-l`, `--body-size-limit <string>`  
  set the maximum size of JSON bodies that can be parsed (default 100kB) The size can be given as a human-readable string, such as '200kB' or '5MB' (case insensitive).
- `-e, --jwt-secret <string>`  
  the secret to be used when creating and verifying JWTs. if none is provided auth will be disabled
- `-A, --jwt-audiences <string>`  
  a comma separated list of audiences your jwt token can contain. If no audience is given the audience defaults to `postgraphql`
- `--jwt-role <string>`  
  a comma separated list of strings that create a path in the jwt from which to extract the postgres role. if none is provided it will use the key `role` on the root of the jwt.
- `--export-schema-json [path]`  
  enables exporting the detected schema, in JSON format, to the given location. The directories must exist already, if the file exists it will be overwritten.
- `--export-schema-graphql [path]`  
  enables exporting the detected schema, in GraphQL schema format, to the given location. The directories must exist already, if the file exists it will be overwritten.
- `--show-error-stack [setting]`  
  show JavaScript error stacks in the GraphQL result errors
- `--extended-errors <string>`  
  a comma separated list of extended PostgreSQL error fields to display in the GraphQL result. Possible fields: `'hint', 'detail', 'errcode'`. Default: none
