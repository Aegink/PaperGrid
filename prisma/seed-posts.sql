-- 插入测试数据脚本
-- 使用方法: sqlite3 prisma/dev.db < prisma/seed-posts.sql

-- 首先检查是否有默认用户,如果没有则创建
-- 假设用户ID为固定值用于测试
-- 注意: 实际用户ID可能不同,请根据实际情况调整

-- 插入分类
INSERT OR IGNORE INTO Category (id, name, slug, description, "createdAt", "updatedAt")
VALUES
  ('cat-tech-001', '技术', 'tech', '技术相关文章', datetime('now'), datetime('now')),
  ('cat-life-002', '生活', 'life', '生活记录', datetime('now'), datetime('now')),
  ('cat-tutorial-003', '教程', 'tutorial', '教程文档', datetime('now'), datetime('now'));

-- 插入标签
INSERT OR IGNORE INTO Tag (id, name, slug, "createdAt", "updatedAt")
VALUES
  ('tag-001', 'React', 'react', datetime('now'), datetime('now')),
  ('tag-002', 'Next.js', 'nextjs', datetime('now'), datetime('now')),
  ('tag-003', 'TypeScript', 'typescript', datetime('now'), datetime('now')),
  ('tag-004', 'TailwindCSS', 'tailwindcss', datetime('now'), datetime('now')),
  ('tag-005', 'Prisma', 'prisma', datetime('now'), datetime('now')),
  ('tag-006', '前端开发', 'frontend', datetime('now'), datetime('now')),
  ('tag-007', '后端开发', 'backend', datetime('now'), datetime('now')),
  ('tag-008', '全栈开发', 'fullstack', datetime('now'), datetime('now')),
  ('tag-009', '数据库', 'database', datetime('now'), datetime('now')),
  ('tag-010', 'Web开发', 'webdev', datetime('now'), datetime('now'));

-- 插入5篇发布的文章
-- 注意: authorId 需要替换为实际的用户ID
-- 先查询用户ID,然后使用以下命令获取用户ID
-- SELECT id FROM User LIMIT 1;

-- 文章1
INSERT OR IGNORE INTO Post (
  id, title, slug, content, excerpt, status, locale, "publishedAt",
  "authorId", "categoryId", "readingTime", "createdAt", "updatedAt"
)
VALUES
  ('post-001',
   'Next.js 14 App Router 完全指南',
   'nextjs-14-app-router-guide',
   '# Next.js 14 App Router 完全指南

## 简介

Next.js 14 引入了许多新特性,其中最重要的是 App Router。本文将详细介绍如何使用 App Router 构建现代化的 Web 应用。

## 什么是 App Router?

App Router 是 Next.js 13 引入的新路由系统,基于 React Server Components 构建。

### 主要特性

- **React Server Components**: 默认使用服务器组件
- **Streaming**: 支持流式渲染
- **Transitions**: 更好的导航体验
- ** layouts**: 嵌套布局

## 创建新项目

```bash
pnpm create next-app@latest my-app
```

## 项目结构

```
app/
├── layout.tsx
├── page.tsx
├── about/
│   └── page.tsx
└── blog/
    ├── page.tsx
    └── [slug]/
        └── page.tsx
```

## 总结

App Router 是 Next.js 的未来,值得学习和使用。',
   '本文详细介绍 Next.js 14 App Router 的使用方法,包括 React Server Components、Streaming 等新特性。',
   'PUBLISHED',
   'zh',
   datetime('now', '-5 days'),
   (SELECT id FROM User LIMIT 1),
   'cat-tech-001',
   8,
   datetime('now', '-5 days'),
   datetime('now', '-5 days')
 );

-- 文章2
INSERT OR IGNORE INTO Post (
  id, title, slug, content, excerpt, status, locale, "publishedAt",
  "authorId", "categoryId", "readingTime", "createdAt", "updatedAt"
)
VALUES
  ('post-002',
   'TypeScript 最佳实践',
   'typescript-best-practices',
   '# TypeScript 最佳实践

## 类型基础

TypeScript 为 JavaScript 添加了静态类型检查。

### 接口 vs 类型别名

```typescript
// 接口
interface User {
  name: string;
  age: number;
}

// 类型别名
type User = {
  name: string;
  age: number;
};
```

## 泛型

泛型让代码更加灵活:

```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

## 类型守卫

使用类型守卫缩小类型范围:

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

## 总结

TypeScript 是大型项目的首选语言。',
   '分享 TypeScript 开发中的最佳实践,包括类型定义、泛型使用、类型守卫等技巧。',
   'PUBLISHED',
   'zh',
   datetime('now', '-4 days'),
   (SELECT id FROM User LIMIT 1),
   'cat-tech-001',
   6,
   datetime('now', '-4 days'),
   datetime('now', '-4 days')
 );

-- 文章3
INSERT OR IGNORE INTO Post (
  id, title, slug, content, excerpt, status, locale, "publishedAt",
  "authorId", "categoryId", "readingTime", "createdAt", "updatedAt"
)
VALUES
  ('post-003',
   '使用 Prisma 构建数据库层',
   'prisma-database-layer',
   '# 使用 Prisma 构建数据库层

## 什么是 Prisma?

Prisma 是现代化的 ORM,让数据库操作变得简单。

### 主要优势

- 类型安全
- 自动生成 TypeScript 类型
- 迁移管理
- 查询构建器

## Schema 定义

```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  posts Post[]
}
```

## 数据库查询

```typescript
const users = await prisma.user.findMany({
  include: {
    posts: true,
  },
});
```

## 迁移

```bash
pnpm prisma migrate dev
```

## 总结

Prisma 大大提升了开发效率。',
   '详细介绍如何使用 Prisma ORM 构建类型安全的数据库层,包括 schema 定义、查询和迁移。',
   'PUBLISHED',
   'zh',
   datetime('now', '-3 days'),
   (SELECT id FROM User LIMIT 1),
   'cat-tutorial-003',
   7,
   datetime('now', '-3 days'),
   datetime('now', '-3 days')
 );

-- 文章4
INSERT OR IGNORE INTO Post (
  id, title, slug, content, excerpt, status, locale, "publishedAt",
  "authorId", "categoryId", "readingTime", "createdAt", "updatedAt"
)
VALUES
  ('post-004',
   'TailwindCSS 实用技巧',
   'tailwindcss-tips',
   '# TailwindCSS 实用技巧

## 为什么选择 TailwindCSS?

TailwindCSS 是功能类优先的 CSS 框架。

### 快速开发

```html
<div class="flex items-center gap-4 p-4 bg-white rounded-lg">
  <img class="w-12 h-12 rounded-full" />
  <div>
    <h3 class="font-semibold">Title</h3>
    <p class="text-sm text-gray-600">Description</p>
  </div>
