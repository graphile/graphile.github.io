/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const chalk = require("chalk");

const base = `${__dirname}/public`;
const files = glob.sync(`${base}/**/*.html`);
const validLinks = files.map(f =>
  f.substr(base.length).replace(/index.html$/, "")
);

function allMatches(str, regex) {
  const all = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const matches = regex.exec(str);
    if (!matches) break;
    all.push(matches[1]);
  }
  return all;
}

let invalid = 0;

for (const file of files) {
  const filePretty = chalk.bold(
    path
      .relative(__dirname, file)
      .replace(/^public/, "")
      .replace(/index.html$/, "")
  );
  const contents = fs.readFileSync(file, "utf8");
  if (contents.indexOf("Postgraphile") >= 0) {
    invalid++;
    console.error(
      `${filePretty} mentions 'Postgraphile'; please change to 'PostGraphile' or 'postgraphile' for consistency.`
    );
  }
  const links = allMatches(contents, /href="([^"]+)"/g);
  for (const link of links) {
    const trimmed = link.replace(/[?#].*$/, "");
    if (trimmed.match(/\.(js|css|png|svg)$/)) {
      // Meh, resources
      continue;
    }
    if (
      trimmed.match(/^(https?:)?\/\//) &&
      (trimmed.match(/github\.com/) || !trimmed.match(/graphile\.(org|meh)/))
    ) {
      // Absolute, continue
      continue;
    }
    if (trimmed.match(/^mailto:/)) {
      // mailto:, continue
      continue;
    }
    if (trimmed === "") {
      // Anchor link
      continue;
    }
    if (validLinks.indexOf(trimmed) >= 0) {
      // Cool, looks legit
      continue;
    }
    invalid++;
    console.error(`${filePretty} has invalid link to '${link}'`);
  }
}

if (invalid > 0) {
  console.log();
  console.log(`${invalid} errors found 😔`);
  process.exit(1);
}
