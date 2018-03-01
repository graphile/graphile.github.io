---
layout: page
path: /graphile-build-pg/security/
title: Security
---

## Security

Traditionally in web application architectures the security is implemented in
the server layer and the database is treated as a simple store of data - people
tend to figure that this reduces the workload on the database and thus
increases scalability. As their application grows, they start needing other
services to interact with the database too - which can mean that they need to
duplicate the authentication/authorization logic in multiple places which can
lead to discrepancies and increases the surface area for potential issues.

Instead, we advise that you protect your lowest level - the data itself. By
doing so you can be sure that no matter how many services interact with your
database they will all be protected by the same underlying permissions logic
which you only need to maintain in one place.

PostgreSQL already had a powerful permissions system built in with it's roles
and grants; but in PostgreSQL 9.5 Row Level Security policies were introduced.
These allow your application to be considerably more specific about permissions,
moving from table- and column-based permissions to row-level permissions.

When enabled, all rows are by default not visible to any roles (except database
administration roles and the role who created the database/table); and
permission is selectively granted with the use of policies.

If you already have a secure database schema that implements these technologies
to protect your data at the lowest levels then you can leverage
`postgraphile` to generate a powerful, secure and fast API in minimal
time. All you need to do is pass a pre-authenticated pgClient to the `graphql`
resolve function.

### Example

```js{21,28-29,35-37,42}
const { createPostGraphileSchema } = require('postgraphile');
const pg = require('pg');

const pgPool = new pg.Pool(process.env.DATABASE_URL);

async function runQuery(query, variables) {
  const schema = await createPostGraphileSchema(
    process.env.DATABASE_URL,
    ['users_schema', 'posts_schema'],
    {
      dynamicJson: true,
      pgJwtSecret: process.env.JWT_SECRET,
      pgJwtTypeIdentifier: 'users_schema.jwt_type',
    }
  );

  // Fetch a postgres client from the pool
  const pgClient = await pgPool.connect();

  // Start a transaction so we can apply settings local to the transaction
  await pgClient.query("begin");

  try {
    // The following statement is equivalent to (but faster than):
    //    await pgClient.query("set local role to 'postgraphile_user'");
    //    await pgClient.query("set local jwt.claims.user_id to '27'");
    await pgClient.query(`select
      set_config('role', 'postgraphile_user', true),
      set_config('jwt.claims.user_id', '27', true)
    `);
    return await graphql(
      schema,
      query,
      null,
      /* CONTEXT > */ {
        pgClient: pgClient,
      }, /* < CONTEXT */
      variables
    );
  } finally {
    // commit the transaction (or rollback if there was an error) to clear the local settings
    await pgClient.query("commit");

    // Release the pgClient back to the pool.
    await pgClient.release();
  }
}

runQuery(
  "query MyQuery { allPosts { nodes { id, title, author: userByAuthorId { username } } } }"
).then(result => {
  console.dir(result);
  pgPool.release();
}).catch(e => {
  console.error(e);
  process.exit(1);
});
```

TODO: ensure this example works.

To see how this works in a real application, check out
[`withPostGraphileContext` in
PostGraphile](https://github.com/graphile/postgraphile/blob/master/src/postgraphile/withPostGraphileContext.ts)
