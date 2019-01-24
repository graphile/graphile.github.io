---
layout: page
path: /postgraphile/jwk-verification/
title: PostGraphile JWT/JWK Verification
---

## PostGraphile JWT/JWK Verification

This guide illustrates how to intercept and verify a [JWT
token](https://auth0.com/docs/jwt) via a [JWK (JSON Web
Key)](https://auth0.com/docs/jwks). It focuses on Auth0, but can be adapted for
any JWK setup. This is only sample code, use at your own risk. We disclaim all
liability.

## Dependencies

The only dependency is the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) package for verifying your JWT and decoding your JWK fetched from Auth0.

```bash
$ yarn add jsonwebtoken
# Or:
$ npm install --save jsonwebtoken
```

## Getting Started

When setting up your PostGraphile server, the core setting for verifying your
JWT against a JWK is the [`pgSettings`
function](/postgraphile/usage-library/#pgsettings-function). The `pgSettings`
function, in our case, will be an asynchronous function that inspects the
incoming web request, extracting and verifying the authorization header against
Auth0.

Let's add a simple function to `pgSettings` in order to capture the authorization header. If there is no header, we will throw an error, aborting the request.

```javascript{3-11}
app.use(
  postgraphile(process.env.DATABASE_URL, process.env.DB_SCHEMA, {
    pgSettings: req => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error("No authorization header provided.");
      }

      /* Read on for handling the header */
      throw new Error("Unimplemented");
    },
  })
);
```

## Check that the token is well formed

Now that we've verified a header exists, we should check that it is well formed. Visit [this tutorial](https://auth0.com/docs/api-auth/tutorials/verify-access-token) for more information on verifying a JWT.

To start, in case the token is malformed, we'll add a try-catch around our verification process to describe to the client where the verification process went wrong.

```javascript{1,6,12-36}
const jwt = require("jsonwebtoken");
// ...
app.use(
  postgraphile(process.env.DATABASE_URL, process.env.DB_SCHEMA, {
    pgSettings: req => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          throw new Error("No authorization header provided.");
        }

        const authSplit = authHeader.split(" ");

        if (authSplit.length !== 2) {
          throw new Error(
            'Malformed authentication header. "Bearer accessToken" syntax expected.'
          );
        } else if (authSplit[0].toLowerCase() !== "bearer") {
          throw new Error(
            '"Bearer" keyword missing from front of authorization header.'
          );
        }

        const token = authSplit[1];
        const decodedToken = jwt.decode(token, { complete: true });

        if (decodedToken === null) {
          throw new Error("Unable to decode JWT, refresh login and try again.");
        }

        /* Not finished yet, read on ... */
        throw new Error("Unimplemented");
      } catch (e) {
        e.status = 401; // append a generic 401 Unauthorized header status
        throw e;
      }
    },
  })
);
```

## Verify the JWT against the JWK provided from Auth0

After testing the token for malformation, we need to fetch our JWKS provided by Auth0 in order to verify the validity of the JWT.

To do this, I recommend following the [tutorial provided by Auth0](https://auth0.com/blog/navigating-rs256-and-jwks/).

```javascript{31-66}
const jwt = require("jsonwebtoken");
// ...
app.use(
  postgraphile(process.env.DATABASE_URL, process.env.DB_SCHEMA, {
    pgSettings: async req => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          throw new Error("No authorization header provided.");
        }

        const authSplit = authHeader.split(" ");

        if (authSplit.length !== 2) {
          throw new Error(
            'Malformed authentication header. "Bearer accessToken" syntax expected.'
          );
        } else if (authSplit[0].toLowerCase() !== "bearer") {
          throw new Error(
            '"Bearer" keyword missing from front of authorization header.'
          );
        }

        const token = authSplit[1];
        const decodedToken = jwt.decode(token, { complete: true });

        if (decodedToken === null) {
          throw new Error("Unable to decode JWT, refresh login and try again.");
        }

        // Follow Auth0 tutorial linked above for this function flow
        // (particularly around `expressJwtSecret`).
        const secretKey = await getSecretKey(
          req,
          decodedToken.header,
          decodedToken.payload
        );

        // Once the matching secret key is retrieved from the Auth0 provided
        // JWK, we can verify the token against it.
        const jwtClaims = await jwt.verify(
          token,
          secretKey.publicKey,
          {
            audience: process.env.AUTH0_AUDIENCE,
            issuer: `https://${process.env.AUTH0_TENANT}.auth0.com/`,
            algorithms: ["RS256"],
          },
          function(err, verifiedToken) {
            if (err) {
              throw new Error(err);
            }
          }
        );

        // You can perform any final verification of the jwtClaims here and
        // throw an error if they're invalid.

        // Finally return the transaction settings to use.
        // See: https://graphile.org/postgraphile/usage-library/#pgsettings-function
        return {
          /* e.g. */
          // 'role': jwtClaims.role,
          // 'jwt.claims.user_id': jwtClaims.user_id,
          // ...
        };
      } catch (e) {
        e.status = 401; // append a generic 401 Unauthorized header status
        throw e;
      }
    },
  })
);
```

And this brings us to the end of the guide. Please file an issue, or send a pull request if you notice any issues on this page!

_This article was originally written by [Travis O'Neal](https://github.com/wtravO)._
