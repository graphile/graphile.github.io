import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";

const Header = () =>
  <div
    style={{
      background: "#424",
      marginBottom: "1.45rem",
    }}
  >
    <div
      style={{
        margin: "0 auto",
        maxWidth: 960,
        padding: "1.45rem 1.0875rem",
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          GraphQL-Build
        </Link>
      </h1>
    </div>
  </div>;

const Page = ({
  data: { remark: { html, frontmatter: { next, nextText, prev, prevText } } },
}) =>
  <div className="header container">
    <Helmet
      title="graphql-build"
      meta={[
        { name: "description", content: "TODO" },
        { name: "keywords", content: "TODO" },
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
    <Header />
    <div
      style={{
        margin: "0 auto",
        maxWidth: 960,
        padding: "0px 1.0875rem 1.45rem",
        paddingTop: 0,
      }}
    >
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
  </div>;

export default Page;

export const pageQuery = graphql`
  query PageByPath($path: String!) {
    remark: markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
        next
        nextText
        prev
        prevText
      }
    }
  }
`;
