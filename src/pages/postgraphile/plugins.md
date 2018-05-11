---
layout: page
path: /postgraphile/plugins/
title: Plugins
---

## Plugins

In addition to the Graphile-Build plugin system which builds the GraphQL schema
in PostGraphile, PostGraphile also has a plugin system for the CLI and web
layer.  This plugin system is less mature, it's not ready for third party
plugin developers yet, however there are a couple of first-party plugins
that you may want to use that can be purchased on the [Graphile Store](https://store.graphile.com):

- `@graphile/plugin-supporter`
- `@graphile/plugin-pro`

### Installing

You can install first-party plugins with `yarn add` or `npm install` using the
`https://...:...@git.graphile.com/.../postgraphile-supporter.git` URL from
https://store.graphile.com. Remember: **you must keep this URL confidential**.

### Enabling via CLI flag

PostGraphile plugins can be specified with the `--plugins` CLI flag; however
this flag must be the absolute first flag passed to PostGraphile as plugins can
register additional CLI flags. Multiple plugins can be specified with comma
separation:

```
postgraphile --plugins \
  @graphile/plugin-supporter,@graphile/plugin-pro \
  -c postgres://localhost/my_db
```

### Enabling via `.postgraphilerc.js`

If you're using the CLI version, plugins can also be enabled via
`.postgraphilerc.js` file; for example:

```js
module.exports = {
  options: {
    plugins: [
      "@graphile/plugin-supporter",
      "@graphile/plugin-pro",
    ],
    connection: "postgres://localhost/my_db",
    schema: ["app_public"],
    // ...
  },
};
```

### Enabling via middleware options

This will likely get easier in future, but for now enabling via the middleware
is a slightly more involved process:

To include the dependencies, for straight Node.js 8 you want:

```js
const { postgraphile, makePluginHook } =
  require("postgraphile");
const { default: PostGraphileSupporter } =
  require("@graphile/plugin-supporter");
const { default: PostGraphilePro } =
  require("@graphile/plugin-pro");
```

If you're using ES2015 Modules (ESM) then try this:

```js
import { postgraphile, makePluginHook }
  from "postgraphile";
import PostGraphileSupporter
  from "@graphile/plugin-supporter";
import PostGraphilePro
  from "@graphile/plugin-pro";
```

Then you enable the plugins by passing a `pluginHook` via the PostGraphile
options, you can construct this using `makePluginHook` as such:

```js
const pluginHook = makePluginHook([
  PostGraphileSupporter,
  PostGraphilePro,
]);

const postGraphileMiddleware = postgraphile(
  databaseUrl,
  "app_public",
  {
    pluginHook,
    // ...
  }
);

app.use(postGraphileMiddleware);
```
