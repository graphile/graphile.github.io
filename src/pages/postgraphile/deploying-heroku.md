---
layout: page
path: /postgraphile/deploying-heroku/
title: Deploying to Heroku
---

## Deploying to Heroku

We recommend using an Amazon RDS PostgreSQL database with Heroku since Heroku
Postgres does not allow the issue of `CREATE ROLE` commands. (This can be
worked around, see below.)

This walkthrough assumes that you are using PostGraphile as a library, and
you have a local git repository containing your project.

First, you need to create a `Procfile` file in the root of your repo, telling
Heroku what to run:

```
web: yarn start
```

You may also want to ensure that your `package.json` contains a `build`
script that builds your app, and that you have `engines` defined to tell
Heroku which version of Node to use:

```json
  "engines": {
    "node": "12.x"
  }
```

Commit all this.

Once your database server is running and the database and relevant roles have been created, you need to do the following (note: many of these commands can instead be accomplished with the Heroku web interface):

- [Create the Heroku app](https://devcenter.heroku.com/articles/creating-apps) e.g. `heroku create myappname`
- [Set Heroku config variables](https://devcenter.heroku.com/articles/config-vars) e.g.
  ```bash
  heroku config:set \
      NODE_ENV="production" \
      GRAPHILE_TURBO="1" \
      DATABASE_URL="postgres://username:password@host:port/dbname?ssl=1" \
      -a myappname
  ```
- Add the Heroku app as a git remote to your local repository, e.g. `git remote add heroku git@heroku.com:myappname.git` (make sure you've [uploaded your SSH key to Heroku](https://devcenter.heroku.com/articles/keys))
- Push the `master` branch from your repo to Heroku to perform your initial build: `git push heroku master`

You should see the build scrolling past; if it fails then you should be able to see why and address it. If it succeeds then your application should be available at `https://<myappname>.herokuapp.com`

For a more in-depth and automated setup, including instructions on
configuring a job queue and sending emails, see the [Deploying to Heroku
instructions in Graphile
Starter](https://github.com/graphile/starter#deploying-to-heroku). (NOTE: at
time of writing, Graphile Starter is under development and is only available
to sponsors ─ reach out in Discord for early access.)

### Cleanup

To delete the Heroku app:

```
heroku apps:destroy -a myappname
```

### Creating roles on Heroku Postgres

See: https://devcenter.heroku.com/articles/heroku-postgresql-credentials
