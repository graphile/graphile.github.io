/* eslint-disable no-console */
// Don't fail on self-signed SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const chalk = require("chalk");
const fetch = require("node-fetch");
const pMap = require("p-map");
const Entities = require("html-entities").AllHtmlEntities;

const CACHED_VALID_URLS_FILE_PATH = `${__dirname}/.cachedValidUrls.json`;

const entities = new Entities();

const base = `${__dirname}/public`;
const files = glob.sync(`${base}/**/*.html`);
const validLinks = files.map(f =>
  f.substr(base.length).replace(/index.html$/, "")
);

const memoize = fn => {
  const cache = new Map();
  return function memoized(arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    } else {
      const res = fn.call(this, arg);
      cache.set(arg, res);
      return res;
    }
  };
};

function defer() {
  let _resolve, _reject;
  const p = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });
  p.resolve = _resolve;
  p.reject = _reject;
  return p;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * This prevents us placing multiple fetches to the same URL
 */
const queueByHost = {};
const cachedCheckByUrl = {};
/**
 * So we don't need to check again next time
 */
const validUrls = [];
try {
  const cached = require(CACHED_VALID_URLS_FILE_PATH);
  validUrls.push(...cached);
} catch (e) {
  /* noop */
}

const checkLinkResolution = memoize(url => {
  if (!cachedCheckByUrl[url]) {
    cachedCheckByUrl[url] = validUrls.includes(url)
      ? Promise.resolve({ ok: true })
      : (async () => {
          const { host } = new URL(url);
          if (!queueByHost[host]) {
            queueByHost[host] = Promise.resolve();
          }
          const deferred = defer();
          const previous = queueByHost[host];
          queueByHost[host] = previous
            .finally(() => sleep(300))
            .then(async () => {
              console.log(`Fetching (queue=${host}) '${url}'`);
              const res = await fetch(url, {
                headers: {
                  "user-agent": "GraphileLinkChecker/0.1",
                },
              });
              if (res.ok) {
                // Add to list
                validUrls.push(url);
                return res;
              } else {
                return res;
              }
            })
            .then(deferred.resolve, deferred.reject);
          return deferred;
        })();
  }
  return cachedCheckByUrl[url];
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
    const isYoutube = /^https?:\/\/(www\.)?youtube.com(\/|$)/.test(trimmed);
    const isTwitter = /^https?:\/\/(www\.)?twitter.com(\/|$)/.test(trimmed);
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
    } else if (trimmed.match(/\.(css|png|svg|webmanifest|xml)$/)) {
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
      return;
    } else if (isGraphile) {
      invalid++;
      console.error(
        `${filePretty} has disallowed link to '${link}' (Graphile internal links should start with \`/\` so that they point to the correct location in development/staging, do not include https://graphile.org)`
      );
      return;
    } else if (isMailto) {
      // mailto:, continue
      return;
    } else if (isYoutube) {
      // YouTube sometimes gets upset and returns 429; we'll just allow it.
      return;
    } else if (isTwitter) {
      // Twitter sometimes gets upset and returns 429; we'll just allow it.
      return;
    } else if (isHTTP) {
      const matches = trimmed.match(
        /^https?:\/\/(?:www\.)?postgresql.org\/docs\/([^/]+)\/[^#]*(#.*)?$/
      );
      if (matches) {
        const [, docVersion, hash] = matches;
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
        return;
      } catch (err) {
        if (err.code === "ENOTFOUND") {
          invalid++;
          console.error(
            `${filePretty} has broken link to '${link}' (there may be nothing wrong with the link, but the host is currently not resolving as expected)`
          );
          return;
        } else if (err.code === "ECONNREFUSED") {
          invalid++;
          console.error(
            `${filePretty} has broken link to '${link}' (there may be nothing wrong with the link, but the host is currently refusing the connection)`
          );
          return;
        } else if (err.code === "ECONNRESET") {
          invalid++;
          console.error(
            `${filePretty} has broken link to '${link}' (some network instability has been detected between this device and the host, maybe just try again)`
          );
          return;
        } else {
          invalid++;
          console.error(
            `${filePretty} has broken link to '${link}' (an error we didn't understand occurred: ${err.message})`
          );
          return;
        }
      }
    } else if (validLinks.indexOf(trimmed) >= 0) {
      // Cool, looks legit
      return;
    }
    invalid++;
    console.error(
      `${filePretty} has disallowed link to '${link}' (none of the other validation rules matched)`
    );
  },
  { concurrency: 12 }
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
    } else {
      console.log();
      console.log(`${fileLinks.length} links checked - all passed 💪`);
    }
  })
  .then(() => {
    fs.writeFileSync(
      CACHED_VALID_URLS_FILE_PATH,
      JSON.stringify(validUrls.sort(), null, 2)
    );
  });
