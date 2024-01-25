### 1. 生命周期
- 应用生命周期
1. 特点：只能写到App.vue里，在其他页面里监听无效
2. 关于App.vue
> uni-app的主组件，是入口文件，所有的页面切换均在App.vue下进行，其本身不是页面，因此该页面没有template模板，不能便携视图。一般情况下会在uni-app的App.vue文件进行如下操作：
> 1. 调用应用生命周期
> 2. 配置全局的css样式
> 3. 设置全局需要存储的`globalData`，然后可以在任意的位置通过`getApp()`获取uni-app小程序实例，进而拿到`globalData`

3. 应用生命周期
> 1. onLaunch
> 2. onShow
> 3. onHide
> 4. onError
> 5. onUniNViewMessage

4. 代码是咧
```typescript
<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
```

- 页面生命周期：参考小程序的生命周期函数
1. 特点：
> 1. 页面初始化时，首先触发`onLaunch`、`onShow`、`onReady`三个生命周期函数
> 2. 这三个生命周期函数里均可获取data的数据
> 3. 通过`tabbar`切换页面，页面都不会销毁，只会触发`onLaunch`、`onShow`、`onReady`，从详情页面返回时，详情页触发 `onUnLoad`，页面被销毁。

- 组件生命周期：参考了vue的标准生命周期
1. 特点
> 1. 当组件所在的页面被加载时，先触发页面`onLaunch`、`onShow`，然后再执行组件`beforeCreate`、`created`、`beforeMount`、`mounted`，最后触发页面的`onReady`函数。
> 2. 当组件所在的页面被销毁时，先触发页面的`onUnLoad`，之后触发组件的`beforeDestroy`和`destroyed`，最后一级页面才触发`onShow`。

2. 总结
> - `page`页面建议使用微信小程序的生命周期函数
> - `component`组件建议使用vue的生命周期函数
> - 不建议混用

