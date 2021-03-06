import React from "react";
import { Link, graphql, useStaticQuery } from "gatsby";

// import Bio from "../components/bio" TODO: same as below
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import Tags from "../components/Tags";
import Card from "../components/Card";
import styled from "styled-components";
import { useSiteMetadata } from "../queries/useSiteMetadata";
import { Node } from "../utils/types";

const StyledLink = styled(Link)`
  box-shadow: none;
`;

const StyledH2 = styled.h2`
  margin-top: 0;
`;

interface Props {
  location: Record<string, string>;
}

const InfoIndex: React.FC<Props> = ({ location }) => {
  const siteTitle = useSiteMetadata().title;
  const query = useStaticQuery(
    graphql`
      query {
        allMdx(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { fileAbsolutePath: { regex: "/info/" } }
        ) {
          edges {
            node {
              excerpt
              fields {
                slug
              }
              frontmatter {
                date(formatString: "DD MMMM, YYYY")
                title
                description
                tags
              }
            }
          }
        }
      }
    `
  );
  const posts = query.allMdx.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Info" />
      {/* <Bio />  TODO: Uncomment this after making a working bio component*/}
      {posts.map(({ node }: { node: Node }) => {
        const title = node.frontmatter.title || node.fields.slug;
        const tags = node.frontmatter.tags;
        return (
          <Card big>
            <article key={node.fields.slug}>
              <small>{node.frontmatter.date}</small>
              {tags && tags.length > 0 ? ` - ` : ``}
              <Tags tags={tags} />
              <StyledH2>
                <StyledLink to={node.fields.slug}>{title}</StyledLink>
              </StyledH2>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </section>
            </article>
          </Card>
        );
      })}
    </Layout>
  );
};

export default InfoIndex;
