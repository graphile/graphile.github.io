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
  const links = allMatches(contents, /<a[^>]+href="([^"]+)"/g);
  for (const link of links) {
    const trimmed = link.replace(/[?#].*$/, "");
    if (trimmed.match(/\.(js|css|png|svg|webmanifest)$/)) {
      // Meh, resources
      continue;
    }
    if (
      trimmed.match(/^(https?:)?\/\//) &&
      (trimmed.match(/github\.com/) ||
        !trimmed.match(/graphile\.(org|meh)/) ||
        trimmed.match(/learn\.graphile\.org/))
    ) {
      const matches = trimmed.match(
        /^https?:\/\/(?:www\.)?postgresql.org\/docs\/([^\/]+)\/[^#]*(#.*)?$/
      );
      if (matches) {
        const [_, docVersion, hash] = matches;
        const CURRENT_VERSION = "11";
        /*
         * It's better to link to /docs/current/ in general, but when there's a
         * hash we want to ensure the links don't break when we go up a major
         * version so linking to /docs/11/ is appropriate then. Linking to
         * older docs is currently not accepted, but we may need to add
         * exceptions in future.
         */
        const isOkay =
          docVersion === CURRENT_VERSION || (!hash && docVersion === "current");
        if (!isOkay) {
          invalid++;
          if (hash) {
            console.error(
              `${filePretty} has disallowed link to '${link}' (please ensure PostgreSQL documentation links with hashes link to the '/docs/${CURRENT_VERSION}/...' documentation, you linked to '/docs/${docVersion}/...')`
            );
          } else {
            console.error(
              `${filePretty} has disallowed link to '${link}' (please ensure PostgreSQL documentation links link to the '/docs/current/...' documentation, you linked to '/docs/${docVersion}/...')`
            );
          }
          // Handled above
          continue;
        }
      }
      // TODO: check the link resolves

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
    console.error(
      `${filePretty} has disallowed link to '${link}' (please ensure links start with '/' if possible, do not include https://graphile.org)`
    );
  }
}

if (invalid > 0) {
  console.log();
  console.log(`${invalid} errors found 😔`);
  process.exit(1);
}
