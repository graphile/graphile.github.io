const fs = require("fs");
const graphqlDiff = require("../_diff");

exports.fileFilter = f => f.match(/^[^.].*\.sql/);

exports.processFile = async (
  exampleFilePath,
  { pgPool, postgraphileSchema, getPostGraphileSchemaWithOptions }
) => {
  const source = fs.readFileSync(exampleFilePath, "utf8");
  const pgClient = await pgPool.connect();
  await pgClient.query("begin");
  await pgClient.query(
    "set local search_path to app_public, app_private, public;"
  );
  let diff;
  try {
    pgClient.query(source);
    const newSchema = await getPostGraphileSchemaWithOptions({}, pgClient);
    diff = graphqlDiff(postgraphileSchema, newSchema);
  } finally {
    pgClient.query("rollback");
    pgClient.release();
  }

  return {
    example: source,
    exampleLanguage: "sql",
    result: diff,
    resultLanguage: "diff",
  };
};
