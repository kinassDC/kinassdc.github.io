# 导航栏重设计实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构博客导航栏，采用极简主义设计风格，添加搜索框和响应式移动端菜单

**Architecture:**
- 将导航栏拆分为三个组件：Nav（容器）、SearchBox（搜索输入）、MobileMenu（移动端抽屉）
- 使用 Astro.url.pathname 获取当前路径实现页面高亮
- 移动端菜单使用 client:load 指令实现交互

**Tech Stack:** Astro 5.17.1, Tailwind CSS 4.1.18, TypeScript

---

## 文件结构

**修改的文件：**
- `src/components/Nav.astro` - 完全重写，集成新布局和组件
- `src/styles/global.css` - 添加自定义动画

**新建的文件：**
- `src/components/SearchBox.astro` - 搜索框组件
- `src/components/MobileMenu.astro` - 移动端菜单组件

---

## Task 1: 添加 CSS 动画到 global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: 添加导航栏淡入动画**

在 `src/styles/global.css` 文件末尾添加：

```css
/* 导航栏淡入动画 */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 600ms ease-out;
}
```

- [ ] **Step 2: 添加链接淡入动画**

在 `src/styles/global.css` 文件末尾添加：

```css
/* 链接淡入动画 */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 600ms ease-out;
}
```

- [ ] **Step 3: 验证 CSS 语法**

运行: `npm run build`
预期: 构建成功，无 CSS 语法错误

- [ ] **Step 4: 提交**

```bash
git add src/styles/global.css
git commit -m "feat: 添加导航栏动画关键帧

- fade-in-down: 导航栏从顶部淡入
- fade-up: 内容从下方淡入

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 2: 创建 SearchBox 组件

**Files:**
- Create: `src/components/SearchBox.astro`

- [ ] **Step 1: 创建 SearchBox.astro 文件**

创建 `src/components/SearchBox.astro` 文件：

```astro
---
// 搜索框组件
// 接收 placeholder 作为可选属性
interface Props {
  placeholder?: string;
}

const { placeholder = "搜索文章..." } = Astro.props;
---

<div class="search-box-container group">
  <svg
    class="search-icon absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
  <input
    type="search"
    name="search"
    placeholder={placeholder}
    aria-label="搜索文章"
    class="search-input w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(96,165,250,0.1)]"
  />
</div>

<style>
  .search-box-container {
    position: relative;
    width: 16rem;
    transition: width 200ms ease-in-out;
  }

  .search-box-container:focus-within {
    width: 20rem;
  }

  @media (max-width: 767px) {
    .search-box-container {
      width: 100%;
    }

    .search-box-container:focus-within {
      width: 100%;
    }
  }
</style>
```

- [ ] **Step 2: 验证组件语法**

检查文件是否存在且语法正确:
运行: `cat src/components/SearchBox.astro | head -5`
预期: 文件存在，显示前 5 行内容

- [ ] **Step 3: 提交**

```bash
git add src/components/SearchBox.astro
git commit -m "feat: 创建搜索框组件

- 带搜索图标的圆形输入框
- 聚焦时宽度扩展动画
- 完整的可访问性支持

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 3: 创建 MobileMenu 组件

**Files:**
- Create: `src/components/MobileMenu.astro`

- [ ] **Step 1: 创建 MobileMenu.astro 文件**

创建 `src/components/MobileMenu.astro` 文件：

