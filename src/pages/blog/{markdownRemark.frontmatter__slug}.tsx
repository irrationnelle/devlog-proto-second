import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../../components/layout";

import { noVerticalMargin } from "../../styles/f.css";

export default function BlogPostTemplate({ data }: { data: any }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  return (
    <Layout>
      <h1 className={noVerticalMargin}>{frontmatter.title}</h1>
      <p>{frontmatter.date}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  );
}

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        slug
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;
