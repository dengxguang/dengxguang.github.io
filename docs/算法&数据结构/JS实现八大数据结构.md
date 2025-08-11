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

### （单向）链表 Linked List

> **链表** 是指在物理存储单元上非连续、非有序的数据结构。数据元素的逻辑顺序是通过链表中的指针链接次序实现的。
>
> **链表** 由一个个节点组成，每个节点包含 存储的数据域 和 存储下一个节点地址的指针域。
>
> js中没有链表，可以使用Object模拟链表

**特点**
   - **动态大小：**表的大小在运行时可以变化。
   - **每个节点包含指针：**节点之间通过指针连接，不需要连续内存空间。

**优缺点**
  - `优点`
    - **插入和删除效率高：**在链表中间插入或删除元素时，只需要修改指针，时间复杂度为O(1)。
    - **动态大小：**可以灵活地扩展或缩减链表，不需要预定义大小。
  - `缺点`
    - **查找效率低：**由于链表不是连续存储的，要访问某个元素必须从头节点开始，时间复杂度为O(n)。
    - **额外空间：**每个节点需要存储指针，占用更多内存。
  
**适用场景**
  - 需要频繁插入和删除操作的场景（内存管理、队列实现）
  - 当数据量不确定时，链表比数组更灵活

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

#### 基础单向链表

```ts
class Node {
  value: number;
  next: Node | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

class LinkedList {
  head: Node | null = null;

  append(value: number): void {
    const newNode = new Node(value);
    if (!this.head) {
        this.head = newNode;
        return;
    }
    let current = this.head;
    while (current.next) {
        current = current.next;
    }
    current.next = newNode;
  }

  print(): void {
    let current = this.head;
    while (current) {
        console.log(current.value);
        current = current.next;
    }
  }
}

const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.print();  // 输出: 1 2 3

```

#### 单向链表操作：插入、查找、删除

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

**单向链表的实现**

```ts
  // 1. 定义链表节点（Node）: 链表的每个节点包含数据和指向下一个节点的指针。
  class Node<T> {
    data: T;
    next: Node<T> | null = null;

    constructor(data: T) {
      this.data = data;
    }
  }

  // 2.实现单向链表类
  class SinglyLinkedList<T> {
    head: Node<T> | null = null;

    // 插入到队头
    insertAtHead(data: T): void {
      const newNode = new Node(data);
      newNode.next = this.head; // 新节点指向原来的头节点
      this.head = newNode; // 更新头节点为新节点
    }

    // 插入到队尾
    insertAtTail(data: T): void {
      const newNode = new Node(data);

      if (!this.head) {
        this.head = newNode; // 如果链表为空，将新节点设置为头节点
        return;
      }

      let current = this.head;
      while (current.next) {
        current = current.next; // 遍历到链表的最后一个节点
      }
      current.next = newNode; // 在最后一个节点后插入新节点
    }

    // 在指定位置插入节点（从 0 开始）
    insertAtIndex(data: T, index: number): void {
      if (index < 0) return; // 索引不能小于 0
      const newNode = new Node(data);

      if (index === 0) {
        this.insertAtHead(data); // 如果插入位置是头节点，直接插入到头部
        return;
      }

      let current = this.head;
      let count = 0;
      while (current && count < index - 1) {
        current = current.next; // 找到插入位置的前一个节点
        count++;
      }

      if (current) {
        newNode.next = current.next;
        current.next = newNode; // 在指定位置插入节点
      } else {
        console.log("Index out of bounds");
      }
    }

    // 查找节点
    find(data: T): Node<T> | null {
      let current = this.head;
      while (current) {
        if (current.data === data) {
          return current; // 找到数据匹配的节点
        }
        current = current.next;
      }
      return null; // 没有找到
    }

    // 删除节点
    delete(data: T): void {
      if (!this.head) return; // 链表为空时，不进行删除操作

      // 如果要删除的节点是头节点
      if (this.head.data === data) {
        this.head = this.head.next; // 头节点指向下一个节点
        return;
      }

      let current = this.head;
      while (current.next && current.next.data !== data) {
        current = current.next; // 找到要删除节点的前一个节点
      }

      if (current.next) {
        current.next = current.next.next; // 删除当前节点的下一个节点
      } else {
        console.log("Node not found");
      }
    }

    // 打印链表
    print(): void {
      let current = this.head;
      let result = [];
      while (current) {
        result.push(current.data);
        current = current.next;
      }
      console.log(result.join(" -> "));
    }
  }

  // 3. 使用示例
  const list = new SinglyLinkedList<number>();

  // 插入到队头
  list.insertAtHead(10);  // 链表: 10
  list.insertAtHead(20);  // 链表: 20 -> 10
  list.insertAtHead(30);  // 链表: 30 -> 20 -> 10

  // 插入到队尾
  list.insertAtTail(40);  // 链表: 30 -> 20 -> 10 -> 40
  list.insertAtTail(50);  // 链表: 30 -> 20 -> 10 -> 40 -> 50

  // 在指定位置插入（例如插入到索引 2）
  list.insertAtIndex(25, 2);  // 链表: 30 -> 20 -> 25 -> 10 -> 40 -> 50

  // 查找元素
  const foundNode = list.find(25);
  if (foundNode) {
      console.log(`Found node with value: ${foundNode.data}`);  // 输出: Found node with value: 25
  } else {
      console.log("Node not found");
  }

  // 删除节点
  list.delete(10);  // 删除值为 10 的节点
  list.print();  // 输出: 30 -> 20 -> 25 -> 40 -> 50
  list.delete(30);  // 删除值为 30 的节点
  list.print();  // 输出: 20 -> 25 -> 40 -> 50
  list.delete(100);  // 输出: Node not found

```

