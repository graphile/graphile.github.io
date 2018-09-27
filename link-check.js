const fs = require('fs');
const glob = require('glob');

const base = `${__dirname}/public`;
const files = glob.sync(`${base}/**/*.html`);
const validLinks = files.map(f => f.substr(base.length).replace(/index.html$/, ''))

function allMatches(str, regex) {
  const all = [];
  while (true) {
    const matches = regex.exec(str);
    if (!matches) break;
    all.push(matches[1]);
  }
  return all;
}

let invalid = 0;

for (const file of files) {
  const contents = fs.readFileSync(file, 'utf8');
  const links = allMatches(contents, /href="([^"]+)"/g);
  for (const link of links) {
    const trimmed = link.replace(/[?#].*$/, '');
    if (trimmed.match(/\.(js|css|png|svg)$/)) {
      // Meh, resources
      continue;
    }
    if (trimmed.match(/^(https?:)?\/\//) && (trimmed.match(/github\.com/) || !trimmed.match(/graphile\.(org|meh)/))) {
      // Absolute, continue
      continue;
    }
    if (trimmed.match(/^mailto:/)) {
      // mailto:, continue
      continue;
    }
    if (trimmed === '') {
      // Anchor link
      continue;
    }
    if (validLinks.indexOf(trimmed) >= 0) {
      // Cool, looks legit
      continue;
    }
    invalid++;
    console.error(`${file} has invalid link to '${link}'`);
  }
}

if (invalid > 0) {
  console.log(`${invalid} invalid links found`);
  process.exit(1);
}