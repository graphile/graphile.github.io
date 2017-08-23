const omit = require("lodash/omit");

function removeFieldPluginGenerator(objectName, fieldName) {
  const fn = function(builder) {
    builder.hook("GraphQLObjectType:fields", (fields, _, { Self }) => {
      if (Self.name !== objectName) {
        return fields;
      }
      return omit(fields, [fieldName]);
    });
  };
  fn.displayName = `RemoveFieldPlugin:${objectName}.${fieldName}`;
  return fn;
}

const RemoveFooDotBarPlugin = removeFieldPluginGenerator("Foo", "bar");

module.exports = RemoveFooDotBarPlugin;

if (require.main === module) {
  /* eslint-disable no-inner-declarations */
  const { buildSchema, defaultPlugins, NodePlugin } = require("graphile-build");
  const { printSchema } = require("graphql/utilities");

  function FooPlugin(builder) {
    builder.hook(
      "GraphQLObjectType:fields",
      (
        fields,
        { extend, graphql: { GraphQLObjectType, GraphQLString }, newWithHooks },
        { scope: { isRootQuery } }
      ) => {
        if (!isRootQuery) {
          return fields;
        }
        const Foo = newWithHooks(
          GraphQLObjectType,
          {
            name: "Foo",
            fields: {
              bar: {
                type: GraphQLString,
              },
              baz: {
                type: GraphQLString,
              },
            },
          },
          { isFoo: true }
        );
        return extend(fields, {
          getFoo: {
            type: Foo,
            resolve() {
              return {
                bar: "BAR",
                baz: "BAZ",
              };
            },
          },
        });
      }
    );
  }

  async function main() {
    const schema = await buildSchema([
      ...defaultPlugins.filter(plugin => plugin !== NodePlugin),
      FooPlugin,
      RemoveFooDotBarPlugin,
    ]);
    console.log(printSchema(schema));
  }

  main();
}
