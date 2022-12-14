import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import client from "../apollo-client";
import Link from "next/link";
import { graphql } from "../src/gql";
export default function Home(props: Props): JSX.Element {
  return (
    <div>
      {props.posts.map((t: Post) => (
        <Link href={"posts/" + t.postSlug.toLowerCase()} key={t.id}>
          {t.postTitle}
        </Link>
      ))}
    </div>
  );
}
interface Post {
  id: string;
  postSlug: string;
  postTitle: string;
  post_content: string;
  publishedAt?: any;
}
type posts = Post[]
interface Props{
  posts: posts
}
export const getStaticProps: GetStaticProps = async (context) => {
  const GET_POSTS = graphql(`
    query Posts {
      posts {
        id
        postSlug
        postTitle
        post_content
        publishedAt
      }
    }
  `);
  const { data } = await client.query({
    query: GET_POSTS,
  });


  return {
    props: {
      posts: data.posts,
    },
  };
};
