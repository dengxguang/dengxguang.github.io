## 复杂度
---

## 八大数据结构

### 栈

> 栈 是一种 `后进先出` 的数据结构，js中没有栈.

```js
// 数组实现栈数据结构
const stack = [];
// 入栈
stack.push(1);
stack.push(2);
stack.push(3);
// 出栈
stack.pop(); // 3
```
#### 封装栈

> 一个栈通常包含入栈,出栈,获取栈顶元素,获取栈大小,判断栈是否为空等操作。

```js
class Stack {
  list = null
  len = 0
  constructor() {
    this.list = null;
    len = 0;
  }

  empty() {
    return this.list === null
  }

  push (val) {
    if(this.empty()) {
      // 当栈为空，直接将链表节点作为栈底（和栈顶元素存在）
      this.list = new ListNode(val)
    } else {
      // 当栈不为空，则将原栈中的列表作为栈下元素，新来的作为栈顶元素（链表头）
      this.list = new ListNode(val, this.list)
    }
    this.len++
  }

  pop() {
    if(this.empty()) return null
    const value = this.list.val; // 保存栈顶的值（链表头的值）
    this.list = this.list.next; // 将栈顶元素移除（移除链表头，将next作为新的链表头）
    this.len--;
    return value
  }

  peek() {
    if(this.empty()) return null
    return this.list.val
  }

  get size () {
    return this.len
  }
}

// 测试
const stact = new Stack()
if (stact.empty()) {
  console.log('栈为空')
}
console.log('栈大小为：', stact.size)
stact.push(1)
stact.push(2)
stact.push(3)
console.log('栈大小为：', stact.size)
if (stact.peek() === 2) {
  console.log('探查到栈顶元素是数字 2 没错啦～')
}
console.log('弹出栈顶元素：', stact.pop())
console.log('弹出一个元素后栈大小为：', stact.size)
```

#### 使用场景

1. 十进制转换二进制
2. 有效括号
3. 函数调用堆栈

#### LeeCode题目

1. 有效括号
2. 二叉树的前序遍历

### 队列

> 队列 是一种 `先进先出` 的数据结构，js中没有队列，可以用Array实现队列数据结构。

```js
// 使用数组实现队列数据结构
const queue = [];

// 入队
queue.push(1)
queue.push(2)
queue.push(3)

// 出队
queue.shift() // 1
queue.shift() // 2
queue.shift() // 3
```

#### 使用场景

1. js队列中的任务队列
2. 计算最近请求次数

#### LeeCode 题目

1. 最近的请求次数

### 链表

> **链表** 是指在物理存储单元上非连续、非有序的数据结构。数据元素的逻辑顺序是通过链表中的指针链接次序实现的。
>
> **链表** 由一个个节点组成，每个节点包含 存储的数据域 和 存储下一个节点地址的指针域。
>
> js中没有链表，可以使用Object模拟链表

```ts
// ts使用Object模拟链表

interface ILinkListNode {
  value: number;
  next?: ILinkListNode
}

const createLinkList = (arr: number[]): ILinkListNode => {
  const len = arr?.length || null;
  if(!len) return null;

  let currentNode = {
    value: arr[len - 1]
  }

  if(len === 1) return currentNode;

  for(let k = len - 2; k >= 0; k--) {
    currentNode = {
      value: arr[k],
      next: currentNode
    }
  }

  return currentNode
}
```

#### 链表操作

##### 插入

**单向链表插入**
- 队头插入步骤：
  1. 将新Node节点的next指针指向原Head头节点
  2. 链表Head头节点指向新Node节点。

- 队尾插入步骤：
  1. 将新的Node节点next指针置为NULL。
  2. 将原队尾节点的next指针指向新的Node节点

- 中间插入步骤：
  1. 获取插入位置的前一个元素，因为链表是单向的，直接获取插入位置元素后将无法获取插入位置前的元素。
  2. 将新Node节点的next指针指向需要插入的位置。
  3. 将插入位置的前一个元素的next指针指向新的Node节点，形成链表。

**双向链表插入**

todo...

**循环链表插入**

todo...

##### 删除

### 集合

### 字典

### 树

### 图

### 堆