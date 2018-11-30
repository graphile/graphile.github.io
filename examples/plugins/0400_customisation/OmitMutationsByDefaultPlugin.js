/**
 * This plugin treats any table that doesn't have an `@omit` comment as if it
 * had `@omit create,update,delete` (thereby disabling mutations).
 *
 * Override it by adding a smart comment to the table. To restore all
 * mutations, do `COMMENT ON my_table IS E'@omit :';` (the `:` is special
 * syntax for "nothing").
 */
module.exports = function OmitMutationsByDefaultPlugin(builder) {
  builder.hook("build", build => {
    const { pgIntrospectionResultsByKind } = build;
    pgIntrospectionResultsByKind.class
      .filter(table => table.isSelectable && table.namespace)
      .forEach(table => {
        if (!("omit" in table.tags)) {
          table.tags.omit = "create,update,delete";
        }
      });
    return build;
  });
};

// Tested via:
// npx postgraphile --append-plugins @graphile-contrib/pg-simplify-inflector,`pwd`/examples/plugins/0400_customisation/OmitMutationsByDefaultPlugin.js -c graphile_org_demo -s app_public
