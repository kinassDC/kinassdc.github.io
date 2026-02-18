import type { APIRoute, GetStaticPaths, Page } from 'astro';
import { getLeanPosts } from '../../../lib/blog';

export const getStaticPaths: GetStaticPaths = async ({ paginate }) => {
  const allPosts = await getLeanPosts();  // 获取所有精简后的博文数据
  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf();
  });  // 按发布日期倒序排序
  return paginate(sortedPosts, { pageSize: 10 });  // 使用 paginate 函数进行分页，每页 10 条数据
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