```astro
---
---
<!-- 移动端菜单按钮 -->
<button
  id="mobile-menu-button"
  class="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 active:scale-95 transition-all duration-150"
  aria-label="打开菜单"
  aria-expanded="false"
  aria-controls="mobile-menu"
>
  <svg
    class="menu-icon w-6 h-6 text-slate-600 transition-transform duration-200"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path
      class="menu-open"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
    <path
      class="menu-close hidden"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</button>

<!-- 移动端菜单遮罩和内容 -->
<div
  id="mobile-menu"
  class="mobile-menu fixed inset-0 bg-white/95 backdrop-blur-xl transform translate-x-full transition-transform duration-300 ease-out md:hidden"
  role="dialog"
  aria-modal="true"
  aria-labelledby="mobile-menu-title"
>
  <!-- 关闭按钮 -->
  <button
    id="mobile-menu-close"
    class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 active:scale-95 transition-all duration-150"
    aria-label="关闭菜单"
  >
    <svg
      class="w-6 h-6 text-slate-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>

  <!-- 菜单内容 -->
  <div class="flex flex-col items-center justify-center h-full gap-2 px-8">
    <h2 id="mobile-menu-title" class="sr-only">导航菜单</h2>

    <!-- 导航链接 -->
    <nav class="flex flex-col items-center gap-2 w-full" aria-label="主导航">
      <a
        href="/posts"
        class="mobile-nav-link text-2xl font-medium text-slate-900 py-4 px-6 w-full text-center border-b border-slate-100 hover:text-blue-600 transition-colors duration-200 active:scale-95"
      >
        归档
      </a>
      <a
        href="/about"
        class="mobile-nav-link text-2xl font-medium text-slate-900 py-4 px-6 w-full text-center border-b border-slate-100 hover:text-blue-600 transition-colors duration-200 active:scale-95"
      >
        关于
      </a>
    </nav>

    <!-- 搜索框 -->
    <div class="w-full max-w-md mt-8">
      <label for="mobile-search" class="sr-only">搜索文章</label>
      <div class="relative">
        <svg
          class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          id="mobile-search"
          type="search"
          name="search"
          placeholder="搜索文章..."
          aria-label="搜索文章"
          class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-13 pr-6 text-base text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(96,165,250,0.1)]"
        />
      </div>
    </div>
  </div>
</div>

<script>
  // 移动端菜单交互逻辑
  const menuButton = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  const menuClose = document.getElementById('mobile-menu-close');
  const menuIcon = document.querySelector('.menu-icon');
  const menuOpenIcon = document.querySelector('.menu-open');
  const menuCloseIcon = document.querySelector('.menu-close');

  let isMenuOpen = false;

  function openMenu() {
    isMenuOpen = true;
    menu.classList.remove('translate-x-full');
    menu.classList.add('translate-x-0');
    menuButton.setAttribute('aria-label', '关闭菜单');
    menuButton.setAttribute('aria-expanded', 'true');
    menuOpenIcon.classList.add('hidden');
    menuCloseIcon.classList.remove('hidden');
    menuIcon.classList.add('rotate-90');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isMenuOpen = false;
    menu.classList.add('translate-x-full');
    menu.classList.remove('translate-x-0');
    menuButton.setAttribute('aria-label', '打开菜单');
    menuButton.setAttribute('aria-expanded', 'false');
    menuOpenIcon.classList.remove('hidden');
    menuCloseIcon.classList.add('hidden');
    menuIcon.classList.remove('rotate-90');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // 事件监听
  menuButton?.addEventListener('click', toggleMenu);
  menuClose?.addEventListener('click', closeMenu);

  // 点击遮罩层关闭菜单
  menu?.addEventListener('click', (e) => {
    if (e.target === menu) {
      closeMenu();
    }
  });

  // ESC 键关闭菜单
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });

  // 路由变化后关闭菜单
  document.addEventListener('astro:after-preparation', () => {
    if (isMenuOpen) {
      closeMenu();
    }
  });

  // 高亮当前页面链接
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.mobile-nav-link');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('text-blue-600');
      link.classList.remove('text-slate-900');
    }
  });
</script>

<style>
  .mobile-menu {
    z-index: 9999;
  }

  /* 防止菜单打开时页面滚动 */
  body:has(.mobile-menu.translate-x-0) {
    overflow: hidden;
  }
</style>
```

- [ ] **Step 2: 验证组件语法**

检查文件是否存在:
运行: `cat src/components/MobileMenu.astro | head -5`
预期: 文件存在，显示前 5 行内容

- [ ] **Step 3: 提交**

```bash
git add src/components/MobileMenu.astro
git commit -m "feat: 创建移动端菜单组件

- 抽屉式全屏菜单
- 汉堡图标切换动画
- ESC 键和遮罩点击关闭
- 当前页面高亮

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 4: 重写 Nav 组件

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: 备份现有 Nav 组件**

查看当前 Nav.astro 内容:
运行: `cat src/components/Nav.astro`
预期: 显示当前导航栏代码（9行）

- [ ] **Step 2: 重写 Nav.astro**

完全替换 `src/components/Nav.astro` 内容为：

```astro
---
import SearchBox from './SearchBox.astro';
import MobileMenu from './MobileMenu.astro';

// 获取当前路径用于高亮
const currentPath = Astro.url.pathname;

// 导航链接配置
const navLinks = [
  { href: '/posts', label: '归档' },
  { href: '/about', label: '关于' },
];
---

<!-- 主导航栏 -->
<nav
  class="flex justify-between items-center py-4 max-w-5xl mx-auto px-6 animate-fade-in-down"
  role="navigation"
  aria-label="主导航"
