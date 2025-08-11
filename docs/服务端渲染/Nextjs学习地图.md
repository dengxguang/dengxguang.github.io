## 基础与核心概念 (Fundamentals & Core Concepts)

*   **是什么？** 基于 React 的**全栈 Web 应用框架** (不仅仅是 UI 库)。
*   **核心价值：** 开箱即用的解决方案，简化 React 应用的构建（路由、渲染、数据获取、API、优化等）。
*   **关键特性基石：**
    *   **文件系统路由 (File-based Routing):** 项目目录结构 (`pages` 或 `app`) 自动映射为 URL 路由。
    *   **服务端渲染 (Server-Side Rendering - SSR):** 在服务器生成 HTML 发送给浏览器，利于 SEO 和首屏速度。
    *   **静态站点生成 (Static Site Generation - SSG):** 在构建时生成 HTML 文件，性能极致。
    *   **增量静态再生 (Incremental Static Regeneration - ISR):** 结合 SSG 和动态更新，在后台按需或定时重新生成静态页面。
    *   **客户端渲染 (Client-Side Rendering - CSR):** 传统 React SPA 方式，浏览器下载 JS 后渲染。
    *   **API 路由 (API Routes):** 在 Next.js 应用中直接编写后端 API 端点 (`/pages/api` 或 `/app/api`)。
*   **项目结构初识：** `pages/`, `public/`, `components/`, `styles/`, `next.config.js` (App Router vs Pages Router 结构有差异)。


## 数据获取 (Data Fetching) - Next.js 的核心优势之一
*   **在哪里获取数据？** 区分服务器端和客户端。
*   **关键数据获取函数 (App Router vs Pages Router 命名不同):**
    *   **服务端组件数据获取 (推荐)：** 直接在 React Server Components 中使用 `async/await` 和 `fetch` (Next.js 扩展了 `fetch` 提供缓存和重复数据删除)。
    *   **`getStaticProps` (Pages Router SSG):** 在构建时运行，为页面提供静态 props。
    *   **`getStaticPaths` (Pages Router SSG):** 与 `getStaticProps` 配合，指定动态路由哪些路径在构建时预生成。
    *   **`getServerSideProps` (Pages Router SSR):** 在每次请求时运行，为页面提供请求时获取的 props。
    *   **客户端数据获取：** 在客户端组件中使用 `useEffect`, `fetch`, 或 `SWR`/`React Query` 等库。
*   **缓存与重新验证：** Next.js 强大的数据缓存机制 (`cache: 'force-cache'`, `revalidate` 选项)，理解 ISR 原理。

*  **数据获取的 4 条赛道**
| 赛道 | 谁来跑 | 何时跑 | 适用场景 | Next.js 关键词（pages router） |
|---|---|---|---|---|
| SSG（静态生成） | 构建工具 | yarn build 时 | 内容基本不变：博客、文档 | getStaticProps / 默认缓存 |
| SSR（服务器渲染） | 服务器 | 每次请求 | 实时/个性化：仪表盘、订单 | getServerSideProps |
| ISR（增量静态） | 服务器 | 首次请求 + 定时再生 | 折中：商品页、新闻列表 | getStaticProps + revalidate |
| CSR（客户端拉取） | 浏览器 | 页面加载后 | 纯交互：搜索过滤、聊天 | useEffect + fetch / SWR |

*  **示例代码**
- SSR
  ```tsx
    // pages Router - getServerSideProps
    export async function getServerSideProps({ req, res }) {
      const data = await fetch('https://api/stocks', {
        headers: { Cookie: req.headers.cookie || '' }
      }).then(r => r.json());
      return { props: { data } };
    }

    // App Router
  ```

