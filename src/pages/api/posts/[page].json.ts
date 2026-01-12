import type { APIRoute, GetStaticPaths, Page } from 'astro';
import { getLeanPosts } from '../../../lib/blog';

export const getStaticPaths: GetStaticPaths = async ({ paginate }) => {
  const posts = await getLeanPosts();
  return paginate(posts, { pageSize: 10 });
};

export const GET: APIRoute = async ({ props }) => {
  const page = props.page as Page; // 强制转换类型以消除隐式 any
  
  return new Response(JSON.stringify({
    posts: page.data,
    hasNext: !!page.url.next
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};