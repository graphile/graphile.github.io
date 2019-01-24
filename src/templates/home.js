import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";
import Link from "gatsby-link";
import { MailingList } from "../components/ContactAndMailingList";
import Layout from "../components/Layout";
import { graphql } from "gatsby";

function unindent(strings, ...vars) {
  if (vars.length) {
    throw new Error("We don't support vars right now");
  }
  const str = strings.join("");
  const lines = str.split("\n");
  let shortest = null;
  for (const line of lines) {
    const matches = line.match(/^( *)\S/);
    if (matches) {
      const [_, spaces] = matches;
      if (shortest === null || spaces.length < shortest.length) {
        shortest = spaces;
      }
    }
  }
  if (shortest) {
    return lines
      .map(line => line.substr(shortest.length))
      .join("\n")
      .replace(/\s+$/, "");
  } else {
    return str;
  }
}

class Home extends Component {
  render() {
    const {
      data: {
        remark: {
          html,
          frontmatter: { next, nextText, prev, prevText },
        },
      },
      location,
    } = this.props;
    return (
      <Layout {...this.props}>
        <div className="template-home">
          <Helmet
            title="PostGraphile | Instant, performant and extensible GraphQL API for your existing PostgreSQL database"
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
          <section className="top-section postgraphile">
            <div className="box-content">
              <Link to="/postgraphile/" className="logo" />
              <div className="text">
                <h1 className="mb3">
                  <Link className="inherit-color" to="/postgraphile/">
                    PostGraphile
                  </Link>
                </h1>
                <h3>Instant, secure and fast GraphQL API for Postgres</h3>
                <h4>
                  Builds and serves a client-facing GraphQL API by inspecting
                  your existing database (tables, columns, relations, views,
                  procedures and more). No GraphQL coding necessary!
                </h4>
                <p>
                  Works with Apollo, Relay Modern and most other GraphQL
                  clients. Enforce user permissions at the data level using
                  PostgreSQL's well established, granular and trusted Role-Based
                  Access Control (RBAC) and Row-Level Security (RLS) features.
                </p>
                <p>Run it now with one command:</p>
                <code>
                  <pre className="mb0">
                    {unindent`\
                  npx postgraphile -c postgres:///mydb\
                  `}
                  </pre>
                </code>
                <p className="mt0">
                  <small>
                    <em>
                      Requires Node.js 8.6+. No installation required (npx
                      performs a temporary install). Connection string is of the
                      format:
                      <code>
                        postgres://pg_user:pg_pass@pg_host:pg_port/pg_db
                      </code>
                    </em>
                  </small>
                </p>
                <Link className="button--solid" to="/postgraphile/">
                  More about PostGraphile{" "}
                  <span className="fas fa-fw fa-arrow-right" />
                </Link>
                <MailingList />
                <div className="mb4" />
              </div>
            </div>
          </section>
          <div className="bottom-section">
            <section className="box graphile">
              <div className="box-content">
                <Link to="/graphile-build/" className="logo" />
                <div className="text">
                  <h3>
                    <Link to="/graphile-build/" className="inherit-color">
                      Graphile Engine
                    </Link>
                  </h3>
                  <h4>High-performance pluggable GraphQL schema tools</h4>
                  <p>
                    Prefer building your GraphQL APIs by hand? Using our{" "}
                    <Link to="/graphile-build/look-ahead/">
                      look-ahead feature
                    </Link>{" "}
                    your code can know what's coming leading to fewer
                    round-trips and higher performance. Our{" "}
                    <Link to="/graphile-build/plugins/">
                      plugin architecture
                    </Link>{" "}
                    allows you to extend or enhance your GraphQL API as your
                    needs evolve.
                  </p>
                </div>
              </div>
              <div className="cta">
                <Link className="button--solid" to="/graphile-build/">
                  More about Graphile Engine{" "}
                  <span className="fas fa-fw fa-arrow-right" />
                </Link>
              </div>
            </section>
            <section className="box training">
              <div className="box-content">
                <a href="https://www.graphql-training.com" className="logo" />
                <div className="text">
                  <h3>GraphQL Training</h3>
                  <h4>GraphQL and PostGraphile training in UK and Europe.</h4>
                  <p>
                    By adopting GraphQL in your business you can innovate faster
                    and deliver better web experiences leading to increase
                    conversions, fewer lost sales due to bugs and higher search
                    engine ratings. Let us show you how.
                  </p>
                </div>
              </div>
              <div className="cta">
                <a
                  className="button--solid"
                  href="https://www.graphql-training.com/"
                >
                  More about GraphQL Training{" "}
                  <span className="fas fa-fw fa-arrow-right" />
                </a>
              </div>
            </section>
          </div>
          <SiteFooter />
        </div>
      </Layout>
    );
  }
}

Home.propTypes = {
  children: PropTypes.func,
};

export default Home;

export const pageQuery = graphql`
  query HomePageByPath($path: String!) {
    remark: markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`;
