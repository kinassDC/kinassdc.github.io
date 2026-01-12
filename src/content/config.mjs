/**
 * Astro Content Collections 配置文件
 *
 * 用于定义博客文章的内容结构和数据验证规则
 * 使用 Zod 进行类型安全和数据验证
 *
 * 官方文档: https://docs.astro.build/en/guides/content-collections/
 */

import { defineCollection, z } from 'astro:content';

/**
 * 博客文章集合定义
 *
 * type: 'content' 表示这是一个 Markdown/MDX 内容集合
 * schema: 使用 Zod 定义文章 front matter 的数据结构
 */
const blog = defineCollection({
  // 集合类型：'content' 支持 Markdown 和 MDX 文件
  type: 'content',

  // 使用 Zod schema 定义 front matter 的数据结构和验证规则
  schema: z.object({
    // 文章标题（必需）
    // 示例: title: "我的第一篇博客"
    title: z.string(),

    // 发布日期（必需）
    // 用于排序和显示，支持 Date 对象
    // 示例: pubDate: 2026-01-10
    pubDate: z.date(),

    // 文章描述/摘要（必需）
    // 用于在列表页和 SEO 中显示
    // 示例: description: "这是一篇关于 Astro 的入门教程"
    description: z.string(),

    // 文章标签（可选，默认为空数组）
    // 用于分类和筛选，支持多个标签
    // 示例: tags: ["Astro", "前端开发", "教程"]
    tags: z.array(z.string()).default([]),

    // 文章分类（必需）
    // 用于主要分类，如：技术、生活等
    // 示例: category: "技术"
    category: z.string(),

    // 是否为草稿（可选，默认为 false）
    // 设置为 true 时文章不会在列表中显示
    // 示例: isDraft: true
    isDraft: z.boolean().default(false),

    // 文章封面图（可选）
    // 支持本地路径或外部 URL
    // 示例: image: "/images/article-cover.jpg"
    image: z.string().optional(),
  }),
});

/**
 * 导出所有内容集合
 *
 * collections 对象包含网站的所有内容集合定义
 * 键名对应 src/content/ 下的目录名
 */
export const collections = { blog };