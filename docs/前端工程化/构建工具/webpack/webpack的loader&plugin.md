## loader
#### 什么是loader
loader：是模块加载器，用于加载资源文件并对模块的代码进行转换。

- 可以在`import`或者`load(加载)`模块时预处理文件。
- 可以将文件从不同的语言（如TypeScript）转换成JavaScript，或将内联图片转换成data URL等等。
- 处理一个文件可以使用多个loader，loader的执行属性是和本身顺序相反的，即最后一个loader最先执行，第一个loader最后执行；
- 第一个执行的loader接收源文件内容作为参数，其他loader接收前一个执行的loader的返回值作为参数。最后执行的loader会返回此模块的JavaScript源码。
`

#### loader 分类

1. **同步loader**

无论是 `return` 还是 `this.callback`都可以同步返回转换后的 content 值。
```javascript
module.exports = function mySyncLoader (content, map, mate) {
  content += '\n';
  return content;
}
```
`this.callback`方法更加灵活，因为它允许传入多个参数，而不仅仅是 content。
```javascript
module.exports = function mySyncLoader (content, map, mate) {
  this.callback(null, content, map, mate)
  return; // 调用 callback 函数时，总是返回 undefined
}
```

2. **异步loader**

对于异步 loader，使用 `this.async()`来获取 `callback`函数
```javascript
module.exports = function (content, map, mate) {
  const callback = this.async();
  setTimeout(() => {
    callback(null, content, map, mate)
  }, 5000)
}
```

**Tip**<br />**loader** 最初设计为可以在同步 loader pipelines（如Node.js，使用 enhanced-require）以及在异步 pipelines（如：webpack）中运行。然而，由于同步计算过于耗时，在Node.js这样的单线程环境下进行此操作并不是最好的方案，我们建议尽可能地使你的 loader 异步化。但是如果计算量很小，同步 loader 也是可以的。


1. **Raw loader**

默认情况下，资源文件会被转化为UTF-8字符串，然后传给 loader。通过设置 `raw`为 `true`，loader 可以接收原始的 `Buffer`。每一个 loader 都可以用 String 或者 Buffer 的形式传递给它的处理结果。compiler 将会把他们在 loader 之间相互转换。
```javascript
module.exports = function (content) {
	assert(content instanceof Buffer)
  // 这里也可以返回一个 Buffer，即使不是 “raw” loader 也没问题
	return someSyncOperation(content);
}
module.exports.raw = true;
```

4. **pitching loader**

#### loader 上下文 -- loader context
loader context 表示在loader内使用`this`可以访问的一些方法或属性。<br />[Loader Interface | webpack 中文文档](https://www.webpackjs.com/api/loaders/#the-loader-context)
#### 自定义loader
loader 本质上是导出为函数的 JavaScript 模块。`loader runner`会调用此函数，然后将上一个loader的产物或资源传进去。函数的`this`作为上下文会被 webpack 填充。<br />起始 loader 只有一个参数：资源文件的内容。compiler 预期得到最后一个 loader 产生的处理结果，这个结果的类型为 `String` 或则 `Buffer`(能够被转为string)，代表了模块的 JavaScript 代码。另外还可传递一个可选的 SourceMap 结果，格式为 JSON 对象。<br />在 **同步模式** 中，如果是单个处理结果，可以直接 return 返回；如果是多个结果，则必须调用`this.callback()`。<br />在 **异步模式 **中，必须调用`this.async()`来告诉 loader runner 等待异步结果，它会返回`callback`回调函数。随后 loader 必须返回 `undefined`并且调用该回调函数。
```javascript
/**
* @param {String | Buffer} content 源文件的内容
* @param {Object} map 可以被 https://github.com/mozilla/source-map 使用的 SourceMap 数据
* @param {any} [mate] mate 数据，可以是任何内容
*/
module.exports = function myWebpackLoader (conent, map, mate) { //... }
```
## plugin


参考<br />[webpack loader和plugin编写 - 掘金](https://juejin.cn/post/6844903689442820110#heading-7)<br />[详解webpack plugin的原理及编写一个plugin - 掘金](https://juejin.cn/post/7099369671652016158)
