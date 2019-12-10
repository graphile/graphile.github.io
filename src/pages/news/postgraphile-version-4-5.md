---
layout: page
path: /news/postgraphile-version-4-5/
title: PostGraphile Releases Version 4.5
noToc: true
---

_Announced 2019-11-24_

<p class='intro'>
Graphile is pleased to announce the release of PostGraphile version 4.5.0, an upgrade recommended for all PostGraphile users.
</p>
<strong>🚨Beware:</strong> previously the CLI would ignore arguments it didn't understand, now it exits stating the arguments it wasn't expecting. If you were relying on this old behaviour, you will need to update your code to pass valid arguments.

### New Feature: Explain in Graph*i*QL

The headline feature in 4.5 is the addition of the new Explain feature in Graph*i*QL, visible by using the `--allow-explain` flag. In Graph*i*QL you'll see a new section in your return statement, plus new panel on the right which will show executed query in a readable format.

<div class="tc">
<img alt="Demo of the new GraphiQL Explain feature in PostGraphile" src="/images/graphiqlexplainbutton.png" />
</div>

### Smart Tags

No longer do you need to put `COMMENT` commands in the database ("smart comments") to customise your schema, you can now use a tags file to gather these "smart tags" into one, version controlled, easy-to-diff place. Smart comments and smart tags can be used in unison, and both will be supported going forward so you can pick whichever works best for your team.

### Big contributions from the Graphile community

Thanks to everyone in the Graphile community who has contributed to this release; it's been a good release for community involvement as you can see in the [release notes](https://github.com/graphile/postgraphile/releases/tag/v4.5.0). Contributions from the community include improvements to QueryBuilder, better JWT support and bug fixes for types.

<div class="tc">
<img alt="Thank you" src="/images/thanks.png" />
</div>

### Thank you for your sponsorship

By significantly reducing the amount of work needed to achieve business goals, PostGraphile results in huge savings for users. If your organization contributes some of these savings back then everyone can benefit from more frequent releases with better performance, better compatibility, better documentation, easier customization, and more features — leading to even greater savings or profits for your organization.

We now have 84 sponsors across GitHub and Patreon and that means we're funded to spend an average of nearly 2 days per week on Open Source; this is brilliant!

[Click here to find out more about why and how you should sponsor PostGraphile development.](/sponsor/)

### Full release notes

Full detailed technical release notes can be found on GitHub:

- [v4.5.0 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.5.0)
- [v4.4.4 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.4.4)
- [v4.4.3 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.4.3)
- [v4.4.2 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.4.2)
- [v4.4.1 release notes](https://github.com/graphile/postgraphile/releases/tag/v4.4.1)
