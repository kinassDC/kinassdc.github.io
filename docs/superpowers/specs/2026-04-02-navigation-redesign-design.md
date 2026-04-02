# 导航栏重设计方案

**日期：** 2026-04-02
**项目：** 派小站（myBlogFrontEnd）
**设计风格：** 极简主义

---

## 1. 设计目标

重写博客导航栏，采用极简主义设计风格，提升用户体验和视觉美观度，同时保持网站核心功能。

## 2. 当前状态分析

**现有导航栏：**
- 框架：Astro + Tailwind CSS
- 布局：左侧 Logo，右侧两个链接（归档、关于）
- 问题：设计过于简单，缺乏视觉层次和交互细节

## 3. 设计方案

### 3.1 整体布局

**桌面端（≥ 768px）：**
- 最大宽度：max-w-5xl
- 高度：h-16（64px）
- 内边距：px-6
- 定位：sticky top-0
- 背景：完全透明
- 底部边框：border-b border-slate-200/50

**布局结构：**
```
[Logo]  [搜索框居中]  [归档] [关于] [汉堡(仅移动端)]
  左        居中           右对齐
```

**移动端（< 768px）：**
- 显示 Logo 和汉堡按钮
- 隐藏搜索框和导航链接
- 点击汉堡按钮展开全屏菜单

### 3.2 色彩系统

**主色调：**
- 主文字：slate-900（#0f172a）
- 次要文字：slate-600（#475569）
- 辅助文字：slate-400（#94a3b8）

**交互状态：**
- Hover：blue-600（#2563eb）
- 当前页面：blue-600
- 搜索框边框：slate-200（默认）→ blue-400（聚焦）

**搜索框色彩：**
- 背景：slate-50（#f8fafc）
- 文字：slate-900
- 占位符：slate-400
- 图标：slate-400

### 3.3 排版系统

**字体：** 继承 body 的 font-sans

**字号和字重：**
- 导航链接：text-sm（14px）+ font-medium（500）
- 搜索框：text-sm（14px）+ font-normal（400）
- Logo：40×40px（保持不变）

**间距：**
- 导航链接间距：gap-8（32px）
- 搜索框与导航链接间距：gap-6（24px）

### 3.4 组件设计

#### 3.4.1 Logo
- 尺寸：40×40px
- Hover：opacity-80 + scale-95
- 过渡：200ms
- 点击反馈：active:scale-95

#### 3.4.2 导航链接
**基础样式：**
- text-slate-600，relative（用于下划线动画）
- 内边距：px-3 py-2（增加点击区域）
- 过渡：color 200ms ease-in-out

**Hover 状态：**
- text-blue-600

**当前页面指示器：**
- 使用 `::after` 伪元素创建下划线
- 宽度从 0% 到 100% 的动画
- 高度：2px
- 位置：bottom-0
- 颜色：blue-600
- 过渡：width 300ms ease-out

#### 3.4.3 搜索框
**容器：**
- relative，rounded-full，bg-slate-50
- 尺寸：w-64 h-10（可扩展到 w-80）
- 边框：border border-slate-200
- 内边距：px-4 py-2

**图标：**
- 左侧搜索图标：w-4 h-4，slate-400

**输入框：**
- w-full，border-none，bg-transparent，outline-none

**聚焦状态：**
- border-blue-400
- shadow-[0_0_0_3px_rgba(96,165,250,0.1)]
- 过渡：border-color 200ms, box-shadow 200ms

**占位符：**
- text-slate-400

#### 3.4.4 移动端汉堡按钮
- 仅在 < 768px 显示
- 图标：三横线，w-6 h-6，slate-600
- Hover：slate-900
- 点击：轻微旋转动画
- 显示隐藏：md:hidden

### 3.5 移动端设计

#### 3.5.1 移动端导航栏
- Logo 左侧，汉堡按钮右侧
- 保持相同高度（h-16）
- 隐藏搜索框和导航链接

#### 3.5.2 移动端菜单（抽屉式）
**布局：**
- 全屏覆盖：fixed inset-0
- 背景：bg-white/95 backdrop-blur-xl
- 动画：从右侧滑入

**动画参数：**
```
translate-x-full → translate-x-0
过渡时间：300ms ease-out
```

**菜单内容：**
```
[关闭按钮]（右上角）

归档
关于

[搜索框]
```

**菜单项样式：**
- 字号：text-2xl
- 间距：py-4
- 颜色：slate-900
- Hover：text-blue-600
- 分隔线：border-b border-slate-100

**关闭按钮：**
- 右上角 × 图标
- 尺寸：w-8 h-8
- 点击遮罩层或关闭按钮关闭菜单

#### 3.5.3 响应式断点
- < 768px：显示汉堡按钮，隐藏导航链接和搜索框
- ≥ 768px：隐藏汉堡按钮，显示完整导航

### 3.6 动画和交互

#### 3.6.1 下划线指示器动画
```css
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: blue-600;
  width: 0%;
  transition: width 300ms ease-out;
}

.nav-link.active::after,
.nav-link:hover::after {
  width: 100%;
}
```

