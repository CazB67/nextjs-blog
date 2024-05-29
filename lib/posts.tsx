import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export type PostData = {
  id: string;
  title: string;
  date: string;
  contentHtml: string;
}

interface RawPostData {
  [key: string]: any; // This allows any additional properties in the markdown front-matter
}

// Get sorted posts data
export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    const data = matterResult.data as RawPostData;

    return {
      id,
      title: data.title,
      date: data.date,
      contentHtml: '',
    };
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Get all post IDs
export const getAllPostIds = (): { params: { id: string } }[] => {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, ''),
    },
  }));
}

// Get post data by ID
export const getPostData = async (id: string): Promise<PostData> => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);
  const data = matterResult.data as RawPostData;

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    title: data.title,
    date: data.date,
    contentHtml,
  };
}
