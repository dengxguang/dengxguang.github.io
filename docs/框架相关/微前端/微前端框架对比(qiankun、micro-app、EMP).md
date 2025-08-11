### 一. qiankun
##### 1. 特点

- `html entry`方式引入子应用，相比`js entry`极大降低了应用改造成本；
- 完备的沙箱方案，js沙箱做了`SnapohotSandbox`、`LegacySandbox`、`ProxySandbox`三种渐进增强的方案；
- 提供了静态资源预加载能力；

##### 2. 不足

- 适配成本较高，工程化、生命周期、静态资源路径、路由等都要做一系列的适配工作
- css 沙箱采用严格隔离会有各种问题；js沙箱在某些场景下执行性能下降严重
- 无法同时激活多个子应用，也不支持子应用保活
- 无法支持`vite`等`esmodule`脚本运行

##### 3. 特点详情

1. HTML Entry加载子应用

首先`qiankun`加载子应用的方式与`single-spa`有明显的不同。<br />`single-spa`注册子应用本质是`JS Entry`，即通过从某一地址引入js文件来加载整个子应用。<br />`qiankun`注册子应用的方式是通过一个URL，即使用`HTML Entry`的方式来引入子应用。好处是：子项目大多数是已经上线的项目，url固定的，所以不用频繁更新主应用中的注册信息，便于主应用的整合和开发。<br />**qiankun-子应用的加载**<br />`**HTML Entry**`

**方法的主要步骤如下：**
`

1. 通过url获取整个html文件，从html文件中解析出html、js和css文本，在主应用中创建容器，把html更新到容器中；
2. 动态创建style和script标签，把子应用的css和js赋值在其中；
3. 把容器放置在主应用中。
   
`
**如何解析html**
`

1. 通过url请求到子应用的index.html
2. 用正则匹配到其中的js/css相关标签，进行记录，然后删去
3. 删除html、head、body等标签
4. 返回html文本
   
`
**如何解析js**
`

1. 使用正则匹配标签
2. 对应内联js的内容会直接记录到一个对象中
3. 对于外链js会使用fetch请求内容，然后记录到这个对象中
4. 最后加载子应用时直接把内容赋值在动态构建的script中。
   
`
**如何解析css**
`

1. 正则匹配标签
2. 内联css的内容会直接记录到一个对象中
3. 外链css则会使用fetch请求内容（字符串），然后记录到这个对象中，执行时内容放到style标签，然后插入到页面。子应用卸载移除这些标签，这样会把外链css变成内联css，切换子系统不用重复请求，直接应用css样式，让子应用加载的更快。
`

1. 生命周期

项目在迁移成子应用时，需要在入口的JS配合qiankun来做一些改动，而这些改动有可能**影响子应用的独立运行。**为了解决子应用也能独立运行的问题，qiankun注入了一些变量`**window.__POWERED_BY_QIANKUN__**`，这样就可以判断当前应用是否在独立运行。<br />但是变量需要在运行时动态注入，那么该变量设置的位置需要考虑清楚，qiankun选择在single-spa提供的生命周期前进行注入，在`beforeLoad`和`beforeMount`中把变量设置为true，在`beforeUnmount`中把变量设置为false。最后qiankun暴露了**五个生命周期钩子**：**beforeLoad**、**beforeMount**、**afterMount**、**beforeUnmont**和**afterUnmount**，这五个钩子可以在**主应用注册子应用**时使用。<br />和single-spa一样的是**子应用的接入**必须暴露出三个生命周期：
`

- bootstrap（应用加载前触发）：在这里做一些全局变量的初始化，比如不会在`unmount`阶段被销毁的应用级别的缓存
- mount （应用 render 触发）：触发应用的渲染方法
- unmount （应用卸载后触发）：卸载微应用的应用实例
`

3. css隔离

css隔离主要分为两种，一种是父子之间的隔离，另一种是子子之间的隔离。子应用间的隔离，qiankun中并没有特别提出，本质上就是子应用加载时把相应的样式加载进来，在卸载时进行移除即可。而父子之间的隔离在qiankun中有两种方式：`strictStylelsolation: Shadow DOM`和`experimentalStylelsolation`。

4. js隔离

js隔离有三种隔离的做法。

5. 子应用预加载
`
启动qiankun：start(opts?)，opts可选参数中，包含了`prefetch`属性，可以设置预加载子应用静态资源，可选值有 true,all,string[],function:(apps: RegistrableApp[])=>{criticalAppNames: string[];microAppsName: string[]}。默认为true.
`
子应用预加载是一种优化策略。使用`**requestldleCallback**`通过时间切片的方式去加载静态资源，在浏览器空闲时间去执行回调函数，避免浏览器卡顿，qiankun有四种预加载策略：
> 1. 配置为`**true**`则会在第一个微应用mount完成后开始预加载其他微应用的静态资源
> 2. 配置为`**all**`则主应用`**start**`后即开始预加载所有微应用的静态资源
> 3. 配置为`**string[]**`则会在第一个微应用mounted后开始加载数组内的微应用资源
> 4. 配置为`**function**`则可完全自定义应用的资源加载时机（首屏应用或次屏应用）

