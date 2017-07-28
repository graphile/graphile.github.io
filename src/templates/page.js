import React from "react";
import Link from "gatsby-link";

const Page = ({
  data: { remark: { html, frontmatter: { next, nextText } } },
}) =>
  <div className="header container">
    <div dangerouslySetInnerHTML={{ __html: html }} />
    {next
      ? <Link className="btn btn-primary btn-large" to={next}>
          {nextText || "Next"} &raquo;
        </Link>
      : null}
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
      }
    }
  }
`;
