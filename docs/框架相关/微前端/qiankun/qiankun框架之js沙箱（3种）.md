### 类型介绍

#### 1. SanpshotSandbox

- 描述
> SanpshotSandbox - 快照沙箱，支持单个微应用方案一，兼容好，性能一般，但是会逐步淘汰

- 缺点
> 1. 性能差（直接遍历整个window对象，会有很多冗余属性）
> 2. 只适用于单个微应用，原因是直接影响window对象，多个微应用有可能会冲突

- 原理
> **把主应用的 window 对象做浅拷贝，将 window 的键值对存成一个 Hash Map。之后无论微应用对 window 做任何改动，当要在恢复环境时，把这个 Hash Map 又应用到 window 上就可以了。**

- 小结
> 1. 微应用`mount`时（激活）
> - 浅复制主应用的`window`key-value快照，用于下次恢复全局环境
> - 把上次记录的变更`modifyPropsMap`应用到微应用的全局`window`,没有则跳过
> 2. 微应用 `unmount`时（失活）
> - 将当前微应用`window`的 key-value 和 `快照`的 key-value 进行`diff`，diff出来的结果用于下次恢复微应用环境的依据
> - 将上次快照的 key-value 拷贝到主应用的 window 上，以此恢复环境

#### 2. LegacySandBox

- 描述
> LegacySandbox - 支持单个微应用方案二，性能好。

- SanpshotSandbox 存在的问题
> 由于`SanpshotSandbox` 每次微应用 `unmount`时都要对每个属性做一次diff，如果有多个属性，就显得不太优雅，例如代码所示：

```sql
for (const prop in window) {
  if (window[prop] !== this.windowSnapshot[prop]) {
    // 记录微应用的变更
    this.modifyPropsMap[prop] = window[prop];
    // 恢复主应用的环境
    window[prop] = this.windowSnapshot[prop];
  }
}

```

- 优缺点
> - 优点：不需要遍历整个window对象，性能好
> - 缺点：同时只能激活一个微应用

- 实现原理
> 使用ES6的Proxy监听window属性的变化。`**LegacySandbox**`** 通过监听对**`**window**`**的修改来直接记录diff内容，因为只要对**`**window**`**属性进行设置，那么就会出现两种情况：**
> 1. **如果是新增属性，那么存到**`**addMap**`**里**
> 2. **如果是更新属性，那么把原来的键值存到**`**prevMap**`**,把新的键值存到**`**newMap**`
> 
通过 `addMap``prevMap``newMap`这三个变量就可以反推出微应用以及原来环境的变化。`qiankun`也能以此作为恢复环境的依据

- 功能
> 1. 激活
> - 恢复上次微应用运行时对window上做的所有修改
> 2. 失活
> - 还原window上的所有属性
> - 删除运行微应用window上的属性

#### 3. ProxySandBox

- 描述
> 支持同时激活多个微应用的方案。前面两种沙箱都是【单例模式】下的沙箱。无论`set`还是`get`依然是直接操作`window`对象。

- 在单例模式下，当微应用修改全局变量时，依然会在原来`window`上修改，因此如果在同一个路由页面下展示多个微应用，依然会有环境变量污染的问题。为了避免真实的`window`被污染，`qiankun` 实现了 `ProxSandbox`，它的实现思路是：
> - 把当前`window`的一些原生属性（如`document`，`location`等）拷贝出来，单独放在一个对象上，这个对象也成为`fakeWindow`
> - 之后对每个微应用分配一个`fakeWindow`
> -  当微应用修改全局变量时：
> 1. 如果是原生属性，则修改全局`window`
> 2. 如果不是原生属性，则修改`fakeWindow`里的内容
> - 微应用获取全局变量时：
> 1. 如果是原生属性，则从`widnow`里拿
> 2. 如果不是原生属性，则优先从`fakeWindow`里获取
> - 这样一来连恢复环境都不需要了，因为每个微应用都有自己一个环境，当`active`时就给这个微应用分配一个`fakeWindow`,当`inactive`时就把这个`fakeWindow`存起来，以便于之后再使用。

- 优点 
> 1. 不需要遍历整个window对象，性能好
> 2. 可以同时激活多个微应用

[全文参考链接](https://juejin.cn/post/7148075486403362846)
### 总结
> 1. `SanpshotSandbox`: 记录`window`对象，每次`unmount`都要和微应用的环境进行Diff
> 2. `LegacySandbox`: 在微应用修改`window.xxx`时，直接记录Diff，将其用于环境恢复
> 3. `ProxySandbox`：为每个微应用分配`fakeWindow`，当微应用操作`window`时，其实是在`fakeWindow`上操作
> 
要和这些沙箱结合起来使用，`qiankun`会把要执行的js包裹在立即执行函数中，通过绑定上下文和传参的方式来改变`this`和`window`的值，让它们指向`widnow.proxy`沙箱对象，最后利用`eval`来执行这个函数。

### 

