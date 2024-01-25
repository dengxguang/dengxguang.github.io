### 一、CSS沙箱类型
#### 1. strictStylelsolation 

- 定义
> **样式隔离的严格模式，属于 **`**Shadow DOM 沙箱**`

- Shadow Dom 介绍
> 1. 定义
> - 可以将一个隐藏的、独立的DOM附加到一个元素上，一般来说是微应用的容器<div>上
> - Shadow DOM 并不是什么新技术，我们常见的`video`、`audio`用到的就是Shadow DOM，浏览器把一些相关逻辑和内部结构封装在里面。外部看来是一个`video`，但是里面包含着对应的按钮、轨道、滚动条等结构。
> 2. 相关API
> - Shadow host：一个常规的Dom节点，Shadow DOM 会被附加到这个节点上。
> - Shadow tree：Shadow DOM 内部的 DOM树。
> - Shadow boundary：Shadow DOM 结束的地方，也是常规DOM开始的地方。
> - Shadow root：Shadow tree的根节点。

- 原理
> 使用Shadow DOM 将各个子应用包裹起来。

- 实现
> 1. 实现步骤
> - 把当前元素的内容拿出来
> - 生成`Shadow DOM`
> - 再把刚刚的内容放入这个Shadow DOM
> - 清除这个元素，并追加 Shadow DOM

```javascript
const shadowDOMSection = document.querySelector('#shadow-dom');

const appElement = shadowDOMIsolation(`
  <div class="wrapper">
    <style>p { color: purple }</style>
    <p>内部文本</p>
  </div>
`);

shadowDOMSection.appendChild(appElement);


function shadowDOMIsolation(contentHtmlString) {
  // 清理 HTML
  contentHtmlString = contentHtmlString.trim();

  // 创建一个容器 div
  const containerElement = document.createElement('div');
  // 生成内容 HTML 结构
  containerElement.innerHTML = contentHtmlString; // content 最高层级必需只有一个 div 元素

  // 获取根 div 元素
  const appElement = containerElement.firstChild;

  const { innerHTML } = appElement;
  // 清空内容，以便后面绑定 shadow DOM
  appElement.innerHTML = '';

  let shadow;

  if (appElement.attachShadow) {
    // 兼容性更广的写法
    shadow = appElement.attachShadow({ mode: 'open' });
  } else {
    // 旧写法
    shadow = appElement.createShadowRoot();
  }

  // 生成 shadow DOM 的内容
  shadow.innerHTML = innerHTML;

  return appElement;
}

```
现在就实现了把`div.wrapper`与外部隔离，不要让里面的`<style>`影响到外部的`<p>`。
#### 2. experimentalStylelsolation

- 定义
> **样式隔离的实验性模式， 属于**`** Scoped CSS 沙箱**`

- 原理
> 给所有的样式选择器前面都添加上当前挂载容器，例如：

```css
// 假设应用名称 waybill
.app-main {
  font-size: 14px;
}

// 处理后
// 处理规则：普通选择器 -> 微应用容器选择器 普通选择器
div[data-qiankun-waybill] .app-main {
  font-size: 14px;
}
```

- 实现

二、参考<br />[Qiankun实践——实现一个CSS沙箱 - 掘金](https://juejin.cn/post/7153140440777097224#heading-5)

