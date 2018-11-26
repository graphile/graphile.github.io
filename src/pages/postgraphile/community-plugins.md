---
layout: page
path: /postgraphile/community-plugins/
title: PostGraphile community plugins
---

## PostGraphile community plugins

Community members can write plugins for PostGraphile that extends its
functionality; this page lists some of them. Issues with these plugins should
be directed to the plugin authors, not to this project. This page is maintained
by the community and is not an endorsement by the project.

If you have written a PostGraphile plugin (or have found one that is not listed
here), then please feel free to add it, you can [edit this page in GitHub](https://github.com/graphile/graphile.github.io/edit/develop/src/pages/postgraphile/community-plugins.md).

See the [CLI](/postgraphile/usage-cli/) or
[library](/postgraphile/usage-library/) docs for how to load plugins.

Schema extension plugins for PostGraphile:

* [postgraphile-plugin-connection-filter](https://github.com/graphile-contrib/postgraphile-plugin-connection-filter) - adds a `filter:` arg to connections that offers a more powerful alternative to the built in filtering operations
* [postgraphile-plugin-custom-filter](https://github.com/RoadRunnerEngineering/postgraphile-plugin-custom-filter) - adds a `customFilter:` arg to connections that offers user defined filters on any conditions, as long as they can be fit into a `where`
* [postgraphile-plugin-nested-mutations](https://github.com/mlipscombe/postgraphile-plugin-nested-mutations) - enables a single mutation to create/update many related records
* [graphile-upsert-plugin](https://github.com/einarjegorov/graphile-upsert-plugin/blob/master/index.js) - adds upsert mutations
* [@graphile-contrib/pg-simplify-inflector](https://github.com/graphile-contrib/pg-simplify-inflector) - simplifies field names by automatically removing `ByFooIdAndBarId`-style suffixes.
* [@graphile-contrib/pg-many-to-many](https://github.com/graphile-contrib/pg-many-to-many) - adds connection fields for many-to-many relations.
* [@graphile-contrib/pg-order-by-related](https://github.com/graphile-contrib/pg-order-by-related) - enables ordering by related table columns.
* [postgraphile-plugin-derived-field](https://github.com/mattbretl/postgraphile-plugin-derived-field) - provides an interface for adding derived fields
* [postgraphile-plugin-upload-field](https://github.com/mattbretl/postgraphile-plugin-upload-field) - enables file uploads (see `postgraphile-upload-example` below)
* [event-phile](https://github.com/stlbucket/event-phile) - "capture designated function calls as re-playable events"
* [postgraphile-plugin-connection-multi-tenant](https://github.com/deden/postgraphile-plugin-connection-multi-tenant) - "Filtering Connections in PostGraphile by Tenants"
* [graphile-build-postgis](https://github.com/singingwolfboy/graphile-build-postgis) - PostGIS support (WIP)
* [postgraphile-pm2-status](https://github.com/stlbucket/phile-starter/blob/master/api/src/graphile-extensions/pm2Status.js) - expose pm2 process status thru a query
* [PassportLoginPlugin](https://github.com/graphile/examples/blob/master/shared/plugins/PassportLoginPlugin.js) - example plugin to add a username/password `login` and `register` mutations using Passport.js

Examples of using these plugins:

* [postgraphile-upload-example](https://github.com/mattbretl/postgraphile-upload-example) - demonstrates how to add file upload support to PostGraphile using the GraphQL Multipart Request Spec.

These extensions extend PostGraphile in different ways:

* [hapi-postgraphile](https://github.com/mshick/hapi-postgraphile) - add PostGraphile to your HAPI application
