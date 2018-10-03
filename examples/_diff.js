const { printSchema } = require("graphql");
const fs = require("fs");
const os = require("os");
const { spawnSync } = require("child_process");
const rimraf = require("rimraf");

let count = 0;

/**
 * Outputs a string difference comparing two GraphQL schemas
 */
module.exports = function graphqlDiff(schema1, schema2) {
  const schemaText1 = printSchema(schema1);
  const schemaText2 = printSchema(schema2);
  const dirPath = `${os.tmpdir()}/schemadiff_${count++}`;
  let result;

  fs.mkdirSync(dirPath);
  try {
    const schema1Path = `${dirPath}/before.graphql`;
    const schema2Path = `${dirPath}/after.graphql`;
    fs.writeFileSync(schema1Path, schemaText1);
    fs.writeFileSync(schema2Path, schemaText2);
    result = spawnSync(
      "diff",
      [
        "-u",
        "--label=Original GraphQL Schema",
        "--label=Modified GraphQL Schema",
        schema1Path,
        schema2Path,
      ],
      {
        cwd: dirPath,
      }
    );
  } finally {
    rimraf.sync(dirPath);
  }
  if (result.stderr.length > 0) {
    // eslint-disable-next-line no-console
    console.error(result.stderr.toString("utf8"));
    throw new Error("Error occurred");
  }
  return result.stdout.toString("utf8");
};
