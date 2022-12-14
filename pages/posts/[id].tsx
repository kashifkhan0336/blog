
import {
  GetStaticProps,
  GetStaticPaths,
  GetServerSideProps,
  GetStaticPropsResult,
  NextPage,
  InferGetStaticPropsType,
  GetStaticPropsContext,
} from "next";
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import client from "../../apollo-client";
import { graphql } from "../../src/gql";
import { ParsedUrlQuery } from "querystring";
import TestComponent from '../components/Test';
const components = { TestComponent }
const PostPage = ({ post, mdx }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <h1>{post.postTitle}</h1>
      <br />
      <MDXRemote {...mdx} components={components} />
    </div>
  )
};
export default PostPage;
interface IParams extends ParsedUrlQuery {
  id: string;
}
interface IPost {

    id: string;
    postTitle: string;
    post_content: string;
    publishedAt: string;
}
interface PropsType  {
    post: IPost
    mdx: MDXRemoteSerializeResult
};
type ParamsType = ParsedUrlQuery & {
    params: { id: string }
};
export const getStaticProps: GetStaticProps<PropsType, ParamsType> = async (context: GetStaticPropsContext) => {
  const { id } = context.params as IParams;
  const GET_SINGLE_POST = graphql(`
    query Post_($where: PostWhereUniqueInput!) {
      post(where: $where) {
        postTitle
        post_content
        publishedAt
      }
    }
  `);
  const { data } = await client.query({
    query: GET_SINGLE_POST,
    variables: {
      where: {
        postSlug: id,
      },
    },
  });
  const { post_content } = data.post as IPost;
  const mdxSource = await serialize(post_content);
  console.log(mdxSource)
  return {
    props: {
      post: data.post,
      mdx: mdxSource
    },
  };
};

export const getStaticPaths = async () => {
  const GET_POSTS_SLUGS = graphql(`
    query Slugs {
      posts {
        id
        postSlug
      }
    }
  `);
  const { data } = await client.query({
    query: GET_POSTS_SLUGS,
  });
  const paths = data.posts.map(function (post) {
    return { params: { id: post.postSlug } };
  });

  return {
    paths: paths,
    fallback: false,
  };
};
