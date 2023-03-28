export const createSchemaCustomization = ({ actions }: { actions: any }) => {
  const { createTypes } = actions;
  const typeDefs = `
  type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      html: String
    }
    type Frontmatter {
      slug: String!
      title: String!
      date: Date @dateformat
    }
    `;
  createTypes(typeDefs);
};
