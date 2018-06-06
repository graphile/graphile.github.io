import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";

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
        remark: { html, frontmatter: { next, nextText, prev, prevText } },
      },
      location,
    } = this.props;
    return (
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
          <div className="content">
            <div className="logo" />
            <div className="text">
              <h2>PostGraphile</h2>
              <h3>
                Instant, secure and fast GraphQL API for your Postgres database
              </h3>
              <p>
                Map your existing database (including tables, columns,
                relations, procedures and more) into a GraphQL API server with
                just one command. Secure your data with PostgreSQL's well
                established and trusted Role-Based Access Control (RBAC) and
                Row-Level Security (RLS) features.
              </p>
              <code>
                <pre>
                  {unindent`\
                  npx postgraphile --connection \\
                    postgres://localhost/mydb \\
                    --watch
                  `}
                </pre>
              </code>
              <a className="button--solid" href="/postgraphile/">
                More about PostGraphile{" "}
                <span className="fa fa-fw fa-long-arrow-right" />
              </a>
            </div>
          </div>
        </section>
        <section className="bottom-section">
          <div
            className="page-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </section>
        <SiteFooter />
      </div>
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
