const path = require("path");

exports.createPages = async ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const layouts = {
    page: path.resolve(`src/templates/page.js`),
    marketing: path.resolve(`src/templates/marketing.js`),
  };

  const result = await graphql(`{
      allMarkdownRemark(
        limit: 1000
      ) {
        edges {
          node {
            id
            excerpt(pruneLength: 250)
            frontmatter {
              path
              title
              layout
            }
          }
        }
      }
    }`);
  if (result.errors) {
    const error = new Error("GraphQL query failed");
    error.errors = result.errors;
    throw error;
  }
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: layouts[node.frontmatter.layout] || layouts.page,
      context: {
        layout: node.frontmatter.layout,
      },
    });
  });
};
