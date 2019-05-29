const path = require("path");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const layouts = {
    page: path.resolve(`src/templates/page.js`),
    marketing: path.resolve(`src/templates/marketing.js`),
    home: path.resolve(`src/templates/home.js`),
  };

  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            excerpt(pruneLength: 250)
            frontmatter {
              path
              title
              layout
              is404
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    const error = new Error("GraphQL query failed");
    console.error(result, { depth: 6 });
    error.errors = result.errors;
    throw error;
  }
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    if (node.frontmatter.is404) {
      return;
    }
    if (!node.frontmatter.path) {
      console.error("No path for ", node);
      return;
    }
    createPage({
      path: node.frontmatter.path,
      component: layouts[node.frontmatter.layout] || layouts.page,
      context: {
        slug: node.frontmatter.path,
        layout: node.frontmatter.layout || "page",
      },
    });
  });
};

// The import from `$components/*`
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      //modules: [path.resolve(__dirname, "src"), "node_modules"],
      alias: {
        $components: path.resolve(__dirname, "src/components"),
        $images: path.resolve(__dirname, "src/images"),
      },
    },
  });
};
