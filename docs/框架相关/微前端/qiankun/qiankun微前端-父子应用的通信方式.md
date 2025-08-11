### 1. 基于qiankun通讯API--initGlobalState 
**react/vue实现应用通信（一）**

- 参数： state -- Record<string, any> 必选
- 用法：定义全局状态，并返回通信方法，建议在主应用使用，微应用通过Props获取通信方法
- 返回
`
**MicroAppStateActions：**

- **onGlobalStateChange：**(callback:  OnGlobalStateChangeCallback, fireImmediately?: boolean)=>void，在当前应用监听全局状态，有变更触发`callback`，`fireImmediately=true`立即触发callback。
- **setGlobalState：**(state: Record<string, any>) => boolean，按一级属性设置全局状态，微应用中只能修改已存在的一级属性。
- **offGlobalStateChange：**()=>boolean，移除当前应用的状态监听，微应用`unmount`是默认调用
`

- 示例

```typescript
/*主应用*/
import {initGlobalState, MicroAppStateActions} from 'qiankun'

//初始化state
const actions: MicroAppStateActions = new initGlobalState(state);
actions.onGlobalStateChange((state, prev)=>{
  //state: 变更后的状态，prev：变更前的状态
  console.log(state, prev)
})
actions.setGlobalState(state);
actions.offGlobalStateChange();

  /*子应用*/
// 从生命周期 mount 中获取通信方法，使用和 master 一直
export function mount(props) {
	props.onGlobalStateChange((state, prev) => {
    //state: 变更后的状态，prev：变更前的状态
  	console.log(state, prev)
  })
  props.setGlobalState(state);
}
```
### 2. 基于主应用配置的通信
**react/vue实现应用通信（二）**

- 主应用中配置apps时以props将数据传递下去
```javascript
// src/app.js
export const qiankun = fetch('/config').then((config) =>{
  return {
  	apps: [
      {
        name: 'app1',
        entry: '//localhost:1221',
        props: {
          onClick: (event) => console.log(event),
          name:'000',
          age: 21
        }
      }
    ]
    
  }
})
```

- 子应用在生命周期`bootstrap/mount`中获取props即可消费数据
### 3. 将主应用中的方法挂载到window对象
**react/vue实现应用通信（三）**

### bigfish框架（umi）实现通讯
**基于**`**useModel()**`**的通信，umi推荐的方案**<br />确保已安装@umijs/plugin-model 或 @umijs/preset-react
> - 该通信方式基于umi数据流插件，此插件已经内置于`@umi/max`方案中
> - 该通信方式需要子应用基于Umi开发并且引入了该数据流插件


- **主应用可以使用以下两个方式透传数据**
1. 使用`<MicroApp />` 、`<MicroAppWithMemoHistory />`组件模式消费应用，那么数据传递的方式就跟普通react组件通信一样，直接通过props传递即可。

```typescript
import React, {useState} from 'react'
import {MicroApp} from 'umi'

export default () => {
	const [globalState, setGlobalState] = useState({
    slogan: 'hhhhhahahahha'
  })

  return (
    <MicroApp
      name="app1"
      globalState={globalState}
      setGlobalState={setGlobalState}
    />
  )
}
```

2. 如果使用**路由绑定**的方式引入子应用，则需要在父应用的`src/app.ts`里导出一个名为`useQiankunStateForSlave()`的函数，该函数的返回值将传递给子应用：
```typescript
// src/app.ts
export function useQiankunStateForSalve() {
	const [globalState, setGlobalState] = useState({
    slogan: 'Hello MicroFrontend',
  })
  return {
    globalState，
    setGlobalState
  }
}
```

- **子应用消费数据**
1. 子应用会自动生成一个全局的Model，其命名空间为`@@qiankunStateFormMaster`。通过`useModel()`方法，在子应用的任意组件中获取并消费父应用透传的数据

```jsx
import {useModel} from 'umi'

export default () => {
  const masterProps = useModel('@@qiankunStateFromMaster');
  return <div>{JSON.stringify(masterProps)}</div>
}
```

2. 使用高阶组件`connectMaster()`来获取并消费父应用透传的数据

```jsx
import {connectMaster} from 'umi'

function MyPage(props) {
  return <div>{JSON.stringify(props)}</div>;
}

export default connectMaster(MyPage);
```

3. 在子应用的生命周期钩子中获取并消费父应用透传的数据
```typescript
// 子应用 src/app.ts
export function mount(props) {
	console.log(props)
}
```

4. 特别的，当父应用使用<MicroApp />或者<MicroAppWithMemoHistory />组件方式引入子应用时，会额外向子应用透传一个`setLoading()`方法，允许子应用在合适的时机执行，标记子应用加载为完成状态。当子应用挂在完成变成`MOUNTED`状态时，会自动标记为完成状态。

```typescript
const masterProps = useModel('@@qiankunStateFromMaster');
masterProps.setLoading(false);

//或者
function MyPage(props) {
  props.setLoading(false);
}
connectMaster(MyPage);
```
