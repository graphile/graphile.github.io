module.exports = {
  siteMetadata: {
    title: `Graphile.org`,
    description:
      "Community funded open source utilities to build powerful, performant and extensible applications rapidly",
    siteUrl: "https://graphile.org",
  },
  plugins: [
    `gatsby-plugin-mdx`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: `pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data`,
        name: `data`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/news`,
        name: `news`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        tableOfContents: {
          heading: null,
          maxDepth: 5,
        },
        plugins: [
          "gatsby-remark-autolink-headers",
          "gatsby-remark-images",
          "gatsby-remark-prismjs",
          // gatsby-typegen-remark-expo-autolink ???
        ],
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allFile } }) => {
              return allFile.nodes.map(({ post: node }) => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                });
              });
            },
            query: /* GraphQL */ `
              {
                allFile(
                  filter: { sourceInstanceName: { eq: "news" } }
                  sort: {
                    fields: childMarkdownRemark___frontmatter___date
                    order: DESC
                  }
                ) {
                  nodes {
                    post: childMarkdownRemark {
                      excerpt
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/news/rss.xml",
            title: "Graphile News",
            // Which URLs to advertise on?
            // match: "^/news($|/)",
            // optional configuration to specify external rss feed, such as feedburner
            // link: "https://feeds.feedburner.com/gatsby/blog",
          },
        ],
      },
    },
  ],
};
