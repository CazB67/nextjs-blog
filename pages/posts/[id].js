import Layout from "../../components/layout";
import Head from "next/head";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Date2 from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import Comments from "../../components/Comments/comments";


export async function getStaticProps({ params }) {
  // Add the "await" keyword like this:
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {

  return (
    <Layout>
      {/* Add this <Head> tag */}
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date2 dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        <Comments postData={postData}/>
      </article>
    </Layout>
  );
}
