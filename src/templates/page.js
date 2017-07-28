import React from 'react'
import Link from 'gatsby-link'

const Page = ({data: {remark: {html }}}) => (
  <div class="header container">
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </div>
)

export default Page

export const pageQuery = graphql`
query PageByPath($path: String!) {
  remark: markdownRemark(frontmatter: {path: {eq: $path}}) {
    html
    frontmatter {
      path
      title
    }
  }
}
`;
