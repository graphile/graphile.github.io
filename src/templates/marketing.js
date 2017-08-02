import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

import "prismjs/themes/prism-solarizedlight.css";

import "./marketing.css";

const Marketing = ({
  data: { remark: { html, frontmatter: { next, nextText, prev, prevText } } },
  location,
}) =>
  <div>
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
    >
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
        integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
        crossOrigin="anonymous"
      />
      <script
        src="https://code.jquery.com/jquery-3.1.1.slim.min.js"
        integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n"
        crossOrigin="anonymous"
      />
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js"
        integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb"
        crossOrigin="anonymous"
      />
      <script
        src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js"
        integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn"
        crossOrigin="anonymous"
      />
    </Helmet>
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
