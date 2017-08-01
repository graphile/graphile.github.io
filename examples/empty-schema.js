const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

buildSchema(defaultPlugins).then(schema => {
  console.log(printSchema(schema));
});
// ES2017: const schema = await buildSchema(defaultPlugins);
