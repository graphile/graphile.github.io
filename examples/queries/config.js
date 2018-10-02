const fs = require("fs");

exports.fileFilter = f => f.match(/^[^.].*\.graphql$/);
exports.processFile = async (
  queryFilePath,
  { pgPool, postgraphileSchema, prettify, graphql, withPostGraphileContext }
) => {
  const query = fs.readFileSync(queryFilePath, "utf8");
  const { data, errors } = await withPostGraphileContext(
    {
      pgPool,
      pgSettings: {
        role: "graphiledemo_visitor",
        "jwt.claims.user_id": 1,
      },
    },
    context => graphql(postgraphileSchema, query, null, context)
  );
  if (errors && errors.length) {
    throw new Error(
      `Errors occurred whilst processing ${queryFilePath}!\n` + String(errors)
    );
  }
  const prettyQuery = await prettify(queryFilePath, query);
  const prettyData = await prettify(
    queryFilePath + ".json",
    JSON.stringify(data)
  );
  return {
    example: prettyQuery,
    exampleLanguage: "graphql",
    result: prettyData,
    resultLanguage: "json",
  };
};
