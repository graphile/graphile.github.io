---
layout: page
path: /postgraphile/examples/
title: PostGraphile examples
---

<ul><li>basic<ul><li>forum-by-slug.graphql</li>
<li>forums.graphql</li></ul></li></ul>
<div class='example-graphql' id='${id}'>
<div className='example-graphql-query'><pre><code>{
  forumBySlug(slug: "slug-life") {
    nodeId
    id
    slug
    name
    description
    createdAt
    updatedAt
  }
}
</code></pre></div>
<div className='example-graphql-result'><pre><code>{
  "forumBySlug": {
    "nodeId": "WyJmb3J1bXMiLDNd",
    "id": 3,
    "slug": "slug-life",
    "name": "Slug Life",
    "description": "",
    "createdAt":
      "2018-07-19T16:15:19.020597+00:00",
    "updatedAt":
      "2018-07-19T16:15:19.020597+00:00"
  }
}
</code></pre></div>
</div>
<div class='example-graphql' id='${id}'>
<div className='example-graphql-query'><pre><code>{
  allForums {
    nodes {
      nodeId
      id
      slug
      name
      description
      createdAt
      updatedAt
    }
  }
}
</code></pre></div>
<div className='example-graphql-result'><pre><code>{
  "allForums": {
    "nodes": [
      {
        "nodeId": "WyJmb3J1bXMiLDFd",
        "id": 1,
        "slug": "cat-life",
        "name": "Cat Life",
        "description":
          "A forum all about cats and how fluffy they are and how they completely ignore their owners unless there is food. Or yarn.",
        "createdAt":
          "2018-07-19T16:15:19.020597+00:00",
        "updatedAt":
          "2018-07-19T16:15:19.020597+00:00"
      },
      {
        "nodeId": "WyJmb3J1bXMiLDJd",
        "id": 2,
        "slug": "dog-life",
        "name": "Dog Life",
        "description": "",
        "createdAt":
          "2018-07-19T16:15:19.020597+00:00",
        "updatedAt":
          "2018-07-19T16:15:19.020597+00:00"
      },
      {
        "nodeId": "WyJmb3J1bXMiLDNd",
        "id": 3,
        "slug": "slug-life",
        "name": "Slug Life",
        "description": "",
        "createdAt":
          "2018-07-19T16:15:19.020597+00:00",
        "updatedAt":
          "2018-07-19T16:15:19.020597+00:00"
      }
    ]
  }
}
</code></pre></div>
</div>
