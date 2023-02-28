---
layout: post
title: "PostGraphile Now Supports GraphQL Over Server-Sent Events"
date: 2022-04-15T01:00:00Z
path: /news/20220415-graphql-over-sse/
thumbnail: /images/news/sse.svg
thumbnailAlt: "People sending paper airplanes to each other."
tags: announcements, releases, postgraphile, graphile-contrib
noToc: true

summary:
  "PostGraphile now supports GraphQL over Server-Sent Events; a protocol which
  enables the user to push data to web pages in real-time."
---

_Announced 2022-04-15 by the Graphile Team_

<p class='intro'>
PostGraphile now supports GraphQL over Server-Sent Events; a protocol which
enables the user to push data to web pages in real-time.
</p>

This functionality is powered by `graphql-sse` - a zero-dependency, HTTP/1 safe,
simple, GraphQL over Server-Sent Events Protocol server and client, written by
Denis Badurina.

Find his implementation for PostGraphile in the
[graphile-contrib repo](https://github.com/graphile-contrib/graphql-sse).

<div class="flex flex-wrap justify-around">
<img alt="People sending paper airplanes to each other." src="/images/news/sse.svg" style="max-height: 300px" />
</div>

### Contribute to Graphile projects

This is just one example of a Graphile community member adding to the Graphile
suite of open source tools. We welcome contributions in many forms across many
of our projects, from simple fixes in our documentation through to community
plug-ins and contributions to the main PostGraphile git branch. If you wish to
get involved, a good first step is our
[Contribution Guide](https://www.graphile.org/contribute/); if you wish to get
stuck into developing on the main branches of our projects then please pop into
our [Community Discord](https://discord.gg/graphile) where we have several
`#dev` channels - this will let you see where we're currently working in the
code base, and ideas others have also had. Pull requests should be focused on
changing only one thing at a time - and large changes should seek maintainer
approval first. We look forward to welcoming you to our team of contributors!

<div class="tc">
<img alt="Thank you" src="/images/thanks.png" />
</div>