>
  <!-- Logo -->
  <a
    href="/"
    class="relative group flex-shrink-0"
    aria-label="返回首页"
  >
    <img
      src="/favicon.ico"
      alt="Logo"
      width="40"
      height="40"
      class="hover:opacity-80 transition-opacity duration-200 active:scale-95"
    />
  </a>

  <!-- 桌面端：搜索框 + 导航链接 -->
  <div class="hidden md:flex items-center gap-6 flex-1 justify-center">
    <SearchBox placeholder="搜索文章..." />
  </div>

  <!-- 桌面端导航链接 -->
  <div class="hidden md:flex items-center gap-8">
    {navLinks.map((link) => (
      <a
        href={link.href}
        class={`nav-link relative text-sm font-medium px-3 py-2 transition-colors duration-200 active:scale-95 ${
          currentPath === link.href
            ? 'text-blue-600'
            : 'text-slate-600 hover:text-blue-600'
        }`}
        aria-current={currentPath === link.href ? 'page' : undefined}
      >
        {link.label}
      </a>
    ))}
  </div>

  <!-- 移动端菜单按钮 -->
  <MobileMenu />
</nav>

<style>
  /* 下划线指示器动画 */
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: #2563eb;
    width: 0%;
    transition: width 300ms ease-out;
  }

  .nav-link[aria-current="page"]::after,
  .nav-link:hover::after {
    width: 100%;
  }

  /* 键盘聚焦样式 */
  a:focus-visible,
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* 触摸目标最小尺寸 */
  @media (max-width: 767px) {
    a {
      min-width: 44px;
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
```

- [ ] **Step 3: 验证组件语法**

检查文件是否正确更新:
运行: `cat src/components/Nav.astro | head -20`
预期: 显示新的导航栏代码前 20 行

- [ ] **Step 4: 提交**

```bash
git add src/components/Nav.astro
git commit -m "feat: 重构导航栏组件

- 采用极简主义设计风格
- 集成 SearchBox 组件
- 集成 MobileMenu 组件
- 使用 Astro.url.pathname 实现页面高亮
- 添加下划线指示器动画
- 完整的可访问性支持

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 5: 验证构建和运行

**Files:**
- None (verification only)

- [ ] **Step 1: 清理并重新安装依赖**

运行: `rm -rf node_modules && npm install`
预期: 依赖安装成功，无错误

- [ ] **Step 2: 构建项目**

运行: `npm run build`
预期: 构建成功，输出到 `dist/` 目录

- [ ] **Step 3: 检查构建输出**

运行: `ls -la dist/`
预期: 显示包含 index.html 等文件的构建输出

- [ ] **Step 4: 启动开发服务器验证**

运行: `npm run dev` (在后台)
预期: 服务器启动成功，默认在 http://localhost:4321

手动验证步骤:
1. 访问 http://localhost:4321
2. 检查导航栏显示正确
3. 检查搜索框可以聚焦
4. 检查导航链接 hover 效果
5. 调整浏览器宽度到 < 768px，检查汉堡菜单出现
6. 点击汉堡菜单，检查抽屉菜单打开
7. 在移动端视图中测试搜索框

- [ ] **Step 5: 停止开发服务器**

运行: `pkill -f "astro dev"`
预期: 开发服务器停止

- [ ] **Step 6: 最终提交**

```bash
git add docs/superpowers/plans/2026-04-02-navigation-redesign.md
git commit -m "docs: 添加导航栏重设计实现计划

详细的分步实现计划，包含所有任务和验证步骤。

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## 验收检查清单

### 功能验收
- [ ] 导航链接正确跳转到 /posts 和 /about
- [ ] 搜索框可以接收用户输入并显示聚焦状态
- [ ] 搜索框失去焦点时恢复默认状态
- [ ] 移动端菜单点击汉堡按钮打开
- [ ] 移动端菜单点击关闭按钮或遮罩层关闭
- [ ] 当前页面链接显示蓝色下划线指示器

### 视觉验收
- [ ] 设计符合极简主义风格（无边框、透明背景）
- [ ] 所有动画流畅自然（淡入、下划线、菜单滑入）
- [ ] 响应式布局在各尺寸正常显示（桌面/移动）

### 可访问性验收
- [ ] 键盘导航完整可用（Tab、Enter、Escape）
- [ ] 所有交互元素有合适的 aria-label
- [ ] 屏幕阅读器能正确识别导航结构
- [ ] 触摸目标尺寸符合标准（≥44×44px）

### 性能验收
- [ ] 首屏加载时间 < 1s
- [ ] 动画帧率保持 60fps
- [ ] 移动端无明显卡顿
