const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

buildSchema(defaultPlugins, { nodeIdFieldName: "flibble" }).then(schema => {
  console.log(printSchema(schema));
});
