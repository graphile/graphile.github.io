import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const sectionIs = desiredSection => ({ sectionId }) =>
  sectionId === desiredSection;

const AugmentedText = ({ children, noLink }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: processHTML(htmlerize(children), noLink),
    }}
  />
);

function PageList({ navs, location }) {
  return (
    <ul className="page-list nav flex-column mb5">
      {navs.map(({ to, title }, idx) => (
        <li key={idx} className="f6 lh-copy pv1">
          <Link
            className={`nav-link ${location.pathname === to ? "active" : ""}`}
            to={to}
          >
            <AugmentedText>{title}</AugmentedText>
          </Link>
        </li>
      ))}
    </ul>
  );
}

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
  data: { remark: { html: rawHTML, frontmatter: { title } }, nav },
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
        location.pathname.match(/^\/postgraphile(\/|$)/) ? "postgraphile" : ""
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
              <aside className="sidebar col-xs-12 col-md-3 last-xs mt3">
                {navSections.map(({ id, title }, idx) => (
                  <section key={idx}>
                    <h4 className="f6 ttu fw6 mt0 mb3 bb pb2">
                      <AugmentedText>{title}</AugmentedText>
                    </h4>
                    <div className="nested-list-reset">
                      <PageList
                        location={location}
                        navs={navPages.filter(sectionIs(id))}
                      />
                    </div>
                  </section>
                ))}
              </aside>
              <div className="col-xs-12 col-md-7 col-md-offset-1 first-xs main-content">
                <div className="row">
                  <div
                    className="col-xs-12"
                    dangerouslySetInnerHTML={{ __html: html }}
                    style={{ width: "100%" }}
                  />
                  <br />
                  <br />
                  <div className="col-xs-12 mt3 mb5">
                    <div className="row between-xs">
                      <div className="col-xs-6">
                        {prev ? (
                          <Link className="" to={prev}>
                            <span className="fa fa-fw fa-long-arrow-left" />{" "}
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
                            <span className="fa fa-fw fa-long-arrow-right" />
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

        <section className="mailinglist">
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <div className="hero-block">
                  <h3>
                    Questions, comments or feedback?
                    <br />
                    Email{" "}
                    <a href="mailto:info@graphile.org?subject=Graphile%20question/comment/feedback:)">
                      info@graphile.org
                    </a>
                  </h3>

                  <form
                    action="//graphile.us16.list-manage.com/subscribe/post?u=d103f710cf00a9273b55e8e9b&amp;id=c3a9eb5c4e"
                    method="post"
                    id="mc-embedded-subscribe-form"
                    name="mc-embedded-subscribe-form"
                    className="validate"
                    target="_blank"
                    noValidate
                  >
                    <div id="mc_embed_signup_scroll" className="center hero-block">
                      <p>
                        Keep up to date on Graphile and PostGraphile
                        features/changes. Subscribe to our occasional
                        announcements newsletter:
                      </p>
                      <div className="mc-field-group form-inline justify-content-center">
                        <div className="form-group">
                          <div className="mb2">
                            <label className="label--small" htmlFor="mce-EMAIL">
                              Email address:
                            </label>
                          </div>
                          <input
                            autoCapitalize="off"
                            autoComplete="off"
                            autoCorrect="off"
                            className="input-text mb0-ns mb1"
                            id="mce-EMAIL"
                            name="EMAIL"
                            spellCheck="false"
                            type="email"
                            value=""
                          />
                          {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                          <div
                            style={{position: 'absolute', left: '-5000px'}}
                            aria-hidden="true"
                          >
                            <input
                              type="text"
                              name="b_d103f710cf00a9273b55e8e9b_c3a9eb5c4e"
                              tabIndex="-1"
                              value=""
                            />
                          </div>
                          <input
                            className="button--solid"
                            id="mc-embedded-subscribe"
                            name="subscribe"
                            type="submit"
                            value="Subscribe"
                          />
                        </div>
                        <div id="mce-responses" className="clear">
                          <div
                            className="response"
                            id="mce-error-response"
                            style={{display:'none'}}
                          />
                          <div
                            className="response"
                            id="mce-success-response"
                            style={{display:'none'}}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
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
          }
        }
      }
    }
  }
`;
