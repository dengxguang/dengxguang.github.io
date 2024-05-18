// // 单向链表
// const createLinkList = (arr) => {
//   const len = arr?.length || null;
//   if (!len) return null;

//   let currentNode = {
//     value: arr[len - 1]
//   }

//   if (len === 1) return currentNode;

//   for (let k = len - 2; k >= 0; k--) {
//     currentNode = {
//       value: arr[k],
//       next: currentNode
//     }
//   }

//   return currentNode
// }

// console.log('链表：' ,JSON.stringify(createLinkList([1, 2, 3, 4]))) //{"value":1,"next":{"value":2,"next":{"value":3,"next":{"value":4}}}}


// 利用数组封装栈结构
// class Stact {
//   constructor() {
//     this.data = []
//   }

//   push(item) {
//     this.data.push(item)
//   }

//   pop() {
//     return this.data.pop()
//   }

//   peek() {
//     return this.data[this.data.length - 1]
//   }

//   empty() {
//     return this.data.length === 0
//   }

//   get size() {
//     return this.data.length
//   }
// }


// 利用链表实现栈
class ListNode {
  val = null
  next = null
  constructor(val, next = null) {
    this.val = val;
    this.next = next
  }
}

// 出栈复杂度为O(n)，需要优化
// class Stack {
//   list = null
//   top = null
//   constructor() {
//     this.list = null
//   }
//   push(val) {
//     const node = new ListNode(val) // 将元素构建成一个链表节点
//     if (this.empty()) {
//       // 栈为空时入栈直接将元素节点作为链表头元素（作为栈底元素存在）
//       this.list = node
//     } else {
//       // 栈不为空时入栈，将元素添加到链表尾部（栈顶）
//       this.top.next = node
//     }
//     // 更新最后一位
//     this.top = node
//   }
//   pop() {
//     // 栈内只有一个元素
//     if (this.list === this.top) {
//       const ans = this.list.val
//       this.list = null
//       this.top = null
//       return ans
//     }

//     let temp = this.list
//     while (temp.next !== this.top) {
//       temp = temp.next
//     }
//     // 一直循环到找到最后一个元素为止
//     const ans = temp.next.val
//     // 将其断开链接
//     temp.next = null
//     this.top = temp
//     return ans // 返回结果
//   }
//   peek() {
//     return this.top ? this.top.val : null
//   }
//   empty() {
//     return this.list === null
//   }
//   get size () {
//     let count = 0;
//     let p = this.list;
//     while(p && p.val) {
//       ++count;
//       p = p.next;
//     }
//     return count
//   }
// }

// 优化版本
class Stack {
  list = null
  len = 0
  constructor() {
    this.list = null;
  }

  empty() {
    return this.list === null
  }

  push (val) {
    if(this.empty()) {
      this.list = new ListNode(val)
    } else {
      this.list = new ListNode(val, this.list)
    }
    this.len++
  }

  pop() {
    if(this.empty()) return null
    const value = this.list.val
    this.list = this.list.next
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

