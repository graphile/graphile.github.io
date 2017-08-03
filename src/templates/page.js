import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const sectionIs = desiredSection => ({ section }) => section === desiredSection;

function PageList({ navs, location }) {
  return (
    <ul className="nav flex-column">
      {navs.map(({ to, title }) =>
        <li key={to} className="nav-item">
          <Link
            className={`nav-link ${location.pathname === to ? "active" : ""}`}
            to={to}
          >
            {title}
          </Link>
        </li>
      )}
    </ul>
  );
}

const Page = ({
  data: { remark: { html, frontmatter: { title } }, nav },
  location,
}) => {
  const thisNav = nav.edges.find(
    ({ node: { name } }) => name === "graphile-build"
  ).node;
  const navPages = thisNav.pages;
  const currentIndex = navPages.findIndex(({ to }) => to === location.pathname);
  let next, nextText, prev, prevText;
  if (currentIndex > 0) {
    prev = navPages[currentIndex - 1].to;
    prevText = navPages[currentIndex - 1].title;
  }
  if (currentIndex >= 0 && currentIndex < navPages.length - 1) {
    next = navPages[currentIndex + 1].to;
    nextText = navPages[currentIndex + 1].title;
  }

  return (
    <div className="template-page">
      <Helmet
        title={`Graphile | ${title}`}
        meta={[
          {
            name: "description",
            content: "Utilities to build powerful and performant GraphQL APIs",
          },
          {
            name: "keywords",
            content:
              "GraphQL, API, Graph, PostgreSQL, PostGraphQL, server, plugins, introspection, reflection",
          },
        ]}
      />
      <SiteHeader location={location} />
      <section
        style={{
          margin: "0 auto",
          maxWidth: 960,
          padding: "0px 1.0875rem 1.45rem",
          paddingTop: 0,
        }}
        className="page-content"
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-3 push-md-9">
              <h4>Guides</h4>
              <PageList
                location={location}
                navs={navPages.filter(sectionIs("guides"))}
              />
              <h4>Library Reference</h4>
              <PageList
                location={location}
                navs={navPages.filter(sectionIs("library-reference"))}
              />
              <h4>Plugin Reference</h4>
              <PageList
                location={location}
                navs={navPages.filter(sectionIs("plugin-reference"))}
              />
            </div>
            <div className="col-12 col-md-9 pull-md-3">
              <div className="container">
                <div className="row">
                  <div
                    dangerouslySetInnerHTML={{ __html: html }}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="row">
                  {prev
                    ? <Link className="btn btn-secondary btn-large" to={prev}>
                        &laquo; {prevText || "Previous"}
                      </Link>
                    : null}
                  <div className="ml-auto">
                    {next
                      ? <Link className="btn btn-primary btn-large" to={next}>
                          {nextText || "Next"} &raquo;
                        </Link>
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
};

export default Page;

export const pageQuery = graphql`
  query PageByPath($path: String!) {
    remark: markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
    nav: allNavJson {
      edges {
        node {
          id
          name
          pages {
            to
            title
            section
          }
        }
      }
    }
  }
`;