- SSG
  ```tsx
    // pages Router -getStaticPaths、getStaticProps
    // pages/posts/[slug].tsx
    export async function getStaticPaths() {
      const slugs = await fetch('https://api/posts').then(r => r.json());
      return {
        paths: slugs.map((s: string) => ({ params: { slug: s } })),
        fallback: 'blocking'            // 未预渲染的 slug 走 SSR
      };
    }
    export async function getStaticProps({ params }) {
      const post = await fetch(`https://api/posts/${params.slug}`).then(r => r.json());
      return { props: { post }, revalidate: 60 }; // 60 秒后 ISR
    }

    // App Router todo
  ```

- ISR
  ```tsx
    // pages Router - getStaticProps + revalidate
    export async function getStaticProps() {
      const data = await fetch('https://api/stocks').then(r => r.json());
      return { props: { data }, revalidate: 60 };
    }

    // App Router todo

  ```

- CSR
  ```tsx
    'use client';
    import useSWR from 'swr';
    const fetcher = (url: string) => fetch(url).then(r => r.json());
    export default function Comments({ postId }) {
      const { data, error, mutate } = useSWR(`/api/comments?postId=${postId}`, fetcher);
      if (error) return <div>加载失败</div>;
      if (!data) return <div>Loading...</div>;
      return (
        <>
          {data.map(c => <p key={c.id}>{c.text}</p>)}
          <button onClick={() => mutate()}>刷新评论</button>
        </>
      );
    }

  ```

## 路由 (Routing) - 应用骨架

*   **两种路由范式 (需选择其一)：**
    *   **Pages Router (旧版，稳定)：** 基于 `/pages` 目录的文件系统路由。概念相对直接。
    *   **App Router (新版，推荐)：** 基于 `/app` 目录的 React Server Components 优先路由。功能更强大、更灵活 (Layouts, Streaming, Suspense 深度集成)，是未来方向。
*   **核心路由概念 (App Router)：**
    *   **文件约定：** `page.js`, `layout.js`, `loading.js`, `error.js`, `template.js`, `route.js` (API) 等。
    *   **布局 (Layouts):** 在多个页面间共享 UI (如导航栏、页脚)，保留状态不重载。
    *   **嵌套路由：** 文件夹结构自然形成嵌套路由，与嵌套布局配合。
    *   **动态路由：** `[folderName]` 或 `[...folderName]` (Catch-all) 捕获 URL 参数。
    *   **路由组 (Route Groups)：** `(folderName)` 组织路由而不影响 URL 路径。
    *   **并行路由 (Parallel Routes) 和拦截路由 (Intercepting Routes)：** 高级路由模式。
    *   **路由过渡 (Navigation)：** `useRouter` hook, `<Link>` 组件 (客户端导航，无整页刷新)。
*   **Pages Router 概念：** 动态路由 (`[id].js`), `Link`, `useRouter`。
  


## 渲染策略 (Rendering Strategies) - 性能与 SEO 的关键

*   **理解不同策略的适用场景：**
    *   **SSR (Server-Side Rendering):** 需要实时数据、个性化内容、SEO 关键页面 (产品页、博客文章)。
    *   **SSG (Static Site Generation):** 内容相对固定、对性能要求极高 (营销页、博客列表、文档)。
    *   **ISR (Incremental Static Regeneration):** 大量页面需要静态化但有更新需求 (电商产品目录、新闻列表)。
    *   **CSR (Client-Side Rendering):** 高度交互的仪表盘、用户后台（SEO 不关键）。
    *   **流式渲染 (Streaming - App Router):** 逐步将 UI 从服务器发送到客户端，结合 Suspense 提升感知性能。
*   **混合使用：** 一个应用中可以根据不同页面的需求混合使用多种策略 (Next.js 的核心优势)。
  


##  样式化 (Styling)

*   **多种方案支持：**
    *   **CSS Modules：** 默认推荐，提供局部作用域 CSS。
    *   **全局 CSS：** 传统方式，需在特定文件导入 (如 `pages/_app.js` 或 `app/layout.js`)。
    *   **Tailwind CSS：** 高度集成，强烈推荐，极大提升开发效率。
    *   **CSS-in-JS：** 如 `styled-components`, `emotion` (通常需要额外配置 `next.config.js` 和 Babel)。
    *   **Sass/SCSS：** 内置支持，需要安装 `sass`。
*   **App Router 注意点：** 全局样式导入位置 (`app/layout.js`)，CSS Modules 和 Tailwind 用法不变。
  

## 优化 (Optimizations)

*   **图片优化 (`next/image`):** 自动优化尺寸、格式、懒加载，提升性能。
*   **字体优化 (`next/font`):** 自动托管和优化 Web 字体，减少布局偏移。
*   **脚本优化 (`next/script`):** 优化第三方脚本加载策略 (`afterInteractive`, `lazyOnload`, `worker`)。
*   **元数据 (`next/metadata` - App Router):** 简化 SEO 管理，定义页面的 `<title>`, `<meta>` 标签等。
*   **中间件 (`middleware.js`):** 在请求完成前运行代码，用于重定向、重写、身份验证、日志等。
*   **缓存策略：** 理解 Next.js 内置的数据缓存、路由缓存、全路由缓存机制及其配置。
  

## 部署与配置 (Deployment & Configuration)

*   **构建 (`next build`):** 生成生产优化代码。
*   **运行 (`next start`):** 启动生产服务器。
*   **托管平台：** Vercel (首选，无缝集成)、Netlify、AWS、GCP、Azure、Node.js 服务器等。
*   **环境变量：** `.env.local`, `.env.development`, `.env.production` 和 `NEXT_PUBLIC_` 前缀。
*   **配置文件 (`next.config.js`):** 自定义 Webpack/Babel、重定向、重写、头信息、输出格式 (静态导出) 等。
*   **静态导出 (`next export` - Pages Router)：** 将应用导出为纯静态 HTML 文件 (仅限 SSG)。
  

## API 功能 (API Features)

*   **API 路由 (App Router: `/app/api/route.js`, Pages Router: `/pages/api/*.js`):** 在 Next.js 应用内创建后端 API 端点。
*   **处理请求：** 处理 `GET`, `POST`, `PUT`, `DELETE` 等 HTTP 方法。
*   **连接数据库/外部服务：** 在 API 路由中安全地访问数据库 (如 PostgreSQL, MongoDB) 或调用第三方 API。
*   **边缘运行时 (Edge Runtime):** 将 API 或部分逻辑部署到全球分布的边缘网络 (超低延迟)。
  

## 状态管理与生态 (State Management & Ecosystem)

*   **客户端状态：** React Context API, Zustand, Jotai, Redux Toolkit 等 (用于跨组件共享状态)。
*   **服务器状态/数据同步：** `SWR`, `TanStack Query (React Query)` (管理异步数据、缓存、更新)。
*   **表单：** React Hook Form (推荐), Formik。
*   **类型安全：** TypeScript 深度集成 (官方模板支持)。
*   **测试：** Jest, React Testing Library, Cypress, Playwright。
*   **认证：** NextAuth.js (推荐), Clerk, Auth0, Firebase Auth 等。



## 进阶概念 (Advanced Concepts)

*   **React Server Components (RSC) vs Client Components (App Router):** 理解组件在何处渲染（服务器/客户端）及其能力和限制。
*   **Suspense (App Router 深度集成)：** 优雅地处理异步操作和数据加载的等待状态。
*   **自定义服务器：** 使用 `next start` 启动自定义 Node.js/Express/Koa 服务器 (通常不必要，除非有特殊需求)。
*   **国际化 (i18n)：** 内置路由和内容翻译支持。
*   **分析 (Analytics)：** Vercel Speed Insights, Google Analytics 等集成。
  

## 学习建议

1. 从[官方文档开始](https://nextjs.org/docs) 是最好的教程，尤其是入门部分和 App Router 文档。[中文文档也不错](https://nextjs.cn/) (但更新可能稍慢)。
2. 选择 App Router： 虽然 Pages Router 成熟，但 App Router 代表了 Next.js 的未来方向，功能更强大。新项目建议直接用 App Router。
3. 动手实践： 用 npx create-next-app@latest 创建一个新项目，按照大纲逐个分支探索。修改代码，看效果。
4. 理解核心渲染策略 (SSR, SSG, ISR)： 这是 Next.js 区别于普通 React 应用的核心竞争力，务必花时间理解它们的区别和适用场景。
5. 掌握数据获取： 学会在服务器端 (Server Components, getStaticProps/getServerSideProps) 和客户端获取数据。
6. 善用优化功能： 特别是 next/image 和 next/font，对性能提升显著。
7. 拥抱 Tailwind CSS： 能极大提升 UI 开发效率，与 Next.js 集成完美。
8. 不要怕犯错： 遇到错误是学习过程的一部分，善用搜索引擎和社区 (GitHub Discussions, Stack Overflow)。