**全局状态管理**<br />在微前端中各子应用需要和主应用进行通信，以获取必要的信息，子应用之间也有可能会有少量的通信需要，在`qiankun`中使用的是一种**订阅发布模式**的通信方法。

- 所需要的状态都存在window的`globalState`全局对象里，使用`onGlobalStateChange`添加监听器。
- 当调用`setGlobalState`更新值后，会触发`emitGlobal`，执行所有对应的监听器
- 当调用`offGlobalStateChange`删掉监听器。
6. 全局错误管理
`
当运行中发生错误，需要对其进行捕获，这里主要监听了`**error**`和`**unhandledrejection**`两个错误事件。
`

##### 4. 子应用的加载方式

- **4.1 基于路由配置**
> 基于 `@umijs/plugin-qiankun` 插件

1. 修改父应用的 Umi 配置文件，添加如下内容：
```javascript
// .umirc.ts
export default {
  qiankun: {
    master: {
      apps: [
        {
          name: 'app1',
          entry: '//localhost:7001',
        },
        {
          name: 'app2',
          entry: '//localhost:7002',
        },
      ],
    },
  },
};
```

2. 运行时注册子应用
3. 配置子应用

子应用需要导出必要的声明周期钩子，供父应用在适当的时机调用。基于Umi开发且引入了`qiankun`插件，需要在子应用的Umi配置文件中添加一下内容
```javascript
// umirc.ts
export default {
  qiankun: {
    slave: {}
  }
}
```

> 基于 `qiankun` 框架
> - registerMicroApps 方法



- **4.2 手动加载**
> 基于 `@umijs/plugin-qiankun` 插件
> 通过`<MicroApp />` 和 `<MicroAppWithMemoHistory />`组件 加载（或卸载）子应用


> 基于 `qiankun` 框架
> - loadMicroApp 方法


### 二. micro-app
> 基于web component + qiankun sandbox 的微前端方案 （京东）

##### 1. 特点

- 使用`web component`加载子应用相比`single-spa`这种注册监听方式更优雅
- 复用经过大量项目验证过`qiankun`的沙箱机制也使的框架更加可靠
- 组件式的API更加符合使用习惯，支持子应用保活
- 降低子应用改造成本，提供静态资源预加载能力
##### 2. 不足

- 接入成本较`qiankun`有所降低，但路由依然存在依赖
- 多应用激活后无法保持各子应用的路由状态，刷新后全部丢失
- css沙箱依然无法绝对隔离，js沙箱做全局变量查找性能有所优化
- 支持vite运行，但必须使用`plugin`改造子应用，且js代码无法做沙箱隔离
- 对于不支持`web component`的浏览器没有做降级处理
### 三. EMP方案
> 基于 webpack5 module federation的微前端方案

##### 1. 特点

- webpack 模块联邦编译可以保证所有子应用依赖解耦
- 应用去中心化的调用共享模块
- 模块原生ts支持
##### 2.不足

- 对于webpack强依赖，老旧项目不友好
- 没有有效的css沙箱和js沙箱，需要靠用户自觉
- 子应用保活、多应用激活无法实现
- 主、子应用的路由可能发生冲突
### 四. 无界方案
### 五. 总结

- qiankun方案对single-spa微前端方案做了较大的提升同时也遗留了不少的问题长时间没有解决
- micro-app方案对qiankun 方案做了较多的提升，但基于qiankun的沙箱也相应会继承其存在的问题
- EMP方案基于webpack 模块联邦编译则约束了使用范围
### 六. 参考<br />[将微前端做到极致-无界微前端方案 - 掘金](https://juejin.cn/post/7125646119727529992)
### 七、why not iframe
如果不考虑体验问题，`iframe`几乎是最完美的的微前端解决方案了。<br />`iframe`最大的特点就是提供了浏览器原生的隔离方案，不论是样式隔离、js隔离这类问题统统能被完美解决。但它的最大问题在于他的隔离无法被突破，导致应用间上下文无法被共享，随之带来的开发体验、产品体验的问题：
`

1. url不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
2. UI不同步。DOM结构不共享。想象一下屏幕右下角1/4的 iframe 里来一个遮罩层的弹窗，同时要求这个弹窗要在浏览器居中显示，还要浏览器resize是自动居中。
3. 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的`cookie`要透传到跟域名的不同子应用中实现免登效果。
4. 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。
`
其中有的问题比较好解决（问题1），有的问题可以睁一只眼闭一只眼（问题4），但是有的问题我们则很难解决（问题3），甚至无法解决（问题2）。而这些无法解决的问题恰恰又会给产品带来非常严重的体验问题，最终舍弃了 `iframe `方案。
