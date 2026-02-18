---
title: "Astro 入门教程：构建现代化的静态网站"
pubDate: 2025-03-15
description: "Astro 是一个新兴的静态网站生成器，以其出色的性能和开发体验而备受关注。本文将带你从零开始学习 Astro。"
category: "技术"
tags: ["Astro", "前端", "静态网站", "Web开发"]
---

## 为什么选择 Astro？

Astro 是一个现代化的静态网站生成器，它有以下几个突出特点：

- **零 JS 默认**：默认情况下，Astro 会移除所有 JavaScript，只保留纯 HTML
- **岛屿架构**：按需加载交互式组件，优化性能
- **框架无关**：可以使用 React、Vue、Svelte 等任何你喜欢的框架
- **极快的构建速度**：比传统静态站点生成器快 20-100 倍

## 快速开始

### 安装 Astro

```bash
npm create astro@latest
```

按照提示选择：
- 选择 "Empty" 项目模板或选择示例项目
- 选择 "Yes" 安装 TypeScript
- 选择 "Yes" 安装推荐的开发工具

### 项目结构

```
my-project/
├── public/           # 静态资源
├── src/
│   ├── components/   # 组件
│   ├── layouts/      # 布局
│   ├── pages/        # 页面路由
│   └── styles/       # 样式文件
├── astro.config.mjs  # 配置文件
└── package.json
```

## 创建你的第一个页面

在 `src/pages/index.astro` 中：

```astro
---
// 这里是服务端代码（frontmatter）
const title = "我的 Astro 网站";
const items = ["首页", "关于", "联系"];
---
<!-- 这里是 HTML 模板 -->
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <ul>
      {items.map(item => <li>{item}</li>)}
    </ul>
  </body>
</html>
```

## 使用布局组件

创建 `src/layouts/MainLayout.astro`：

```astro
---
const { title } = Astro.props;
---
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
  </head>
  <body>
    <header>
      <nav>网站导航</nav>
    </header>
    <main>
      <slot />  <!-- 子内容将在这里渲染 -->
    </main>
    <footer>
      <p>&copy; 2025 我的网站</p>
    </footer>
  </body>
</html>
```

然后在页面中使用：

```astro
---
import MainLayout from '../layouts/MainLayout.astro';
---
<MainLayout title="首页">
  <h1>欢迎来到我的网站！</h1>
</MainLayout>
```

## 岛屿架构

当需要添加交互功能时，可以使用岛屿组件：

```astro
---
import Counter from '../components/Counter.jsx';
---
<Counter client:load />
```

`client:load` 指令告诉 Astro 在页面加载时立即加载这个组件的 JavaScript。

## 获取数据

Astro 的 frontmatter 代码在构建时执行：

```astro
---
// 获取远程数据
const response = await fetch('https://api.example.com/posts');
const posts = await response.json();

// 或读取本地文件
import data from '../data/posts.json';
---
<div>
  {posts.map(post => (
    <article>{post.title}</article>
  ))}
</div>
```

## 总结

Astro 是一个强大而灵活的静态网站生成器，特别适合博客、文档站等内容驱动的网站。它的零 JS 默认和岛屿架构理念，让你能够在保持极佳性能的同时，按需添加交互功能。

---

> **推荐阅读**：[Astro 官方文档](https://docs.astro.build)
