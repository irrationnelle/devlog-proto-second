import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { graphql, Link } from "gatsby";
// @ts-ignore
import Layout from "../components/layout";
import {
  flexColumnWithGap,
  fontMedium,
  noVerticalMargin,
} from "../styles/f.css";

const IndexPage: React.FC<PageProps & { data: GatsbyTypes.Query }> = ({
  data,
}) => {
  const {
    allMarkdownRemark: { edges },
    site,
  } = data;

  return (
    <Layout>
      <h1 className={noVerticalMargin}>
        {site?.siteMetadata?.title ?? "irrationnelle"}
      </h1>
      <ul className={flexColumnWithGap}>
        {edges.map((edge: any) => (
          <li className={fontMedium} key={edge.node.frontmatter.slug}>
            <Link to={`/blog/${edge.node.frontmatter.slug}`}>
              {edge.node.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>irrationnelle</title>;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            slug
          }
        }
      }
    }
  }
`;
