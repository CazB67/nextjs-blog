import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.css";
import utilStyles from '@/styles/utils.module.css'
import Link from "next/link";
import { ReactNode } from "react";

const name = "Caroline Bates";
export const siteTitle = "Blog";

interface LayoutProps {
  children: ReactNode;
  home?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, home }) => {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Blog using Next.js" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        <Link href="/" className={`${home ? utilStyles.noLink : utilStyles.colorInherit}`}>
          <div className={utilStyles.textBlock}>
            <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={108}
              width={108}
              alt="Photo of Caroline Bates smiling"
            />
            <div className={utilStyles.columnWrapper}>
              <h1 className={utilStyles.heading2Xl}>{name}</h1>
              <h2 className={utilStyles.headingXl}>A Blog</h2>
            </div>
          </div>
        </Link>
      </header>
      <main>{children}</main>
      {!home ? (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      ) : (
        <Image
          priority
          src="/images/kili.jpg"
          className={utilStyles.bgImage}
          height={810}
          width={1080}
          alt="View of Kilimanjaro"
        />
      )}
    </div>
  );
}

export default Layout;
