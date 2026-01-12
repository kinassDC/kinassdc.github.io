# 派小站 - Personal Blog

一个基于 Astro 构建的现代个人博客，采用内容优先的设计理念，专注于技术与生活的记录与分享。

## 技术栈

| 技术 | 版本 | 说明 |
|-----|------|-----|
| [Astro](https://astro.build) | 5.16.6 | 现代静态网站生成器 |
| [Tailwind CSS](https://tailwindcss.com) | 4.1.18 | 实用优先的 CSS 框架 |
| [TypeScript](https://www.typescriptlang.org) | - | 类型安全的 JavaScript |
| [Zod](https://zod.dev) | - | 数据验证库 |

## 项目架构

```
project1/
├── src/
│   ├── components/           # Astro 组件
│   │   ├── Nav.astro         # 顶部导航栏
│   │   └── Footer.astro      # 页脚组件
│   ├── content/              # 内容集合
│   │   ├── config.mjs        # Content Collections 配置
│   │   └── blog/             # 博客文章目录
│   │       ├── first_post/
│   │       ├── second_post/
│   │       └── ...
│   ├── layouts/              # 页面布局
│   │   └── MainLayout.astro  # 主布局模板
│   ├── lib/                  # 工具函数
│   │   └── blog.ts           # 博客数据处理
│   ├── pages/                # 路由页面
│   │   ├── index.astro       # 首页
│   │   ├── blog/
│   │   │   └── [...slug].astro  # 博客详情页（动态路由）
│   │   └── api/
│   │       └── posts/
│   │           └── [page].json.ts  # 分页 API
│   └── styles/               # 全局样式
│       └── global.css        # Tailwind + 自定义样式
├── public/                   # 静态资源
│   ├── bg.png                # 背景图片
│   └── favicon.svg           # 网站图标
├── astro.config.mjs          # Astro 配置文件
├── package.json              # 项目依赖
└── tsconfig.json             # TypeScript 配置
```

## 核心模块

### 1. 内容管理 (Content Collections)

使用 Astro Content Collections 管理博客内容，配置文件位于 `src/content/config.mjs`：

```javascript
// 支持的 front matter 字段：
{
  title: string,          // 文章标题
  pubDate: Date,          // 发布日期
  description: string,    // 文章摘要
  tags: string[],         // 文章标签（可选）
  category: string,       // 文章分类
  isDraft: boolean,       // 是否为草稿（可选）
  image: string,          // 封面图 URL（可选）
}
```

### 2. 路由系统

| 路由 | 文件 | 功能 |
|------|------|------|
| `/` | `pages/index.astro` | 首页，展示文章列表 |
| `/blog/:slug` | `pages/blog/[...slug].astro` | 博客详情页 |
| `/api/posts/:page` | `pages/api/posts/[page].json.ts` | 分页数据 API |

### 3. 数据处理

**`src/lib/blog.ts`** - 博客数据调度中心：

```typescript
// 获取精简后的博文列表（排除草稿，按日期倒序）
getLeanPosts(): Promise<Post[]>
```

### 4. 页面功能

#### 首页 (`/`)
- 英雄区域展示
- 分类快捷入口（技术/生活）
- 文章卡片列表
- 无限滚动/加载更多

#### 博客详情页 (`/blog/:slug`)
- 面包屑导航
- 文章元信息（日期、阅读时间、分类、标签）
- Markdown 内容渲染
- 相关文章推荐（同分类）
- 社交分享按钮

### 5. UI 组件

| 组件 | 路径 | 描述 |
|------|------|------|
| Nav | `components/Nav.astro` | 顶部导航栏 |
| Footer | `components/Footer.astro` | 页脚信息 |
| MainLayout | `layouts/MainLayout.astro` | 统一页面布局，包含背景、回到顶部按钮 |

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:4321

### 构建生产版本

```bash
npm run build
```

输出目录：`dist/`

### 预览生产构建

```bash
npm run preview
```

## 添加新文章

1. 在 `src/content/blog/` 下创建新目录（目录名即为 slug）
2. 创建 `index.md` 文件，添加 front matter：

```markdown
---
title: 我的文章标题
pubDate: 2026-01-12
description: 这是一篇文章的摘要
category: 技术
tags: [Astro, 前端开发]
isDraft: false
image: /images/cover.jpg
---

# 文章正文

这里是 Markdown 内容...
```

> **注意**：目录名不能包含空格、特殊字符或中文，否则会导致路由解析失败。

## 特性

- 静态站点生成 (SSG)
- 响应式设计，支持移动端
- 无限滚动/分页加载
- 内容分类和标签系统
- 草稿功能
- 阅读时间估算
- 相关文章推荐
- SEO 优化
- TypeScript 类型安全

## License

MIT
