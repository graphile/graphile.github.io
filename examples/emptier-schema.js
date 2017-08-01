const { buildSchema, defaultPlugins, NodePlugin } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

buildSchema(
  defaultPlugins.filter(plugin => plugin !== NodePlugin)
).then(schema => {
  console.log(printSchema(schema));
});
