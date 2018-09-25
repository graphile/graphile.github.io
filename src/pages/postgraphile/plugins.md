---
layout: page
path: /postgraphile/plugins/
title: PostGraphile Server Plugins
---

## PostGraphile Server Plugins

_NOTE: This page relates to changing how the PostGraphile server works. If you're instead looking to change the generated GraphQL schema (e.g. to add fields), see [Schema Plugins](/postgraphile/extending/)._

In addition to the [Graphile-Build plugin system](/postgraphile/extending/)
which builds the GraphQL schema in PostGraphile, PostGraphile also has a plugin
system for the CLI and web layer. This plugin system is less mature, it's not
ready for third party plugin developers yet, however there are a couple of
first-party plugins that you may want to use that can be purchased on the
[Graphile Store](https://store.graphile.com):

* `@graphile/plugin-supporter` [SUPPORTER]  
  (pay what you want, from $1/mo+)
* `@graphile/plugin-pro` [PRO]

_TODO: update this when the plugin interface is more mature._

### Wait, I have to pay?

The vast majority of PostGraphile is open source; and there's no intention to
make a previously open-source part of PostGraphile closed source. However,
development on a project like this is time-consuming and complex; these
commercial plugins help to make development on PostGraphile more sustainable by
providing a financial backing for it. You can absolutely run PostGraphile in
production without these features, and many people do (just ask in our [gitter
chat](https://gitter.im/graphile/postgraphile)).

For more information, see the bottom of the [Go Pro!](/postgraphile/pricing/) page.

### Installing

You can install first-party plugins with `yarn add` or `npm install` using the
`git+https://...:...@git.graphile.com/.../postgraphile-supporter.git` URL from
https://store.graphile.com. Remember: **you must keep this URL confidential**.

### Enabling via CLI flag

PostGraphile plugins can be specified with the `--plugins` CLI flag; however
this flag must be the absolute first flag passed to PostGraphile as plugins can
register additional CLI flags. Multiple plugins can be specified with comma
separation:

```
postgraphile --plugins \
  @graphile/plugin-supporter,@graphile/plugin-pro \
  -c postgres:///my_db
```

### Enabling via `.postgraphilerc.js`

If you're using the CLI version, plugins can also be enabled via
`.postgraphilerc.js` file; for example:

```js
module.exports = {
  options: {
    plugins: ["@graphile/plugin-supporter", "@graphile/plugin-pro"],
    connection: "postgres:///my_db",
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
const { postgraphile, makePluginHook } = require("postgraphile");
const {
  default: PostGraphileSupporter,
} = require("@graphile/plugin-supporter");
const { default: PostGraphilePro } = require("@graphile/plugin-pro");
```

If you're using ES2015 Modules (ESM) then try this:

```js
import { postgraphile, makePluginHook } from "postgraphile";
import PostGraphileSupporter from "@graphile/plugin-supporter";
import PostGraphilePro from "@graphile/plugin-pro";
```

Then you enable the plugins by passing a `pluginHook` via the PostGraphile
options, you can construct this using `makePluginHook` as such:

```js
const pluginHook = makePluginHook([PostGraphileSupporter, PostGraphilePro]);

const postGraphileMiddleware = postgraphile(databaseUrl, "app_public", {
  pluginHook,
  // ...
});

app.use(postGraphileMiddleware);
```
