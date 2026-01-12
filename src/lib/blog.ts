import { getCollection } from 'astro:content';

/**
 * 获取精简后的博文列表（用于列表页和 API）
 * 排除草稿，按日期倒序，去除大体积的正文
 */
export async function getLeanPosts() {
  const allPosts = await getCollection('blog', ({ data }) => {
    // 只有非草稿文章才会被获取
    return data.isDraft !== true;
  });

  return allPosts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map(post => ({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      category: post.data.category,
      tags: post.data.tags,
      image: post.data.image, // 包含可选的图片字段
    }));
}