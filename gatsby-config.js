module.exports = {
  siteMetadata: {
    title: `Graphile.org`,
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
    /*
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
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes
                .filter((node) => {
                  // TODO
                  return true;
                })
                .map((node) => {
                  return Object.assign({}, node.frontmatter, {
                    description: node.excerpt,
                    date: node.frontmatter.date,
                    url: site.siteMetadata.siteUrl + node.fields.slug,
                    guid: site.siteMetadata.siteUrl + node.fields.slug,
                    custom_elements: [{ "content:encoded": node.html }],
                  });
                });
            },
            query: `{
              allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
                nodes {
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
            }`,
            output: "/rss.xml",
            title: "Graphile News",
          },
        ],
      },
    },
    */
  ],
};
