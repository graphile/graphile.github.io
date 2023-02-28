const path = require("path");
//const { createFilePath } = require(`gatsby-source-filesystem`);

const postsPerPage = 8;

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const layouts = {
    page: path.resolve(`src/templates/page.js`),
    marketing: path.resolve(`src/templates/marketing.js`),
    news: path.resolve(`src/templates/news.js`),
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
      news: allFile(filter: { sourceInstanceName: { eq: "news" } }) {
        totalCount
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

  // Create blog-list pages
  const postCount = result.data.news.totalCount;
  const numPages = Math.ceil(postCount / postsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/news` : `/news/${i + 1}`,
      component: path.resolve("./src/templates/news.js"),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions /*, getNode*/ }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    //const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value: node.frontmatter.path,
    });
  }
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