</div>
```

## 自定义配置

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
    },
  },
};
```

## 响应式设计

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 内容 -->
</div>
```

## 暗色模式

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <!-- 内容 -->
</div>
```

## 总结

TailwindCSS 让样式开发更加高效。',
   '分享 TailwindCSS 的实用技巧和最佳实践,帮助开发者更高效地构建 UI。',
   'PUBLISHED',
   'zh',
   datetime('now', '-2 days'),
   (SELECT id FROM User LIMIT 1),
   'cat-tech-001',
   5,
   datetime('now', '-2 days'),
   datetime('now', '-2 days')
 );

-- 文章5
INSERT OR IGNORE INTO Post (
  id, title, slug, content, excerpt, status, locale, "publishedAt",
  "authorId", "categoryId", "readingTime", "createdAt", "updatedAt"
)
VALUES
  ('post-005',
   '我的全栈开发之旅',
   'my-fullstack-journey',
   '# 我的全栈开发之旅

## 开始

三年前,我开始了我的编程之旅。

## 学习路径

### 第一年: 基础

- HTML/CSS
- JavaScript
- Git

### 第二年: 框架

- React
- Vue
- Node.js

### 第三年: 全栈

- Next.js
- PostgreSQL
- Docker

## 经验总结

1. **持续学习** - 技术更新很快
2. **实践项目** - 理论结合实践
3. **社区参与** - 开源贡献

## 未来计划

- 深入学习云原生技术
- 探索 AI 应用开发
- 分享更多技术文章

## 感谢

感谢一路上帮助过我的所有人!

联系方式: your@email.com',
   '记录我从零开始学习全栈开发的经历和心得,分享学习路线和经验总结。',
   'PUBLISHED',
   'zh',
   datetime('now', '-1 day'),
   (SELECT id FROM User LIMIT 1),
   'cat-life-002',
   4,
   datetime('now', '-1 day'),
   datetime('now', '-1 day')
 );

-- 为文章添加标签关联
-- 文章1的标签
INSERT OR IGNORE INTO "PostTag" ("postId", "tagId")
VALUES
  ('post-001', 'tag-002'),  -- Next.js
  ('post-001', 'tag-006'),  -- 前端开发
  ('post-001', 'tag-008');  -- 全栈开发

-- 文章2的标签
INSERT OR IGNORE INTO "PostTag" ("postId", "tagId")
VALUES
  ('post-002', 'tag-003'),  -- TypeScript
  ('post-002', 'tag-006');  -- 前端开发

-- 文章3的标签
INSERT OR IGNORE INTO "PostTag" ("postId", "tagId")
VALUES
  ('post-003', 'tag-005'),  -- Prisma
  ('post-003', 'tag-007'),  -- 后端开发
  ('post-003', 'tag-009');  -- 数据库

-- 文章4的标签
INSERT OR IGNORE INTO "PostTag" ("postId", "tagId")
VALUES
  ('post-004', 'tag-004'),  -- TailwindCSS
  ('post-004', 'tag-006'),  -- 前端开发
  ('post-004', 'tag-010');  -- Web开发

-- 文章5的标签
INSERT OR IGNORE INTO "PostTag" ("postId", "tagId")
VALUES
  ('post-005', 'tag-008'),  -- 全栈开发
  ('post-005', 'tag-010');  -- Web开发

-- 为文章创建阅读量记录
INSERT OR IGNORE INTO "ViewCount" ("id", "postId", "count", "createdAt", "updatedAt")
VALUES
  ('vc-001', 'post-001', 128, datetime('now'), datetime('now')),
  ('vc-002', 'post-002', 95, datetime('now'), datetime('now')),
  ('vc-003', 'post-003', 76, datetime('now'), datetime('now')),
  ('vc-004', 'post-004', 112, datetime('now'), datetime('now')),
  ('vc-005', 'post-005', 89, datetime('now'), datetime('now'));
