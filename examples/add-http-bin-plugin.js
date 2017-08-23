const fetch = require("node-fetch");

function AddHttpBinPlugin(builder, { pgExtendedTypes }) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, { extend, getTypeByName }, { scope: { isRootQuery } }) => {
      if (!isRootQuery) {
        return fields;
      }
      const JSONType = getTypeByName("JSON");
      return extend(fields, {
        httpBinHeaders: {
          type: JSONType,
          async resolve() {
            const response = await fetch("https://httpbin.org/headers");
            if (pgExtendedTypes) {
              return response.json();
            } else {
              return response.text();
            }
          },
        },
      });
    }
  );
}

module.exports = AddHttpBinPlugin;

if (require.main === module) {
  /* eslint-disable no-inner-declarations */
  const { buildSchema, defaultPlugins, NodePlugin } = require("graphile-build");
  const { graphql, Kind } = require("graphql");
  const { printSchema } = require("graphql/utilities");

  function JSONPlugin(builder) {
    builder.hook("init", (_, { addType, graphql: { GraphQLScalarType } }) => {
      const stringType = (name, description) =>
        new GraphQLScalarType({
          name,
          description,
          serialize: value => String(value),
          parseValue: value => String(value),
          parseLiteral: ast => {
            if (ast.kind !== Kind.STRING) {
              throw new Error("Can only parse string values");
            }
            return ast.value;
          },
        });

      const SimpleJSON = stringType(
        "JSON",
        "A JavaScript object encoded in the JSON format as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf)."
      );

      addType(SimpleJSON);

      return _;
    });
  }

  async function main() {
    const schema = await buildSchema([
      ...defaultPlugins.filter(plugin => plugin !== NodePlugin),
      JSONPlugin,
      AddHttpBinPlugin,
    ]);
    console.log(printSchema(schema));
    const result = await graphql(
      schema,
      `
      query {
        httpBinHeaders
      }
    `
    );
    console.dir(result.data.httpBinHeaders);
  }

  main();
}
