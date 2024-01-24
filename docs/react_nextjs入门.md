## react nextjs 入门

### 1. 安装
> 1. 手动安装
> 
`yarn add react react-dom next`
> 2. 使用脚手架(ts模板需要加 --typeScript)
> 
`yarn create next-app`

### 2. 添加scripts 
```typescript
"scripts": {
  "dev": "next dev",  // 以开发模式启动 Next.js
  "build": "next build", // 构建用于生产环境的应用程序
  "start": "next start", // 启动 Next.js 生产环境服务器
  "lint": "next lint" // 设置 Next.js 的内置 ESLint 配置
}
```
### 3. 项目文件结构说明

- pages 目录
> 1. 一个页面（page）就是从`pages`目录下的`js`、`jsx`、`ts`或`tsx`文件导出的React组件
> 2. 框架会根据文件名和目录结构，生成约定式路由，例如/pages/about.tsx，被映射到`/about`，并且可以添加动态路由参数
> 3. api目录：进行mock测试数据，或者请求后端数据
> 4. _app.ts：自定义首页内容

- public 目录 --  存储静态资源，部署后映射为‘/’目录
### 4. 获取数据

- getStaticProps
- getStaticPaths
- getServerSideProps

### 5. 更多
[理解 Next.js 中的 CSR、SSR、SSG、ISR 以及 Streaming - 掘金](https://juejin.cn/post/7162775935828115469#heading-8)
