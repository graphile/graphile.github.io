module.exports = {
  siteMetadata: {
    title: `GraphQL-Build`,
  },
  plugins: [
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
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          "gatsby-remark-autolink-headers",
          "gatsby-remark-images",
          "gatsby-remark-prismjs",
          // gatsby-typegen-remark-expo-autolink ???
        ],
      },
    },
    `gatsby-transformer-json`,
  ],
};
