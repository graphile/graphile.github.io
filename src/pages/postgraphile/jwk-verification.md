---
layout: page
path: /postgraphile/jwk-verification/
title: PostGraphile JWT/JWK Verification
---

## PostGraphile JWT/JWK Verification

This guide is meant to illustrate how to intercept and verify a [JWT token](https://auth0.com/docs/jwt) via a [JWK (JSON Web Key)](https://auth0.com/docs/jwks). This guide focuses on Auth0 in particular, however,
it can be adapted for any JWK setup.

## Dependencies

The only dependency is the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) package for verifying your JWT and decoding your JWK fetched from Auth0.

```bash
$ npm install jsonwebtoken
```

## Getting Started

When setting up your postgraphile server, the core setting for verifying your JWT against a JWK is the `pgSettings` property in the `options`.  The `pgSettings`
object, in our case, will represent an asynchronous function that intercepts the incoming web request in order to extract and verify the authorization header against Auth0.

Let's add a simple function to `pgSettings` in order to capture the authorization header.  If no header exists, we'll return false.

```javascript
app.use(
    postgraphile(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_TABLE}`, process.env.DB_SCHEMA, {
        graphiql: true,
        enableCors: true,
        dynamicJson: true,
        pgSettings: (req) => {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return false;
            }

            return true;
        }
    })
);
```

## Check that the token is well formed
Now that we've verified a header exists, we should check that it is well formed.  Visit [this tutorial](https://auth0.com/docs/api-auth/tutorials/verify-access-token) for more information on verifying a JWT.

To start, in case the token is malformed, we'll add a try-catch around our verification process to describe to the client where the verification process went wrong.

```javascript
const jwt = require('jsonwebtoken');
// ...
app.use(
    postgraphile(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_TABLE}`, process.env.DB_SCHEMA, {
        graphiql: true,
        enableCors: true,
        dynamicJson: true,
        pgSettings: (req) => {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    throw new Error('No authorization header provided.');
                }

                const authSplit = authHeader.split(' ');

                if (authSplit.length !== 2) {
                    throw new Error('Malformed authentication header. "Bearer accessToken" syntax expected.');
                } else if (authSplit[0].toLowerCase() !== 'bearer') {
                    throw new Error('"Bearer" keyword missing from front of authorization header.');
                }

                const token = authSplit[1];
                const decodedToken = jwt.decode(token, { complete: true });

                if (decodedToken === null) {
                    throw new Error('Unable to decode JWT, refresh login and try again.');
                }

                return true; // verified
            } catch (e) {
                e.status = 401; // append a generic 401 Unauthorized header status
                throw e;
            }
        }
    })
);
```

## Verify the JWT against the JWK provided from Auth0

After testing the token for malformation, we need to fetch our JWKS provided by Auth0 in order to verify the validity of the JWT.

To do this, I recommend following the [tutorial provided by Auth0](https://auth0.com/blog/navigating-rs256-and-jwks/).

```javascript
const jwt = require('jsonwebtoken');
// ...
app.use(
    postgraphile(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_TABLE}`, process.env.DB_SCHEMA, {
        graphiql: true,
        enableCors: true,
        dynamicJson: true,
        pgSettings: async (req) => {
            try {
                // ...
                const token = authSplit[1];
                const decodedToken = jwt.decode(token, { complete: true });

                if (decodedToken === null) {
                    throw new Error('Unable to decode JWT, refresh login and try again.');
                }

                // follow Auth0 tutorial linked above for this function flow
                const secretKey = await getSecretKey(req, decodedToken.header, decodedToken.payload);

                // once the matching secret key is retrieved from the Auth0 provided JWK, we can verify
                // the token against it
                await jwt.verify(token, secretKey.publicKey, {
                    audience: process.env.AUTH0_AUDIENCE,
                    issuer: `https://${process.env.AUTH0_TENANT}.auth0.com/`,
                    algorithms: ['RS256']
                }, function (err, verifiedToken) {
                    if (err) {
                        throw new Error(err);
                    }
                });

                return true; // verified
            } catch (e) {
                e.status = 401; // append a generic 401 Unauthorized header status
                throw e;
            }
        }
    })
);
```

Assuming you have properly set up the fetch for your secret key, your graphql endpoint should now be secured.

_This article was originally written by [Travis O'Neal](https://github.com/wtravO)._