---
layout: post
title: "PostGraphile and Grafast release candidate!"
date: 2025-10-28T12:00:00Z
path: /news/20251028-release-candidate/
thumbnail: /images/news/thank-you.svg
thumbnailAlt: "The Grafast logo"
tags: announcements, releases, grafast, postgraphile
noToc: false

summary:
  "After over 100 releases, PostGraphile V5 and Grafast V1 have finally reached
  release candidate status!🎉 Assuming no issues are found, this software, these
  APIs, are what will make up the final release. The runtime is ready and many
  of you are already using it in production. Try it out and tell us where the
  gaps in documentation and types are, and maybe help fill them!"
---

_Announced 2025-10-28 by the Graphile Team_

<p class='intro'>
  After over 100 releases, PostGraphile V5 and Grafast V1 have finally reached
  release candidate status!🎉 Assuming no issues are found, this software, these
  APIs, are what will make up the final release. The runtime is ready and many
  of you are already using it in production, but the types and docs are a little behind. 
  Try it out and tell us where the gaps are, and maybe help fill them!
</p>

### Five years in the making, PostGraphile V5 raises the bar again

After a couple false starts, in February 2020 we kicked off the journey that
would ultimately become PostGraphile V5 and the Gra*fast* planning and execution
engine. Since January 2023 we have shipped 38 pre-alpha, 20 alpha, and 49 beta
releases. Every stage refined the ergonomics, uncovered tricky edge cases, and
ultimately solved the four Gra*fast* epics that blocked a stable release:

- ✅ “Everything is batched” but “unary” values (variables, context, etc) are
  treated as a special case.
- ✅ Early termination of field execution with a `null` now has first-class
  support.
- ✅ Plan-time “peeking” at runtime values is now forbidden, improving plan
  re-use.
- ✅ The exponential polymorphic branching hazard is now eradicated by
  converging before branching again.

The result is a platform that is faster, more expressive, more configurable, and
easier to extend than anything we have shipped before.

### Why this is still a release candidate

We do not anticipate breaking changes to the runtime behaviour. Numerous teams
have already trusted beta builds in production for over a year and the feedback
has been excellent. The remaining work is polish: verifying the docs, catching
stray rough edges, and ensuring that migration guidance reflects the software as
it exists today.

You can expect the occasional breaking change in TypeScript typings as we close
gaps and fix inaccuracies. The runtime APIs will remain compatible, but you may
need to adjust type annotations while we tighten things up. Likewise, some TSDoc
comments are behind reality; we will update them alongside the docs.

If you bump into rough edges while trying V5, please raise an issue in the
[Crystal repo](https://github.com/graphile/crystal) so we can address it before
the final release.

### Thinking in plans

For those using Gra*fast* outside of PostGraphile, now is the perfect moment to
validate that the “[plans as dataflow](https://grafast.com/grafast/flow)”
approach clicks for you: do you understand the separation of “plan-time” and
“execution-time”? Can you see how principled communication between the steps
allows for optimization without needing to revisit plan resolvers?

If you don’t understand it, that’s likely a failing of our documentation! Help
us improve our explanations by sharing your feedback (whether confusion and
frustration or success and praise!) in our
[Discord](https://discord.gg/graphile) or with GitHub issues and pull requests!

### Read more

[Visit the announcement on PostGraphile.org](https://postgraphile.org/news/2025-10-28-v5-release-candidate)
for specific news about PostGraphile V5 and how to get the release candidate up
and running.

[Visit the announcement on Grafast.org](https://grafast.org/news/2025-10-28-grafast-v1-release-candidate)
for news about Gra*fast* V1 - the new GraphQL planning and execution engine
which powers PostGraphile under-the-hood.

### Thank you Sponsors

Gra*fast* and PostGraphile are crowd-funded open-source software, they rely on
crowd-sourced funding from individuals and companies to keep advancing.

If your company benefits from Gra*fast*, PostGraphile or the wider Graphile
suite, you should consider asking them to fund our work. By significantly
reducing the amount of work needed to achieve business goals and reducing
running costs, Graphile’s software results in huge time and money savings for
users. We encourage companies to contribute a portion of these savings back,
enabling the projects to advance more rapidly, and result in even greater
savings for your company.
[Find out more about sponsorship here on our website](/sponsor/).

<div class="flex flex-wrap justify-around">
<img alt="Thanks!" src="/images/news/thank-you.svg" style="max-height: 300px" />
</div>
