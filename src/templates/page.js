import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import ExamplesViewer from "../components/ExamplesViewer";
import ContactAndMailingList from "../components/ContactAndMailingList";

const sectionIs = desiredSection => ({ sectionId }) =>
  sectionId === desiredSection;

const AugmentedText = ({ children, noLink }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: processHTML(htmlerize(children), noLink),
    }}
  />
);

function PageList({ pages, location, depth = 0 }) {
  return (
    <ul className={`page-list nav flex-column ${depth === 0 ? "mb5" : null}`}>
      {pages.map(({ to, title, subpages }, idx) => (
        <li key={idx} className="f6 lh-copy pv1">
          <Link
            className={`nav-link ${location.pathname === to ? "active" : ""}`}
            to={to}
          >
            <AugmentedText>{title}</AugmentedText>
          </Link>
          {subpages && subpages.length ? (
            <PageList pages={subpages} location={location} depth={depth + 1} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const Nav = ({ sections, pages, location }) => (
  <aside className="sidebar col-xs-12 col-md-3 last-xs mt3">
    {sections.map(({ id, title }, idx) => (
      <section key={idx}>
        <h4 className="f6 ttu fw6 mt0 mb3 bb pb2">
          <AugmentedText>{title}</AugmentedText>
        </h4>
        <div className="nested-list-reset">
          <PageList location={location} pages={pages.filter(sectionIs(id))} />
        </div>
      </section>
    ))}
  </aside>
);

const tag = (name, label = name, noLink = false) =>
  `<${
    noLink ? "span" : "a href='/postgraphile/pricing/'"
  } class="plan-${name}"><span class='first-letter'>${
    label[0]
  }</span><span class='rest'>${label.substr(1)}</span></${
    noLink ? "span" : "a"
  }>`;

function processHTML(html, noLink) {
  return html
    .replace(/\[SUPPORTER\]/g, tag("supporter", "supporter", noLink))
    .replace(/\[PRO\]/g, tag("pro", "pro", noLink))
    .replace(/\[ENTERPRISE\]/g, tag("enterprise", "enterprise", noLink));
}

function htmlerize(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const Page = ({
  data: {
    remark: { html: rawHTML, frontmatter: { title, showExamples } },
    nav,
    examples,
  },
  location,
}) => {
  const html = processHTML(rawHTML);
  const [, navSection] = location.pathname.split("/");
  const thisNavEdge = nav.edges.find(
    ({ node: { name } }) => name === navSection
  );
  const thisNav = (thisNavEdge && thisNavEdge.node) || {
    pages: [],
    sections: [],
  };
  const navPages = thisNav.pages;
  const navSections = thisNav.sections || [];
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
  const isPostGraphileDocs = navSection === "postgraphile";

  return (
    <div
      className={`template-page ${
        location.pathname.match(/^\/postgraphile|news(\/|$)/)
          ? "postgraphile"
          : ""
      }`}
    >
      <Helmet
        title={`${isPostGraphileDocs ? "PostGraphile" : "Graphile"} | ${title}`}
        meta={[
          {
            name: "description",
            content: "Utilities to build powerful and performant GraphQL APIs",
          },
          {
            name: "keywords",
            content:
              "GraphQL, API, Graph, PostgreSQL, PostGraphile, PostGraphQL, Postgres-GraphQL, server, plugins, introspection, reflection",
          },
        ]}
      />
      <SiteHeader location={location} />
      <div className="page-content">
        <section>
          <div className="container">
            <div className="row between-xs">
              <Nav
                sections={navSections}
                pages={navPages}
                location={location}
              />
              <div className="col-xs-12 col-md-9 first-xs main-content">
                <div className="row">
                  <div className="col-xs-12" style={{ width: "100%" }}>
                    <div
                      className="edit-this-page"
                      style={{
                        display: location.pathname.match(/^\/news\//)
                          ? "none"
                          : "",
                      }}
                    >
                      <a
                        href={`https://github.com/graphile/graphile.github.io/edit/develop/src/pages${location.pathname.substr(
                          0,
                          location.pathname.length - 1
                        )}.md`}
                      >
                        📝 Suggest improvements to this page
                      </a>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </div>
                  <br />
                  {showExamples && <ExamplesViewer examples={examples} />}
                  <br />
                  <div className="col-xs-12 mt3 mb5">
                    <div className="row between-xs">
                      <div className="col-xs-6">
                        {prev ? (
                          <Link className="" to={prev}>
                            <span className="fas fa-fw fa-arrow-left" />{" "}
                            {prevText ? (
                              <AugmentedText noLink>{prevText}</AugmentedText>
                            ) : (
                              "Previous"
                            )}
                          </Link>
                        ) : null}
                      </div>
                      <div className="col-xs-6 tr">
                        {next ? (
                          <Link className="" to={next}>
                            {nextText ? (
                              <AugmentedText noLink>{nextText}</AugmentedText>
                            ) : (
                              "Next"
                            )}{" "}
                            <span className="fas fa-fw fa-arrow-right" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ContactAndMailingList />
      </div>
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
        showExamples
      }
    }
    nav: allNavJson {
      edges {
        node {
          id
          name
          sections {
            id
            title
          }
          pages {
            to
            title
            sectionId
            subpages {
              to
              title
              sectionId
            }
          }
        }
      }
    }
    examples: allExamplesJson {
      edges {
        node {
          id
          title
          examples {
            title
            query
            result
          }
        }
      }
    }
  }
`;
