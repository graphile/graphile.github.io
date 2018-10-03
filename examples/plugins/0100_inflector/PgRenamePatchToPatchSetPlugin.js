/**
 * Simply renames the `UserPatch` and `PostPatch` type names to be called
 * `UserPatchSet` and `PostPatchSet` instead.
 *
 * Not particularly useful, just an example. ('PatchSet' chosen to minimise
 * diff to make example clearer.)
 *
 * Replaces this inflector:
 * https://github.com/graphile/graphile-engine/blob/f3fb3878692c6959e481e517375da66503428dc5/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L309-L311
 */
module.exports = function PgRenamePatchToPatchSetPlugin(builder) {
  builder.hook("inflection", inflector => ({
    // Retain the existing inflectors
    ...inflector,

    // Override the patchType inflector
    patchType(typeName) {
      // return this.upperCamelCase(`${typeName}-patch`);
      return this.upperCamelCase(`${typeName}-patch-set`);
    },
  }));
};
