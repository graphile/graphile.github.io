import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

import "prismjs/themes/prism-solarizedlight.css";

const Marketing = ({
  data: { remark: { html, frontmatter: { next, nextText, prev, prevText } } },
  location,
}) =>
  <div className="template-marketing">
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
            "GraphQL, API, Graph, PostgreSQL, PostGraphQL, server, plugins, introspection, reflection",
        },
      ]}
    />
    <SiteHeader location={location} />
    <div className="page-content" dangerouslySetInnerHTML={{ __html: html }} />
    <SiteFooter />
  </div>;

Marketing.propTypes = {
  children: PropTypes.func,
};

export default Marketing;

export const pageQuery = graphql`
  query MarketingPageByPath($path: String!) {
    remark: markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`;
