/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const chalk = require("chalk");
const fetch = require("node-fetch");
const pMap = require("p-map");
const memoize = require("memoizee");
const Entities = require("html-entities").AllHtmlEntities;

const entities = new Entities();

const base = `${__dirname}/public`;
const files = glob.sync(`${base}/**/*.html`);
const validLinks = files.map(f =>
  f.substr(base.length).replace(/index.html$/, "")
);

const checkLinkResolution = memoize(function checkLinkResolution(url) {
  return fetch(url);
});

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

const fileLinks = files
  .map(file => {
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

    // WARNING! Cardinal sin below, shield eyes
    return allMatches(contents, /<a[^>]+href="([^"]+)"/g).map(link => {
      return {
        link: entities.decode(link),
        filePretty,
      };
    });
  })
  .reduce((flattened, toFlatten) => flattened.concat(toFlatten), []);

pMap(
  fileLinks,
  async ({ filePretty, link }) => {

    const trimmed = link.replace(/[?#].*$/, "");

    if (trimmed.match(/\.(css|png|svg|webmanifest)$/)) {
      // Meh, resources
      return;
    }
    const isAbsolute = /^[a-z]+:\/\//.test(trimmed);
    const isGraphile = /^https?:\/\/graphile\.(org|meh)/.test(trimmed);
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):(?:[^5]|5[^0]|50[^0]|500[^0])/.test(
      trimmed
    );
    const isGraphileOrLocalhost = isGraphile || isLocalhost;
    if (isAbsolute && !isGraphileOrLocalhost) {
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
          return;
        }
      }

      if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/.test(trimmed)) {
        return;
      }

      return checkLinkResolution(link)
        .then(res => {
          if (res.ok) {
            return;
          }

          /*
           * New pages that are added will generate this link in the template for
           * the current branch, but will not be available over http in github
           * until the merge is complete. So here we allow for the test to pass
           * but output a warning.
           */
          if (/github\.com\/graphile\/graphile\.github\.io\/edit/.test(link)) {
            console.warn(
              `${filePretty} has broken link to '${link}', however, the assumption is this is a newly added page and will resolve after the merge.`
            );
          } else {
            invalid++;
            console.error(
              `${filePretty} has broken link to '${link}' (link is returning a disallowed status code of ${res.status})`
            );
          }
        })
        .catch(err => {
          if (err.code === "ENOTFOUND") {
            invalid++;
            console.error(
              `${filePretty} has broken link to '${link}' (there may be nothing wrong with the link, but the host is currently not resolving as expected)`
            );
          } else if (err.code === "ECONNREFUSED") {
            invalid++;
            console.error(
              `${filePretty} has broken link to '${link}' (there may be nothing wrong with the link, but the host is current refusing the connection)`
            );
          } else if (err.code === "ECONNRESET") {
            invalid++;
            console.error(
              `${filePretty} has broken link to '${link}' (some network instability has been detected between this device and the host, maybe just try again)`
            );
          } else {
            throw err;
          }
        });
    }
    if (trimmed.match(/^mailto:/)) {
      // mailto:, continue
      return;
    }
    if (trimmed === "") {
      // Anchor link
      return;
    }
    if (validLinks.indexOf(trimmed) >= 0) {
      // Cool, looks legit
      return;
    }
    invalid++;
    console.error(
      `${filePretty} has disallowed link to '${link}' (please ensure links start with '/' if possible, do not include https://graphile.org)`
    );
  },
  { concurrency: 6 }
).then(() => {
  if (invalid > 0) {
    console.log();
    console.log(`${invalid} errors found 😔`);
    process.exit(1);
  }
});
