#### 0.开始--使用脚手架创建模板
`pnpm create vite work_order_web --template vue-ts`
#### 1.引入naive-ui组件库并引入sass

- 安装 naive-ui
> pnpm i -D naive-ui

- 使用 naive-ui
```typescript
<template>  
  <n-space>
    <n-button type="primary">hahhh</n-button>
    <n-button type="info">hahhh</n-button>
    <n-button type="primary">hahhh</n-button>
  </n-space>
</template>
<script setup lang='ts'>
import {NSpace, NButton} from 'naive-ui'

</script>
```

- 安装 sass

`pnpm i -D sass`

- 使用sass
```typescript
// 关键代码 lang='scss'
<style scoped lang="scss">
h1 {
  span {
    color: red;
  }
}
</style>
```
#### 2.引入vue-router

#### 3.引入axios

#### 4.引入pinia

#### 5.引入ESLint

#### 6.引入commitLint


#### 参考：[https://juejin.cn/post/6990553766101516325](https://juejin.cn/post/6990553766101516325)


