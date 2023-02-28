---
layout: post
title: PostGraphile Releases Version 4.10 - Framework Friends
date: 2020-11-27T01:00:00Z
path: /news/20201127-postgraphile-410/
thumbnail: /images/news/frameworks-thumbnail.svg
thumbnailAlt: "A gallery wall of frames containing blank blue images"
tags: announcements, releases, postgraphile
noToc: true

summary:
  "Graphile is pleased to announce the release of PostGraphile version 4.10, an
  upgrade introducing better support for various Node.js webserver frameworks,
  an upgraded GraphiQL and GraphiQL Explorer, and improvements added by our
  community members."
---

_Announced 2020-11-27 by Team Graphile_

<p class='intro'>
Graphile is pleased to announce the release of PostGraphile version 4.10, an upgrade introducing better support for various Node.js webserver frameworks, an upgraded GraphiQL and GraphiQL Explorer, and improvements added by our community members.
</p>

### Improved Framework Support

The major feature in this release is vastly improved support for various Node.js
webserver frameworks, including: Node itself, Connect, Express, Koa, Fastify (v2
and v3), and Restify. This also fixes some long-standing compatibility issues
with certain Koa plugins.

To accomplish this, we've split the middleware into separate route handlers for
each of our routes, and you can either use the middleware to delegate to these
(where the framework allows), or you can add the route handlers directly. You
can find documentation in our library usage page and can see examples in our new
server examples folder:
https://github.com/graphile/postgraphile/tree/v4/examples/servers

<div class="flex flex-wrap justify-around">
<img alt="A gallery wall of frames containing logos for Connect, Restify, Fastify,
  Express and Koa" src="/images/news/frameworks.svg" style="max-height: 600px" />
</div>

### Upgraded PostGraphiQL

The GraphiQL upgrade provides a dedicated headers editor panel next to the
variables editor, which replaces the old proof-of-concept sidebar. It also adds
new "Merge Query" and "Copy Query" buttons to the enhanced GraphiQL which may
ease development or debugging flows. The Explorer pane is now much smoother and
better looking too!

Community member _@eddiewang_ also added the ability to configure credentials
for GraphiQL. We appreciate additions from our community; if you wish to see a
particular feature in one of the Graphile projects, we encourage you to open an
issue or pull request with details. See our [Contribution Guide](/contribute/)
for some important information before going ahead and writing a new feature.

<div class="flex flex-wrap justify-around">
<img alt="A screenshot of the new improved PostGraphiQL" src="/images/news/postgraphiql.4.10.png" style="max-height: 600px" />
</div>

### GraphQL v15

GraphQL v15 compatibility has finally been added - you should review the changes
for yourself and pin GraphQL v14 if there are any breaking changes in your
projects.

### Thank you

As always we want to say a huge THANK YOU to all our sponsors and contributors;
This release includes many additions from new and old-hat contributors, and
wouldn't have been possible without paid time from our sponsors. If your company
benefits from PostGraphile or the wider Graphile suite, you should consider
asking them to fund our work. By significantly reducing the amount of work
needed to achieve business goals and reducing running costs, Graphile's software
results in huge time and money savings for users. We encourage companies to
contribute a portion of these savings back, enabling the projects to advance
more rapidly, and result in even greater savings for your company.
[Find out more about sponsorship here on our website](/sponsor/).

<div class="flex flex-wrap justify-around">
<img alt="PostGraphile thanks the community" src="/images/thanks.png" />
</div>

### Full release notes

Full detailed technical release notes can be found on GitHub:

- [4.10.0](https://github.com/graphile/postgraphile/releases/tag/v4.10.0)
- [4.9.2](https://github.com/graphile/postgraphile/releases/tag/v4.9.2)
- [4.9.1](https://github.com/graphile/postgraphile/releases/tag/v4.9.1)
- [4.9.0](https://github.com/graphile/postgraphile/releases/tag/v4.9.0)
