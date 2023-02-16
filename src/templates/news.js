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
      pageContext: { numPages, currentPage },
    } = this.props;

    const prevUrl =
      currentPage > 2
        ? `/news/${currentPage - 1}`
        : currentPage === 2
        ? `/news`
        : null;
    const nextUrl = currentPage < numPages ? `/news/${currentPage + 1}` : null;

    return (
      <Layout {...this.props}>
        <div className={`template-marketing postgraphile`}>
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
            <header class="hero simple">
              <div class="container">
                <div class="row">
                  <div class="col-xs-12">
                    <div class="hero-block">
                      <h1> Graphile Announcements</h1>
                      <h3>
                        The latest news on PostGraphile and the Graphile suite
                      </h3>
                      <br />
                      <div class="flex">
                        <a
                          class="button--solid-light"
                          href="/news/20221020-development-support/"
                        >
                          Latest Announcement{" "}
                          <span class="fas fa-fw fa-arrow-right" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {files.map(({ post: post }) => {
              return (
                <section>
                  <div class="container">
                    <div class="row flex-wrap-reverse">
                      <div class="text-center col-xs-12 col-md-9 col-lg-7">
                        <div className="blog-file-preview" key={post.id}>
                          <h2>
                            <Link to={post.frontmatter.path}>
                              {post.frontmatter.title}
                            </Link>
                          </h2>
                          <h3>{post.frontmatter.date}</h3>
                          <p>{post.excerpt}</p>
                        </div>{" "}
                      </div>
                      <div class="text-center col-xs-12 col-md-3 col-lg-5">
                        <img
                          src={post.frontmatter.thumbnail}
                          alt={post.frontmatter.thumbnailAlt}
                          style={{ maxHeight: 200 }}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}

            <footer>
              {prevUrl ? <Link to={prevUrl}>&laquo; Previous</Link> : null}
              {prevUrl && nextUrl ? " | " : null}
              {nextUrl ? <Link to={nextUrl}>Next &raquo;</Link> : null}
            </footer>
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
  query NewsTemplateQuery($limit: Int!, $skip: Int!) {
    allFile(
      filter: { sourceInstanceName: { eq: "news" } }
      sort: { fields: childMarkdownRemark___frontmatter___date, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        post: childMarkdownRemark {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
            thumbnail
            thumbnailAlt
          }
        }
      }
    }
  }
`;

export default News;
