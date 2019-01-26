import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Layout from "../components/Layout";
import { graphql, StaticQuery } from "gatsby";

import "prismjs/themes/prism-solarizedlight.css";

export default class MarketingLayout extends Component {
  render() {
    const { location, history, children, blue } = this.props;
    return (
      <Layout {...this.props}>
        <div
          className={`template-marketing ${
            // /^\/(postgraphile|news|support|sponsors?|)(\/|$)/
            blue ? "postgraphile" : ""
          }`}
        >
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
          <div className="page-content">{children}</div>
          <SiteFooter />
        </div>
      </Layout>
    );
  }
}