**总结**
- 插入操作：
  - 队头插入：将新节点插入到链表的头部。
  - 队尾插入：将新节点插入到链表的尾部。
  - 中间插入：在指定位置（索引）插入新节点，若索引超出范围，则不插入。
- 查找操作：通过遍历链表查找指定数据的节点，返回节点或null。
- 删除操作：删除指定数据的节点，如果是头节点则直接更新头节点，其他情况需要遍历找到目标节点并删除。
- 打印链表：将链表中的数据按顺序输出。

### 双向链表（Doubly Linked List）
#### 定义
> 双向链表是一种链表数据结构，它的每个节点都包含三个部分：
> 1. **数据部分：**储存节点数据
> 2. **指向下一个节点的指针 next：**
> 3. **指向上一个节点的指针 prev：** 

每个节点既有指向下一个节点的指针，又有指向上一个节点的指针，因此可以在双向链表中从前向后遍历，也可以从后向前遍历。

#### 特点
  - **双向遍历：**

  - **动态大小：**

  - **双向链接：**


#### 解决的问题
双向链表解决了单向链表的一些问题，尤其是`双向遍历`和`高效的删除`操作，提供了更高的灵活性。
- **双向遍历：**

- **高效删除：**


#### 优缺点
- `优点`
  1. **双向访问：**

  2. **高效的插入和删除：**

  3. **易于实现双向队列：**


- `缺点`
  1. **空间开销大：**

  2. **遍历性能差：**

  3. **指针管理更复杂：**


#### 适用场景
  - **双向遍历的需求：**

  - **高效的插入和删除操作：**

  - **双端队列（Deque）：**

  - **实现复杂的结构：**

  - **编辑器的历史记录功能：**


#### 代码实现
```ts
class Node<T> {
  data: T;
  next: Node<T> | null = null;
  prev: Node<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

class DoublyLinkedList<T> {
  head: Node<T> | null = null;
  tail: Node<T> | null = null;

  // 插入到队头
  insertAtHead(data: T): void {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = this.tail = newNode; // 如果链表为空，头尾指向新节点
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode; // 更新头节点
    }
  }

  // 插入到队尾
  insertAtTail(data: T): void {
    const newNode = new Node(data);
    if (!this.tail) {
      this.head = this.tail = newNode; // 如果链表为空，头尾指向新节点
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode; // 更新尾节点
    }
  }

  // 删除指定节点
  delete(data: T): void {
    let current = this.head;
    while (current) {
      if (current.data === data) {
        if (current.prev) current.prev.next = current.next;
        if (current.next) current.next.prev = current.prev;
        if (current === this.head) this.head = current.next;
        if (current === this.tail) this.tail = current.prev;
        return;
      }
      current = current.next;
    }
    console.log("Node not found");
  }

  // 查找指定数据
  find(data: T): Node<T> | null {
    let current = this.head;
    while (current) {
      if (current.data === data) {
        return current; // 找到节点返回
      }
      current = current.next;
    }
    return null; // 未找到
  }

  // 打印链表
  print(): void {
    let current = this.head;
    let result = [];
    while (current) {
        result.push(current.data);
        current = current.next;
    }
    console.log(result.join(" <-> "));
  }

  // 从尾部打印链表
  printReverse(): void {
      let current = this.tail;
      let result = [];
      while (current) {
          result.push(current.data);
          current = current.prev;
      }
      console.log(result.join(" <-> "));
  }
}

const list = new DoublyLinkedList<number>();

// 插入到队头
list.insertAtHead(10);
list.insertAtHead(20);

// 插入到队尾
list.insertAtTail(30);

// 打印链表
list.print();  // 输出: 20 <-> 10 <-> 30

// 删除节点
list.delete(10);

// 打印链表
list.print();  // 输出: 20 <-> 30

// 打印反向链表
list.printReverse();  // 输出: 30 <-> 20

```
#### 总结
- 双向链表通过增加一个prev指针，使得每个节点都可以双向访问（从头到尾或从尾到头）。
- 它提供了比单向链表更高效的删除操作和双向遍历，特别适用于需要频繁在链表中间插入和删除节点的场景。
- 但它也有更高的内存开销和指针管理的复杂性。


### 循环链表

### 集合

### 字典

### 树

### 图

### 堆
