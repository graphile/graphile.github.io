/**
 * Simply renames the `UserPatch` and `PostPatch` type names to be called
 * `UserChangeSet` and `PostChangeSet` instead.
 *
 * Not particularly useful, just an example.
 *
 * Replaces this inflector:
 * https://github.com/graphile/graphile-engine/blob/f3fb3878692c6959e481e517375da66503428dc5/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L309-L311
 */
const { makeAddInflectorsPlugin } = require("graphile-utils");

module.exports = makeAddInflectorsPlugin({
  patchType(typeName) {
    // return this.upperCamelCase(`${typeName}-patch`);
    return this.upperCamelCase(`${typeName}-change-set`);
  },
});
