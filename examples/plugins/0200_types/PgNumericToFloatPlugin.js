/**
 * Use of this plugin is NOT recommended, please see
 * PgSmallNumericToFloatPlugin for a more appropriate replacement if you need
 * one.
 *
 * This plugin will have PostGraphile use `GraphQLFloat` instead of `BigFloat`
 * for *all* DECIMAL / NUMERIC values, for making PostGraphile v4 slightly more
 * backwards-compatible with v3.
 *
 * It's generally a bad idea to use floating point numbers to represent
 * arbitrary precision numbers such as NUMERIC because loss of precision can
 * occur.
 */
module.exports = function PgNumericToFloatPlugin(builder) {
  builder.hook("build", build => {
    // Register a type handler for NUMERIC / DECIMAL (oid = 1700), always
    // returning the GraphQLFloat type
    build.pgRegisterGqlTypeByTypeId("1700", () => build.graphql.GraphQLFloat);
    return build;
  });
};
