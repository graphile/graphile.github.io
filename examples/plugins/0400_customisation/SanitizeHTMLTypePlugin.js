// Author: Benjie Gillam
// License: https://benjie.mit-license.org/
//
// This is a documentation example, you will need to edit it to make it useful.
// Instructions on running this plugin are at the bottom.

// This function is the one that would perform sanitisation (writing actual
// sanitisation is left as an exercise to the reader)
function sanitize(html) {
  return html.toUpperCase();
}

// Export our plugin function (it can be async if you want)
module.exports = /* async */ function SanitizeHTMLTypePlugin(builder) {
  // Builder is an instance of SchemaBuilder:
  //
  //   https://www.graphile.org/graphile-build/schema-builder/

  //////////////////////////////////////////////////////////////////////////////

  // Here we're hooking the init event; this event occurs after the `build`
  // object is finalised, but before we start building our schema - it's the
  // perfect time to hook up additional types.
  //
  // 'init' is an a-typical hook in that the first argument is meaningless (but
  // you should still return it at the end of the hook).
  //
  // Note all hooks in graphile-build must be synchronous; any async work must be done above here.
  builder.hook("init", (_, build) => {
    // The `build` object is an instance of Build: https://www.graphile.org/graphile-build/build-object/
    // graphile-build-pg adds a bunch of additional helpers to this object:
    const {
      pgIntrospectionResultsByKind, // From PgIntrospectionPlugin
      pgRegisterGqlTypeByTypeId, // From PgTypesPlugin
      pgRegisterGqlInputTypeByTypeId, // From PgTypesPlugin
      pg2GqlMapper, // From PgTypesPlugin
      pgSql: sql, // From PgBasicsPlugin, this is equivalent to `require('pg-sql2')` but avoids multiple-module conflicts
      graphql, // Equivalent to `require('graphql')` but avoids multiple-module conflicts
    } = build;
    const { GraphQLString } = graphql;

    // First we find the type that we care about. In this case we've done
    //
    //   CREATE DOMAIN html AS text;
    // or
    //   CREATE DOMAIN public.html AS text;
    //
    // so we are looking for the 'html' type in the 'public' schema (namespace).
    const htmlDomain = pgIntrospectionResultsByKind.type.find(
      type => type.name === "html" && type.namespaceName === "public"
    );

    // If this type exists, then...
    if (htmlDomain) {
      // Register the *output* type for this type, we just want to use the `String` type
      pgRegisterGqlTypeByTypeId(htmlDomain.id, () => GraphQLString);

      // Register the *input* type for this type, again we'll use `String`
      pgRegisterGqlInputTypeByTypeId(htmlDomain.id, () => GraphQLString);

      // The pg2GqlMapper is responsible for translating things from PostgreSQL
      // into GraphQL and back again.
      pg2GqlMapper[htmlDomain.id] = {
        // From Postgres to GraphQL: we simply take the string from postgres
        // and sanitise it and return the resulting string to GraphQL.
        map: value => sanitize(value),

        // From GraphQL to SQL: we must construct an SQL fragment that can be
        // interpolated into larger SQL queries (e.g. as the argument to a
        // function or the input value for a CREATE/UPDATE mutation). Graphile
        // uses the pg-sql2 module for this purpose, you can find the docs
        // here:
        //
        //   https://github.com/graphile/pg-sql2/blob/master/README.md
        //
        // We're going to take the value (string) the client gave us, stick it
        // through the sanitise function, then pass it into SQL using
        // `sql.value` to avoid SQL injection and being sure to cast it to our
        // HTML type. Note that if you miss the `sql.value(...)` pg-sql2 will
        // throw an error, so you don't have to worry about accidental SQL
        // injection - just never use `sql.raw`!
        unmap: value =>
          sql.fragment`(${sql.value(sanitize(value))}::public.html)`,
      };
    }

    // All hooks in graphile-build must return something; normally it's an
    // augmented form of the thing that was passed as the first argument. We
    // don't manipuate _ at all so we can simply return it.
    return _;
  });
};

/*

You can test this plugin by saving it to a file 'plugin.js', then executing the
following:

  # Create a database to test against
  createdb sanitise-html
  # Seed the database with our domain, table and some data
  psql -1X sanitise-html <<SQL
    CREATE DOMAIN html AS text;
    CREATE TABLE a (id SERIAL PRIMARY KEY, t TEXT, h HTML);
    INSERT INTO a (t, h) VALUES ('AaAaAa', 'BbBbBb');
  SQL
  # Run PostGraphile
  postgraphile --append-plugins `pwd`/plugin.js -c postgres:///sanitise-html


Here's a GraphQL query for selecting the data:

  {
    allAs {
      nodes {
        id
        t
        h
      }
    }
  }

And one for updating the data:

  mutation {
    updateAById(
      input: {
        id: 1
        aPatch: {
          t: "tttt_TTTT_tttt"
          h: "hhhh_HHHH_hhhh"
        }
      }
    ) {
      a {
        id
        t
        h
      }
    }
  }

*/

// Tested via:
// npx postgraphile --append-plugins @graphile-contrib/pg-simplify-inflector,`pwd`/examples/plugins/0400_customisation/SanitizeHTMLTypePlugin.js -c graphile_org_demo -s app_public
