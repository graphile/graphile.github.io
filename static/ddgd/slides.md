source-file: 000-cover/000-cover.md
source-line: 1
class: title-page bg-blue-home compact-paragraphs

# Database-Driven GraphQL Development

.h2[Benjie Gillam]  
.h4[[PostGraphile](https://graphile.org/postgraphile/) OSS maintainer]

.slidesLocation[
Twitter: [@Benjie](https://twitter.com/Benjie)  
Slides: [https://graphile.org/ddgd](https://graphile.org/ddgd)
]

???

Hello everybody! My name's Benjie, and I'm the maintainer of an open-source project called PostGraphile which builds and serves a highly performant, secure, client-facing GraphQL API by inspecting your existing database.


---
source-file: 020-main/0000-everything.md
source-line: 1
class: has-code compact-paragraphs bigLi
layout: false

### GraphQL is **Declarative**

.slidesLocation[
Twitter: [@Benjie](https://twitter.com/Benjie)  
Slides: [https://graphile.org/ddgd](https://graphile.org/ddgd)
]

???

One of the things that I think is really powerful about GraphQL is it’s
declarative nature.

--
source-file: 020-main/0000-everything.md
source-line: 16

.pull-left[

```graphql
{
  hero {
    name
    friends {
      name
    }
  }
}
```

]

???

You declare exactly what you want

--
source-file: 020-main/0000-everything.md
source-line: 37

.pull-right[

```json
{
  "hero": {
    "name": "R2-D2",
    "friends": [
      { "name": "Luke Skywalker" },
      { "name": "Han Solo" },
      { "name": "Leia Organa" }
    ]
  }
}
```

]

???

and the server gives you
that - nothing more, nothing less. This signalling of your intent allows the
server to optimise exactly how it's serving you. It can look at the query as a
whole and find the most efficient way to fulfill your request.

---
source-file: 020-main/0000-everything.md
source-line: 63

class: has-code compact-paragraphs bigLi

### GraphQL **Eliminates Under- and Over-fetching**

.pull-left[

```ruby
posts = Post.where(id: [1, 2, 3])
authors =
  posts.map { |post| post.author }
```

]
.pull-right[

```sql
SELECT * FROM posts WHERE id IN
  (1, 2, 3);
SELECT * FROM users WHERE id = 10;
SELECT * FROM users WHERE id = 11;
SELECT * FROM users WHERE id = 12;
```

]

.clear[]

???

For years we’ve been using data abstractions such as ORMs to simplify data
access whilst programming, but this means data is fetched on a step-by-step,
code-line by code-line basis. This under-fetching results in lots of
inefficient data retrieval and big performance issues, or complex code that
fetches as much as it can ahead of time - often leading to over-fetching.

GraphQL solves both these issues by declaring up front exactly what's needed.

--
source-file: 020-main/0000-everything.md
source-line: 102

```graphql
{
  posts(where: { id: { in: [1, 2, 3] } }) {
    id
    title
    # ...
    author {
      id
      name
      # ...
    }
  }
}
```

---
source-file: 020-main/0000-everything.md
source-line: 119

class: has-code compact-paragraphs bigLi

### **Declarative** Programming

???
When you think of declarative programming, a few things might come to mind.

--
source-file: 020-main/0000-everything.md
source-line: 128

React.js - declarative programming **applied to UIs**

👉 more stable software  
👉 reduced programmer workload

???

A
recent technology that's been making waves is React, showing how declarative
programming applied to user interfaces can lead to more stable software and
reduced programmer workload.

--
source-file: 020-main/0000-everything.md
source-line: 142

SQL - declarative **data fetching and manipulation**

✅ well established  
✅ widely used  
✅ constantly evolving based on real-world needs

???

A more established example is SQL. You might thing
SQL is ancient, but just because SQL is old, does not mean that it's stale -
it's a constantly advancing standard that learns and evolves based on
real-world needs.

For years we’ve been declaring what we want from the database and having it
find the most efficient way to serve our request. The query planner in Postgres
for example has been worked on and improved for over 20 years by hundreds of
programmers. Besides performing complex relational algebra operations, the
latest versions even use techniques such as genetic algorithms to figure out
what the most efficient query plan is. Incredible stuff!

---
source-file: 020-main/0000-everything.md
source-line: 164

class: has-code compact-paragraphs bigLi

### **Familiar** Data Model

GraphQL models data in a natural way - **nodes**, their **attributes**, and the **connections** between them.

???

We like the way that GraphQL models our data in a similar way to the
how we think about things in the real world - with nodes, their attributes, and
their connections. This model meshes well with databases - tables to represent
the nodes, columns to represent the attributes and foreign key relations to
represent the connections between them.

--
source-file: 020-main/0000-everything.md
source-line: 180

Databases represent data in a similar way:

- Nodes → **tables**
- Attributes → **columns**
- Connections → foreign key **relations**

---
source-file: 020-main/0000-everything.md
source-line: 188

class: has-code compact-paragraphs bigLi

### **Efficiently** Executing GraphQL

???

As we've also heard from Hasura, it's possible to convert a GraphQL query into
an SQL query,

--
source-file: 020-main/0000-everything.md
source-line: 199

.pull-left[

```graphql
{
  posts(where: {
    id: { in: [1, 2, 3] }
  }) {
*   id
*   title
    author {
*     id
*     name
    }
  }
}
```

]

.pull-right[

```sql
⁣
⁣
⁣
SELECT
* id,
* title,
  (SELECT json_build_object(
*   'id', id,
*   'name', name
  ) FROM person WHERE id = author_id)
FROM posts
WHERE id IN (1,2,3);
```

]

???

passing the task of finding the most efficient way of resolving
this request over to a well-optimised query planner. That's certainly going to
lead to some impressive performance!

So database query planners are incredible for performance, but something that I
think a lot of people overlook is that the database can do a lot more for us.

---
source-file: 020-main/0000-everything.md
source-line: 248

class: has-code compact-paragraphs bigLi

### **Database-Driven GraphQL Development** (DDGD)

✨ Embraces database features  
🚀 Rapid development  
⚡️ Lighting fast APIs  
🤖 Stay in control of your data

???

By embracing these other capabilities we can very rapidly develop powerful
applications, whilst maintaining full control over our most valuable asset -
the data. This is a technique that I call database-driven GraphQL development,
and I want to share with you today just a few of the things that I really love
about it.

---
source-file: 020-main/0000-everything.md
source-line: 267

class: has-code compact-paragraphs bigLi
name: productivity

### DDGD: **Auto-generation**

???
The first thing is productivity. By treating the database as your source of
truth, you can ⏭ auto-generate a lot of your API, massively ⏭ reducing the amount
of work programmers need to do.

⏭Further, this auto-generation reduces the risk of human error slipping into
your GraphQL and causing inconsistencies ⏭ for example using plurals in some
places, but singulars in others; or having typos in your connection names that
you have to maintain for backwards compatibility. The result is a very
consistent GraphQL schema.

---
source-file: 020-main/0000-everything.md
source-line: 285

template: productivity
count: false

.pull-left[

```sql
CREATE TABLE post (
  id serial primary key,
  author_id int not null
    references person,
  blog_id int not null
    references blog,
  title text not null,
  body text not null,
  published_at timestamptz
);
```

]

--
source-file: 020-main/0000-everything.md
source-line: 307

.pull-right[

```graphql
type Post {
  id: Int!
  authorId: Int!
  author: Person
  blogId: Int!
  blog: Blog
  title: String!
  body: String!
  publishedAt: String
}
```

]

---
source-file: 020-main/0000-everything.md
source-line: 326

class: has-code compact-paragraphs bigLi

### DDGD: **Customising**

???

It's important to note that your GraphQL schema does not have to be a perfect
reflection of your database schema or underlying tables, there are techniques
you can use to ⏭customise how your GraphQL schema is built - what's included,
how it's named. For example, PostGraphile can obey the database permissions,
ensuring you don't expose things through GraphQL that the user wouldn't be able
to access.⏭ We also have the concept of smart comments, which allow you to
annotate individual tables, columns, functions, etc. and change their names,
deprecate them, or have them omitted under certain circumstances.

--
source-file: 020-main/0000-everything.md
source-line: 343

.pull-left[

```sql
GRANT UPDATE (
  body,
  published_at
) ON post TO graphql_role;
```

]

.pull-right[

```graphql
input PostPatch {
  body: String
  publishedAt: String
}
```

]

.clear[]

--
source-file: 020-main/0000-everything.md
source-line: 369

.pull-left[

```sql
-- "Smart comment"
COMMENT ON COLUMN
  post.published_at
*IS E'@name publicationDate';
⁣
-- COMMENT ON TABLE ...
-- COMMENT ON FUNCTION ...
-- COMMENT ON CONSTRAINT ...
-- COMMENT ON TYPE ...
-- COMMENT ON VIEW ...
```

]

.pull-right[

```graphql
input PostPatch {
  body: String
* publicationDate: String
}
⁣
type Post {
  #...
* publicationDate: String
}
```

]

???

And because you're auto-generating your GraphQL schema you can enhance it
across the board - for example adding custom documentation to all connections
at once. In PostGraphile we enable these kinds of broad changes via our plugin
system.

---
source-file: 020-main/0000-everything.md
source-line: 411

class: has-code compact-paragraphs bigLi

### DDGD: **Extending via Functions**

???

Another way to extend your schema is to really embrace the powerhouse that is
your database. ⏭ Postgres for example gives you support for very powerful
functions, which can return anything from scalars to ⏭ set of database records.
These can be used to efficiently add "computed columns" to your tables,
additional queries at the root level, or ⏭ powerful custom mutations.

--
source-file: 020-main/0000-everything.md
source-line: 425

.pull-left[

```sql
-- "Computed column"
CREATE FUNCTION person_name(
  p person
) RETURNS text...
```

]

.pull-right[

```graphql
extend type Person {
  name: String
}
```

]

.clear[]

--
source-file: 020-main/0000-everything.md
source-line: 450

.pull-left[

```sql
-- "Custom query"
CREATE FUNCTION top_posts()
RETURNS SETOF post...
```

]

.pull-right[

```graphql
extend type Query {
  topPosts: PostConnection
}
```

]

.clear[]

--
source-file: 020-main/0000-everything.md
source-line: 474

.pull-left[

```sql
-- "Custom mutation"
CREATE FUNCTION register_person(
  username text,
  password text
) RETURNS person...
```

]

.pull-right[

```graphql
extend type Mutation {
  registerUser(
    username: String,
    password: String
  ): Person
}
```

]

???

And of course there's an escape hatch - you can always add additional
capabilities to your GraphQL schema itself, either by plugging directly into
the schema generation process and gaining access to the powerful query planner,
or by using techniques such as GraphQL schema stitching.

This is all great for designing your GraphQL schema, but your database can do
so much more for you!

---
source-file: 020-main/0000-everything.md
source-line: 511

class: has-code compact-paragraphs bigLi

### DDGD: Databases Give **Guarantees**

???

One of the most important things it can do, is to give
you guarantees. Guarantees are wonderful - we programmers love guarantees -
because it reduces the number of things you have to test!

What guarantees can your database give you?

---
source-file: 020-main/0000-everything.md
source-line: 525

class: has-code compact-paragraphs bigLi
count: false

### DDGD: Databases Give **Guarantees**

- Transactions - everything succeeds or fails **together**

???
The most widely known I'd guess are
transactions - these are groups of SQL statements that either all succeed or
all fail together - meaning you don't need to write code to undo the effects of
partial successes.

--
source-file: 020-main/0000-everything.md
source-line: 540

- Foreign key constraints - ensure relations are and **remain** consistent

???
But we can also have our database give guarantees about the data that it’s
managing for us. For example we can use foreign key constraints that ensure the
other end of the relationship definitely exists, and will continue to exist
until it's no longer referenced.

--
source-file: 020-main/0000-everything.md
source-line: 550

- Unique constraints - **assert ongoing uniqueness** of a column or set of columns

???

We can add unique constraints that guarantee that no two people can have the same username, or that the same URL slug cannot be used more than once on the same website.

--
source-file: 020-main/0000-everything.md
source-line: 558

- Check constraints - ensure data **conforms**

???

Check constraints are another, these ensure that our data conforms to a
particular format - for example that every email address has exactly one "@"
character in it, or that `date_of_birth` is at least 18 years ago.

---
source-file: 020-main/0000-everything.md
source-line: 568

class: has-code compact-paragraphs bigLi
count: false

### DDGD: Databases Give **Guarantees**

- Transactions - everything succeeds or fails **together**

- Foreign key constraints - ensure relations are and **remain** consistent

- Unique constraints - **assert ongoing uniqueness** of a column or set of columns

- Check constraints - ensure data **conforms**

Constraints are **guaranteed to remain true**.

???

One of the great things about these database constraints is that the database
will ensure that these things will _always_ be true - they are guarantees -
unlike the checks and validations that we add in the application layer which
only affect the data as it is processed (and could be bypassed by secondary
systems such as work queues and microservices). As the constraints in your
application layer evolve you must remember to go back and check previous data,
otherwise you might find that users can no longer log in because their legacy
username doesn't pass your new validation logic! Database constraints, however,
apply to new and old data alike - if the new constraints are not valid, you'll
be made aware and can take steps to correct either the constraints or the data.

--
source-file: 020-main/0000-everything.md
source-line: 598

Ensures **only valid data** goes into/out of GraphQL.

???

So by embracing our database, we can ensure that the data coming in and out of
our GraphQL API will always honour our latest set of validations. But we can
also leverage the database to improve our data security.

---
source-file: 020-main/0000-everything.md
source-line: 608

class: has-code compact-paragraphs bigLi

### DDGD: Data **Security**

???

Until a few years ago, the security available in databases was not granular
enough for us to easily be able to use it for our common web-application needs.
In fact, we’ve been putting business logic in the application layer for so long
now that we think that it's the right way, because it has been the only way!

---
source-file: 020-main/0000-everything.md
source-line: 621

class: has-code compact-paragraphs bigLi
count: false

### DDGD: Data **Security**

- Row Level Security: **co-locate** security and data

???
But it's not the only way any more. In 2015 Postgres introduced support for row
level security, finally giving us the granular permissions that we need to move
our business logic into the most sensible place - co-located with the data.

--
source-file: 020-main/0000-everything.md
source-line: 635

- Enforces data-logic rules on **every data access** - API, control panel, microservices, ...

???

This technology helps us to ensure that no matter how the data is accessed - by
your application layer, your API, your admin app, everything - your business
logic rules will always apply.

---
source-file: 020-main/0000-everything.md
source-line: 645

class: has-code compact-paragraphs bigLi
count: false

### DDGD: Data **Security**

- Row Level Security: **co-locate** security and data

- Enforces data-logic rules on **every data access** - API, control panel, microservices, ...

- Security policy statements - easy to **audit**

???

A great thing about building security in this way, is that the data access
rules are kept as separate security policy statements, which makes it very easy
to audit. In these days of strong data protection legislations such as the
GDPR, being able to easily review these policies really helps us to ensure that
we are meeting our data-protection obligations. And we can be confident that
they are enforced using a well tested, vetted and trusted implementation from
our database vendor, rather than something that's been developed in-house or by
a third party.

--
source-file: 020-main/0000-everything.md
source-line: 669

- Once defined, applied **automatically**

???

The best thing is that once we've declared these security policies, we don't
have to think about them again! We don't have to remember to add all the
relevant WHERE clauses whenever we access that particular resource - it's done
for us by the database. In fact, you could say, it's guaranteed.

---
source-file: 020-main/0000-everything.md
source-line: 680

class: title-page compact-paragraphs bigLi
layout: false

## DDGD: Summary

⏩ Rapid API development  
⚡️ Lighting-fast execution  
✅ Data consistency guaranteed  
🤖 Maintain control of database  
🔐 Easily auditable security

???

I guess at the end of the day the thing that I like most about Database-Driven
GraphQL Development is the speed. Both the speed at which the API can resolve
even complex queries, and the speed with which I can develop a stable, secure
and maintainable API.

⏭

Thank you for listening to my talk, I encourage you to embrace the power of the
database, and ⏭ become SQL Superpowered! If you've any questions please come ask
us in the Graphile chat at http://discord.gg/graphile; or message me on Twitter

- I'm @Benjie.

--
source-file: 020-main/0000-everything.md
source-line: 708

## Thanks for listening!

.footer[

### [@Benjie](https://twitter.com/Benjie)

Chat: http://discord.gg/graphile  
Slides: [https://graphile.org/ddgd](https://graphile.org/ddgd)  
All content is Copyright © 2018 Benjie Gillam
]

--
source-file: 020-main/0000-everything.md
source-line: 721

.superpowered[
\#sqlsuperpowered
]