#### 3.6.2 搜索框聚焦动画
- 边框颜色：slate-200 → blue-400（200ms）
- 阴影：淡入蓝色光晕（200ms）
- 可选：宽度扩展（w-64 → w-80）

#### 3.6.3 移动端菜单动画
```css
/* 进入 */
.menu-enter { transform: translateX(100%); }
.menu-enter-active { transform: translateX(0); transition: transform 300ms ease-out; }

/* 退出 */
.menu-exit { transform: translateX(0); }
.menu-exit-active { transform: translateX(100%); transition: transform 200ms ease-in; }
```

#### 3.6.4 点击反馈
- 所有可点击元素：active:scale-95
- 过渡时间：150ms

#### 3.6.5 首次加载动画
- 导航栏从顶部淡入：animate-fade-in-down
- 延迟：0ms
- 持续时间：600ms

### 3.7 可访问性（A11y）

#### 3.7.1 语义化 HTML
- `<nav>` 包裹导航栏
- `<button>` 表示汉堡按钮
- `<input>` 配合 `aria-label` 表示搜索框
- 当前页面链接添加 `aria-current="page"`

#### 3.7.2 键盘导航
- Tab 键顺序：Logo → 搜索框 → 导航链接 → 汉堡按钮
- 聚焦样式：outline-2 outline-offset-2 outline-blue-500
- Escape 键关闭移动端菜单
- Enter 键激活链接

#### 3.7.3 屏幕阅读器
- 搜索框：`aria-label="搜索文章"`
- 汉堡按钮：`aria-label="打开菜单"` / `aria-label="关闭菜单"`
- 移动端菜单：`role="dialog"` + `aria-modal="true"`
- 菜单状态：`aria-expanded="true/false"`

#### 3.7.4 触摸目标
- 最小尺寸：44×44px
- 移动端菜单项间距：py-4

### 3.8 性能优化

#### 3.8.1 渲染优化
- 使用 `transform` 和 `opacity` 进行动画（GPU 加速）
- 避免引起 reflow 的属性（如 width、height）

#### 3.8.2 图片优化
- Logo 保持小尺寸（40×40px）
- 使用现代图片格式（WebP 优先）

#### 3.8.3 代码分割
- 移动端菜单组件按需加载
- 搜索功能可延迟加载

## 4. 技术实现要点

### 4.1 文件结构
```
src/components/
  ├── Nav.astro (重构)
  ├── SearchBox.astro (新建)
  └── MobileMenu.astro (新建)
```

### 4.2 状态管理
- 移动端菜单开关状态（使用 boolean）
- 搜索框聚焦状态（使用 CSS :focus 伪类）
- 当前页面路径（使用 Astro.url.pathname 获取）

### 4.3 Astro 集成
- 使用 `Astro.url.pathname` 获取当前路径，用于高亮当前页面链接
- 使用 client:load 指令加载移动端菜单组件（需要交互）
- 使用 client:visible 指令加载搜索框组件（可延迟加载）
- 保持服务端渲染的首屏性能，仅对需要交互的部分使用 hydration

### 4.4 Tailwind CSS 配置
- 无需额外配置
- 使用现有工具类
- 添加自定义动画到 global.css

## 5. 实现范围

**包含：**
- ✅ 导航栏组件重构
- ✅ 搜索框组件（前端交互）
- ✅ 移动端菜单组件
- ✅ 响应式布局
- ✅ 所有动画和交互效果
- ✅ 可访问性支持

**不包含：**
- ❌ 搜索后端 API 实现（仅实现前端输入框交互）
- ❌ 搜索结果页面
- ❌ 实际搜索逻辑和数据索引
- ❌ 暗黑模式支持（可在后续迭代添加）

## 6. 验收标准

### 6.1 功能验收
- [ ] 导航链接正确跳转到对应页面（/posts、/about）
- [ ] 搜索框可以接收用户输入，输入时显示聚焦状态
- [ ] 搜索框失去焦点时恢复默认状态
- [ ] 移动端菜单点击汉堡按钮打开，点击关闭按钮或遮罩层关闭
- [ ] 当前页面链接显示蓝色下划线指示器（使用 Astro.url.pathname 判断）

### 6.2 视觉验收
- [ ] 设计符合极简主义风格
- [ ] 所有动画流畅自然
- [ ] 响应式布局在各尺寸正常显示

### 6.3 可访问性验收
- [ ] 键盘导航完整可用
- [ ] 屏幕阅读器正确朗读所有元素
- [ ] 触摸目标尺寸符合标准

### 6.4 性能验收
- [ ] 首屏加载时间 < 1s
- [ ] 动画帧率保持 60fps
- [ ] 移动端无明显卡顿

## 7. 后续迭代方向

1. **搜索功能**：集成全文搜索 API
2. **暗黑模式**：添加主题切换
3. **多语言**：支持中英文切换
4. **用户偏好**：记住用户的菜单状态

---

**设计版本：** 1.0
**最后更新：** 2026-04-02
