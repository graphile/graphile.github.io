---
layout: post
title: Graphile Migrate 1.0.0 🥳
date: 2020-11-27T01:00:00Z
path: /news/20201127-migrate-1/
tags: announcements, releases, migrate
---

Graphile Migrate has proven itself stable; so it's finally time to bump it to v1
🎉

Graphile Migrate is an opinionated SQL-powered productive roll-forward migration
tool for PostgreSQL.

Why?

    fast iteration speed — save a file and database is updated in milliseconds
    roll-forward only — maintaining rollbacks is a chore, and in 10 years of API development I've never ran one in production
    familiar — no custom DSL to learn, just use PostgreSQL syntax
    fully functional — sending SQL commands directly to PostgreSQL means you can use all of PostgreSQL's features
    complements PostGraphile — works with any application, but PostGraphile's watch mode means that the GraphQL schema is instantly regenerated (without server restart) whenever the database changes
