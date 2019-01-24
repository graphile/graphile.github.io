import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Layout from "../components/Layout";
import { graphql, StaticQuery } from "gatsby";

import "prismjs/themes/prism-solarizedlight.css";

class Marketing extends Component {
  state = {
    mailchimp: false,
  };
  componentDidMount() {
    setTimeout(this.mailchimpScript, 0);
  }
  mailchimpScript = () => {
    if (this.root.querySelector("#mc-embedded-subscribe-form")) {
      this.setState({ mailchimp: true });
    }
  };
  render() {
    const {
      data: {
        remark: { html },
      },
      location,
      history,
    } = this.props;
    return (
      <Layout {...this.props}>
        <div
          className={`template-marketing ${
            location.pathname.match(
              /^\/(postgraphile|news|support|sponsors?|)(\/|$)/
            )
              ? "postgraphile"
              : ""
          }`}
          ref={el => {
            this.root = el;
          }}
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
          >
            {this.state.mailchimp && (
              <script
                type="text/javascript"
                defer
                src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"
              />
            )}
            {this.state.mailchimp && (
              <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: `(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='BIRTHDAY';ftypes[3]='birthday';}(jQuery));var $mcj = jQuery.noConflict(true);`,
                }}
              />
            )}
          </Helmet>
          <SiteHeader location={location} history={history} />
          <div
            className="page-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <SiteFooter />
        </div>
      </Layout>
    );
  }
}

Marketing.propTypes = {
  children: PropTypes.func,
};

const MarketingWithData = props => (
  <StaticQuery
    variables={{
      path: props.location.pathname,
    }}
    query={graphql`
      query MarketingPageByPath($path: String!) {
        remark: markdownRemark(frontmatter: { path: { eq: $path } }) {
          html
          frontmatter {
            path
            title
          }
        }
      }
    `}
  >
    {data => <Marketing {...props} data={data} />}
  </StaticQuery>
);

export default MarketingWithData;
