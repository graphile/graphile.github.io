import React from "react";
import Link from "gatsby-link";

const Page = ({
  data: { remark: { html, frontmatter: { next, nextText, prev, prevText } } },
}) =>
  <div className="header container">
    <div className="row">
      <div dangerouslySetInnerHTML={{ __html: html }} />
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
