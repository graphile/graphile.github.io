const fs = require("fs");
const vm = require("vm");
const graphqlDiff = require("../_diff");

exports.fileFilter = f => f.match(/^[^.].*\.js/);

exports.processFile = async (
  exampleFilePath,
  { prettify, postgraphileSchema, getPostGraphileSchemaWithOptions }
) => {
  const source = fs.readFileSync(exampleFilePath, "utf8");
  const fakeModule = { exports: {} };
  vm.runInThisContext(`((module, exports, require) => {${source}})`)(
    fakeModule,
    fakeModule.exports,
    require
  );
  const plugin = fakeModule.exports;
  const newSchema = await getPostGraphileSchemaWithOptions({
    appendPlugins: [plugin],
  });
  const diff = graphqlDiff(postgraphileSchema, newSchema);
  return {
    example: await prettify(exampleFilePath, source),
    exampleLanguage: "javascript",
    result: diff,
    resultLanguage: "diff",
  };
};

exports.filenameToExampleTitle = fn => fn.replace(/(Plugin)?\.[a-z]+$/, "");
