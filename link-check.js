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

/**
 * This prevents us placing multiple fetches to the same URL
 */
const checkLinkResolution = memoize(url => fetch(url));

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

const fileLinks = files.flatMap(file => {
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
});

pMap(
  fileLinks,
  async ({ filePretty, link }) => {
    const trimmed = link.replace(/[?#].*$/, "");

    const isHTTP = /^https?:\/\//.test(trimmed);
    const isMailto = /^mailto:/.test(trimmed);
    const isGraphile = /^https?:\/\/(www\.)?graphile\.(org|meh)/.test(trimmed);
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/.test(
      trimmed
    );
    const isLocalhost5000 = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):5000/.test(
      trimmed
    );
    const isGitHubEditLink = /^https?:\/\/github\.com\/graphile\/graphile\.github\.io\/edit/.test(
      trimmed
    );
    if (trimmed === "") {
      // Anchor link (#section-name), continue
      return;
    } else if (trimmed.match(/\.(css|png|svg|webmanifest)$/)) {
      // Resources
      return;
    } else if (isLocalhost5000) {
      /*
       * PostGraphile serves at http://localhost:5000 by default, so this will
       * be legitimately referenced in the docs. All other localhost URLs are
       * invalid.
       */
      return;
    } else if (isGitHubEditLink) {
      // Don't check this since the page may not exist yet
      return;
    } else if (isLocalhost) {
      invalid++;
      console.error(
        `${filePretty} has disallowed link to '${link}' (no localhost links allowed, except localhost:5000)`
      );
    } else if (isGraphile) {
      invalid++;
      console.error(
        `${filePretty} has disallowed link to '${link}' (Graphile internal links should start with \`/\` so that they point to the correct location in development/staging, do not include https://graphile.org)`
      );
    } else if (isMailto) {
      // mailto:, continue
      return;
    } else if (isHTTP) {
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

      try {
        /*
         * We use 'trimmed' rather than 'link' here since our check doesn't
         * factor in anchors yet.
         */
        const res = await checkLinkResolution(trimmed);
        if (res.ok) {
          return;
        }

        invalid++;
        console.error(
          `${filePretty} has broken link to '${link}' (link is returning a disallowed status code of ${res.status})`
        );
      } catch (err) {
        if (err.code === "ENOTFOUND") {
          invalid++;
          console.error(
            `${filePretty} has broken link to '${link}' (there may be nothing wrong with the link, but the host is currently not resolving as expected)`
          );
        } else if (err.code === "ECONNREFUSED") {
          invalid++;
          console.error(
            `${filePretty} has broken link to '${link}' (there may be nothing wrong with the link, but the host is currently refusing the connection)`
          );
        } else if (err.code === "ECONNRESET") {
          invalid++;
          console.error(
            `${filePretty} has broken link to '${link}' (some network instability has been detected between this device and the host, maybe just try again)`
          );
        } else {
          invalid++;
          console.error(
            `${filePretty} has broken link to '${link}' (an error we didn't understand occurred: ${err.message})`
          );
        }
      }
      return;
    } else if (validLinks.indexOf(trimmed) >= 0) {
      // Cool, looks legit
      return;
    }
    invalid++;
    console.error(
      `${filePretty} has disallowed link to '${link}' (none of the other validation rules matched)`
    );
  },
  { concurrency: 6 }
)
  .catch(e => {
    console.error();
    console.error(`An uncaught error occurred during link validation:`);
    console.error(e);
    process.exit(2);
  })
  .then(() => {
    if (invalid > 0) {
      console.log();
      console.log(`${invalid} errors found 😔`);
      process.exit(1);
    }
  });
