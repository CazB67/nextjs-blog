import Head from 'next/head';
import Layout, { siteTitle } from '../components/Layout/layout';
import Link from 'next/link';

import { getSortedPostsData, PostData } from '@/lib/posts';
import Date from '@/components/Date/date';
import utilStyles from '@/styles/utils.module.css'

interface HomeProps {
  allPostsData: PostData[];
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

const Home: React.FC<HomeProps> = ({ allPostsData }) => {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>A mum first and foremost exploring different interests and skills including React, Javascript, Typescript, Travel, CSS, Literacy education, sports and much more.</p>
        <p>
         This is a page to jot down down my random ramblings and play with css and Next.JS.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.paddingTop_1}`}>
        <h2 className={`${utilStyles.headingLg} ${utilStyles.fontWeight800}`}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
            <Link href={`/posts/${id}`}>{title}</Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
          </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export default Home;