---
layout: page
path: /postgraphile/make-change-nullability-plugin/
title: makeWrapResolversPlugin
---

## makeChangeNullabilityPlugin

**NOTE: this documentation applies to PostGraphile v4.1.0+**

Use this plugin to change the nullability of an entity. 

For more information about nullability in PostGraphile in general, see the FAQ question ["Why is it nullable?"](/why-nullable/)

### Example

You can combine this plugin with the use of `makeWrapResolversPlugin` so that only the current user can see their own email address:

```
// 1: make User.email nullable:
makeChangeNullabilityPlugin({
  User: {
    email: true,
  },
}),
// 2: return null unless the user id matches the current logged in user_id
makeWrapResolversPlugin({
  User: {
    email: {
      requires: {
        siblingColumns: [{ column: "id", alias: "$user_id" }],
      },
      resolve(resolver, user, args, context, _resolveInfo) {
        if (context.jwtClaims.user_id !== user.$user_id) return null;
        return resolver();
      },
    },
  },
}),
```