import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Layout from "../components/Layout";
import { graphql, Link } from "gatsby";

import "prismjs/themes/prism-solarizedlight.css";

class News extends Component {
  render() {
    const {
      data: {
        // remark: { html },
        allFile: { nodes: files },
      },
      location,
      history,
    } = this.props;
    return (
      <Layout {...this.props}>
        <div className={`template-page postgraphile`}>
          <Helmet
            title="Graphile | Powerful, Extensible and Performant GraphQL APIs Rapidly"
            meta={[
              {
                name: "description",
                content:
                  "Utilities to build powerful, performant and extensible GraphQL APIs rapidly",
              },
              {
                name: "keywords",
                content:
                  "GraphQL, API, Graph, PostgreSQL, PostGraphile, PostGraphQL, Postgres-GraphQL, server, plugins, introspection, reflection",
              },
            ]}
          />
          <SiteHeader location={location} history={history} />
          <div className="page-content">
            <section>
              <div class="container">
                <div class="row">
                  {files
                    .filter((file) => file.post.frontmatter.title.length > 0)
                    .map(({ post: post }) => {
                      return (
                        <div className="blog-file-preview" key={post.id}>
                          <h1>
                            <Link to={post.frontmatter.path}>
                              {post.frontmatter.title}
                            </Link>
                          </h1>
                          <h2>{post.frontmatter.date}</h2>
                          <p>{post.excerpt}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>
          </div>
          <SiteFooter />
        </div>
      </Layout>
    );
  }
}

News.propTypes = {
  children: PropTypes.func,
};

export const pageQuery = graphql`
  query NewsTemplateQuery($slug: String!) {
    remark: markdownRemark(frontmatter: { path: { eq: $slug } }) {
      html
      frontmatter {
        path
        title
      }
    }
    allFile(filter: { sourceInstanceName: { eq: "news" } }) {
      nodes {
        post: childMarkdownRemark {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
  }
`;

export default News;
