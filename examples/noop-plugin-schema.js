function NoopPlugin(builder) {
  console.log("I don't do anything");
}

const { buildSchema, defaultPlugins } = require("graphql-build");
const { printSchema } = require("graphql/utilities");

buildSchema([...defaultPlugins, NoopPlugin]).then(schema => {
  console.log(printSchema(schema));
});
