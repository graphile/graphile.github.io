import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import ExamplesViewer from "../components/ExamplesViewer";
import ContactAndMailingList from "../components/ContactAndMailingList";
import Layout from "../components/Layout";
import { graphql } from "gatsby";

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

const tag = (
  name,
  label = name,
  noLink = false,
  linkTarget = "/postgraphile/pricing/"
) =>
  `<${
    noLink ? "span" : "a href='" + linkTarget + "'"
  } class="plan-${name}"><span class='first-letter'>${
    label[0]
  }</span><span class='rest'>${label.substr(1)}</span></${
    noLink ? "span" : "a"
  }>`;

function processHTML(html, noLink) {
  return html
    .replace(/\[SPON\]/g, tag("sponsor", "spon", noLink, "/sponsor/"))
    .replace(/\[SUPPORTER\]/g, tag("supporter", "supporter", noLink))
    .replace(/\[PRO\]/g, tag("pro", "pro", noLink))
    .replace(/\[ENTERPRISE\]/g, tag("enterprise", "enterprise", noLink))
    .replace(/^.* Gallery$/g, "<strong>$&</strong>");
}
function processTableOfContents(html) {
  if (!html) return null;
  return html
    .replace(/\bPostgreSQL\b/g, "PG")
    .replace(/\b([A-Z_]{5,})\b(?!<)/g, "<span class='allcaps'>$1</span>")
    .replace(/(&#x3C;\/?code[^>]*>[^()]+)\([^)]*\)(&#)/g, "$1(...)$2")
    .replace(/&#x3C;(\/?code)[^>]*>/g, "<$1>");
}

function htmlerize(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const getNextPrev = (nav, pathname) => {
  const allPages = nav.reduce((memo, page) => {
    memo.push(page);
    if (page.subpages) {
      memo.push(...page.subpages);
    }
    return memo;
  }, []);
  const currentPage = allPages.find(({ to }) => to === pathname);
  if (!currentPage) {
    return {};
  }
  const currentIndex = allPages.indexOf(currentPage);
  let next, nextText, prev, prevText;
  if (currentIndex > 0) {
    prev = allPages[currentIndex - 1].to;
    prevText = allPages[currentIndex - 1].title;
  }
  if (currentIndex >= 0 && currentIndex < allPages.length - 1) {
    next = allPages[currentIndex + 1].to;
    nextText = allPages[currentIndex + 1].title;
  }
  return { next, nextText, prev, prevText };
};

class Page extends React.Component {
  state = {
    /*
     * So... On production, if you load a page with a code sample containing <span
     * class="gatsby-highlight-code-line"> then that span will be removed, and thus
     * all the line breaks in highlighted areas of your code will be missing. But
     * React still believe it's rendering it, and SSR definitely rendered it, so
     * I've no idea where it actually goes. And of course you can't reproduce it on
     * development. And if you navigate to the page it's fine - it's only when you
     * link to it directly that it goes wrong. Sense: it makes none. Anyway, this
     * hack might fix it... 🤷‍♂️
     */
    hack: 1,
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({ hack: 2 });
    }, 0);
  }
  render() {
    const {
      data: {
        remark: {
          html: rawHTML,
          tableOfContents: rawTableOfContents,
          timeToRead,
          frontmatter: { title, fullTitle, showExamples, noToc },
        },
        nav,
        examples,
      },
      location,
      history,
    } = this.props;
    const tableOfContents =
      !noToc && timeToRead > 1
        ? processTableOfContents(rawTableOfContents)
        : null;
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

    const { next, nextText, prev, prevText } = getNextPrev(
      navPages,
      location.pathname
    );

    const isPostGraphileDocs = navSection === "postgraphile";

    return (
      <Layout {...this.props}>
        <div
          className={`template-page ${
            location.pathname.match(
              /^\/(postgraphile|news|support|sponsors?)(\/|$)/
            )
              ? "postgraphile"
              : ""
          }`}
        >
          <Helmet
            title={`${
              isPostGraphileDocs ? "PostGraphile" : "Graphile"
            } | ${title}`}
            meta={[
              {
                name: "description",
                content:
                  "Utilities to build powerful and performant GraphQL APIs",
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
              <div
                style={{
                  display: location.pathname.match(/^\/news\//) ? "none" : "",
                  textAlign: "center",
                }}
              >
                <div
                  className="book-a-call"
                  style={{
                    backgroundColor: "#2d80d3",
                    color: "white",
                    padding: "0.25rem",
                  }}
                >
                  Need help or advice? We now offer Development Support, direct
                  from the maintainer{" "}
                  <Link
                    className="button--outline"
                    to="/support/"
                    style={{ backgroundColor: "white", margin: "0.25rem" }}
                  >
                    Get support
                  </Link>
                </div>
              </div>
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
                        {tableOfContents && (
                          <div
                            key={String(this.state.hack) + "_toc"}
                            className="toc"
                          >
                            <h4>Table of Contents</h4>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: tableOfContents,
                              }}
                            />
                          </div>
                        )}
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
                            📝 Suggest improvement/edit this page
                          </a>
                        </div>
                        <h2 className="mt3">{fullTitle || title}</h2>
                        <div
                          key={this.state.hack}
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      </div>
                      <br />
                      {showExamples && (
                        <ExamplesViewer
                          examples={examples.edges
                            .filter(
                              ({ node }) => node.category === showExamples
                            )
                            .map(({ node }) => node)}
                        />
                      )}
                      <br />
                      <div className="col-xs-12 mt3 mb5">
                        <div className="row between-xs">
                          <div className="col-xs-6">
                            {prev ? (
                              <Link className="" to={prev}>
                                <span className="fas fa-fw fa-arrow-left" />{" "}
                                {prevText ? (
                                  <AugmentedText noLink>
                                    {prevText}
                                  </AugmentedText>
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
                                  <AugmentedText noLink>
                                    {nextText}
                                  </AugmentedText>
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
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query PageByPath($slug: String!) {
    remark: markdownRemark(frontmatter: { path: { eq: $slug } }) {
      html
      tableOfContents
      timeToRead
      frontmatter {
        path
        title
        fullTitle
        showExamples
        noToc
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
          category
          id
          title
          examples {
            title
            example
            exampleLanguage
            result
            resultLanguage
          }
        }
      }
    }
  }
`;

export default Page;
