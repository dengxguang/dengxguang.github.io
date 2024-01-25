### 获取未导出的Type
> 某些场景下我们引入第三方的库的时候会发现想要使用的组件并没有导出我们需要的组件参数类型或者返回值类型，这时我们可以通过`ComponentProps/ReturnType`来获取到想要的类型

```typescript
import { Button } from 'library' // 但没导出props type
type ButtonProps = React.ComponentProps<typeof Button> // 获取props
type AlertButtonProps = Omit<ButtonProps, 'onClick'> // 去除onClick
const AlertButton: React.FC<AlertButtonProps> = props => (
<Button onClick={() => alert('hello')} {...props} />
)
```
```typescript
function foo () {
  return {baz: 1}
}

type FooReturn = RetrunType<typeof foo> // {baz: number}
```
### 使用Type还是Interface

- **常用规则**
   - 在定义公共API时（例如编辑一个库）使用`interface`，这样可以方便使用者继承接口
   - 在定义组件属性`props`和状态`state`时，建议使用`type`，因为`type`的约束性更强
- **区别**
   - `type`类型不能二次编辑，而`interface`可以随时扩展

```typescript
interface Animal {
  name: string;
}
// 可以继续在原有的属性基础上，添加新属性 color
interface Animal {
  color: string;
}
type Animal = {name: string}
// type类型不支持属性扩展
// Error: Duplicate identifier 'Animal'
type Animal = {color: string;
```

### 常用Props ts 类型（基础属性）

```typescript
type AppProps = {
  message: string;
  count: number;
  disabeld: boolean;
  /* 数组类型 */
  names: string[];
  status: 'waiting' | 'success';
  /* 任意需要使用其属性的对象，不推荐使用，但作为占位符很有用  */
  obj: Object;
  /* 作用和‘object’几乎一样，和‘Object’完全一样 */
  obj2: {};
  obj3: {
    id: string;
    title: string;
  };
  /* 对象数组 */
  objArray: {
    id: string;
    title: string;
  }[];
  /* 任意数量属性的字典，具有相同类型 */
  dict1: {
    [key: string]: MyTypeHere
  };
  /* 作用和dict1完全相同 */
  dict2: Record<string, MyTypeHere>;
  /* 任意完全不会调用的函数 */
  onSomething: Function;
  /* 没有参数&返回的函数 */
  onClick: () => void;
  /* 携带参数的函数 */
  onChange: (id: number) => void;
  /* 携带点击事件的函数*/
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  /* 可选的属性 */
  optional?: OptionalType;
}
```

### 常用React属性类型

```typescript
export declare interface AppBetterProps {
  children: React.ReactNode; // 一般情况下推荐使用，支持所有类型 Great
  functionChildren: (name: string) => React.ReactNode;
  style?: React.CSSProperties; // 传递style对象
  onChange?: React.FormEventHandler<HTMLInputElement>
}
export declare interface AppProps {
  children1: JSX.Element; // 差，不支持数组
  children2: JSX.Element | JSX.Element[]; // 一般，不支持字符串
  children3: React.ReactChildren; // 忽略命名，不是一个合适的类型，工具类类型
  children4: React.ReactChild[]; // 很好
  children: React.ReactNode; // 最佳，支持所有类型，推荐使用
  functionChildren: (name: string) => React.ReactNode;
  styles?: React.CSSProperties; // 传递 style 对象
  onChange?: React.FormEventHandler<HTMLInputElement> // 表单事件，泛型参数是 event.target的类型
}
```

### Forms and Event
#### 1. onChange
> change事件，有两个定义参数类型的方法，两种方法均可

- 第一种方法使用推断的方法签名（例如：`React.FormEvent<HTMLInputElement>: void`）
- 第二种方法强调使用`@types/react`提供的委托类型
