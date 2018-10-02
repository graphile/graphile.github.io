const fs = require("fs");

exports.fileFilter = f => f.match(/^[^.].*\.js/);

exports.processFile = async (queryFilePath, { prettify }) => {
  const source = fs.readFileSync(queryFilePath, "utf8");
  return {
    example: source,
    exampleLanguage: "javascript",
    result: "",
    resultLanguage: "",
  };
};

exports.filenameToExampleTitle = fn => fn.replace(/\.[a-z]+$/, "");
