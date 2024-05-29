import Layout from "../../components/Layout/layout";
import Head from "next/head";
import { getAllPostIds, getPostData, PostData } from "../../lib/posts";
import Date2 from "../../components/Date/date";
import utilStyles from "../../styles/utils.module.css";
import Comments from "../../components/Comments/comments";
import { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext } from "next";

// Define the types for the props
interface PostProps {
  postData: PostData;
}

// Explicitly define the type for params
export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  
  if (!params?.id) {
    return {
      notFound: true,
    };
  }

  const postData = await getPostData(params.id as string);
  return {
    props: {
      postData,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

const Post: React.FC<PostProps> = ({ postData }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    if (postData.contentHtml) {
      // Modify the HTML content to add target="_blank" to all anchor tags
      const modifiedHtml = postData.contentHtml
        .replace(/<a /g, '<a target="_blank" ')
        .replace('<p><img', `<div class=${utilStyles.imageContainer}><img`)
        .replace('wattle"></p>', 'wattle"></div>');

      setHtmlContent(modifiedHtml);
    }
  }, [postData.contentHtml]);

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingLg}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date2 dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <Comments postData={postData} />
      </article>
    </Layout>
  );
};

export default Post;
