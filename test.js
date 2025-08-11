class Node {
  value = null;
  next = null;

  constructor(value) {
    this.value = value;
  }
}

class LinkedList {
  head = null;

  append(value) {
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

  print() {
    let current = this.head;
    while (current) {
      console.log(current.value);
      current = current.next;
    }
  }
}

const list = new LinkedList();
list.append(1);
// list.append(2);
// list.append(3);
// list.print(); // 输出: 1 2 3
