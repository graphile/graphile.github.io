/**
 * Simply renames the `allUsers` and `allPosts` Query fields to `users` and
 * `posts` respectively.
 *
 * Not particularly useful, just an example.
 *
 * Replaces this inflector:
 * https://github.com/graphile/graphile-engine/blob/f3fb3878692c6959e481e517375da66503428dc5/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L460-L464
 */
module.exports = function PgShortenAllRowsInflectorPlugin(builder) {
  builder.hook("inflection", inflector => ({
    // Retain the existing inflectors
    ...inflector,

    // Override the allRows inflector
    allRows(table) {
      return this.camelCase(
        // Was: `all-${this.pluralize(this._singularizedTableName(table))}`
        // Now:
        this.pluralize(this._singularizedTableName(table))
      );
    },
  }));
};
