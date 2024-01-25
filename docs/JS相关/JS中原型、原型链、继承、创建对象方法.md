#### 原型
- 在js中是使用构造函数来创建一个对象的，每个构造函数的内部都有一个`prototype`属性值，这个属性是一个对象，这个对象包含了可以由该构造函数的所有实例共享的属性和方法
- 当使用构造函数新建一个对象后，在这个对象的内部将包含一个指针，这个指针指向构造函数的`prototype`属性对象的值，在 ES5 中这个指针被称为对象的原型
- 一般来说，我们是不应该能够获取这个值，但是现代浏览器中都实现了`proto`属性来让我们访问这个属性，但最好不要使用这个属性，因为它不是规范中规定的
- ES5 中新增了一个`Object.getPrototypeOf()`方法来获取对象的原型

<br />

#### 原型链

- 当访问一个对象属性时，如果这个对象内部不存在这个属性，那么就会去它的原型对象里找，这个原型对象又有自己的原型，一直这样找下去，就形成了原型链

#### new 一个实例的四个过程

1. 创建一个空对象obj
2. 修正this的指向，使用`**apply**`改变this指向，使其指向新对象，并执行构造函数。这样obj就可以访问到构造函数中的属性了
3. 设置原型链，将obj的`**__proto__**`属性指向构造函数的`**prototype**`属性
4. 返回obj

```javascript
function myNew() {
  // 创建一个空对象
  const obj = Object.create({})
  // 将 arguments 转换成数组，在调用 shift 方法返回第一个参数，也就是构造函数
  let Con = [].shift.call(arguments)
  // 链接到原型
  obj.__proto__ = Con.prototype
  // 绑定this，执行构造函数（因为apply会自动执行函数，注意现在的arguments里面只有传递进来的属性值）
  const result = Con.apply(obj, arguments)
  // 这里进行判断，如果构造函数最后又return 操作，则返回构造函数里面那个对象，否则返回obj
  return typeof result === 'object' ? result : obj
}
function Person (name, age) {
  this.name = name;
  this.age = age;
  return this;
}
const a = myNew(Person, 'dxg', '28') // {name: 'dxg', age: 28}
```

#### 创建对象方法

> 一般使用字面量的形式直接创建对象，但是这种创建方式对于创建大量相似对象的时候，会产生大量的重复代码。但 js和一般的面向对象的语言不同，在 ES6 之前它没有类的概念。但是我们可以使用函数来进行模拟，从而产生出可复用的对象创建方式，我了解到的方式有这么几种：

##### 1. 工厂模式
> 实现方式：用函数来封装创建对象的细节，从而通过调用函数来达到复用的目的。

- **缺点**
   - 创建出来的对象无法和类型联系起来，他只是简单的封装复用代码，而没有建立起对象和类型间的关系（js 工厂模式里面，所有的函数都只是Object的实例，这样的判断没有多大的意义； 而在构造函数里面，构造出来的函数不仅是Object的实例，也是构造函数的实例，而构造函数是我们自己定义的，相当于我们自己定义了一个新的对象类型，可以识别的新的对象类型；）
```javascript
function createPerson(name, age, job) {
  let o = new Object()
  o.name = name
  o.age = age
  o.job = job
  o.sayName = function() {console.log(this.name)}
  return o
}
let person1 = createPerson('ddd', 28, 'teacher')
let person2 = createPerson('xxx', 18, 'student')
```
##### 2. 构造函数模式
> 实现方式：
> - js中每个函数都可以作为构造函数，只要一个函数是通过new来调用的，那么我们就可以把它称为构造函数
> - 执行构造函数首先会创建一个对象，然后将对象的原型指向构造函数的`prototype`属性，然后将执行上下文中的`this`指向这个对象，最后再执行整个函数，如果返回不是对象，则返回新建的对象。
> - 因为this的值指向了新建的对象，因此我们可以使用this给对象赋值。

- **相对于工厂模式的优点**
   - 所创建的对象和构造函数建立起了联系，因此我们可以通过原型来识别对象的类型。
- **缺点**
   - 造成了不必要的函数对象的创建，因为在js中函数也是一个对象，因此如果对象属性中如果包含函数的话，那么每次我们都会新建一个函数对象，浪费了不必要的内存空间，因为函数是所有的实例都可以通用的

```javascript
function Person(name, age, job) {
    this.name = name
    this.age = age
    this.job = job
    this.sayName = function() { // 每次都会创建一个，造成浪费
        console.log(this.name)
    }
}
let person1 = new Person('nike', 28, 'teacher')
let person2 = new Person('nike', 28, 'teacher')
console.log(person1 instanceof Object) // true
console.log(person2 instanceof Object) // true
console.log(person1 instanceof Person) // true 与构造函数联系起来了
console.log(person1 instanceof Person) // true
```

##### 3. 原型模式
> 因为每个函数都有一个`**prototype**`属性，这个属性是一个对象，它包含了通过构造函数创建的所有实例都能共享的属性和方法。因此我们可以使用原型对象来添加公用属性和方法，从而实现代码的复用。

- **优点**
   - 这种方法相对于构造函数模式来说，解决了函数对象的复用问题。
- **缺点**
   - 没有办法通过传参来初始化
   - 如果存在一个引用类型(如Array这样)的值，那么所有的实例将共享一个对象，一个实例对引用类型值的改变会影响所有的实例

```javascript
function Person() {}
Person.prototype = {
  constructor: Person,
  skin: 'yellow',
  show: function () { console.log('happy everyday') }
}
let per3 = new Person()
console.log(per3.skin) // yellow
per3.show() // happy everyday
```

##### 4. 组合使用构造函数模式+原型模式 （这是创建自定义类型的最常见方式）
> 因为构造函数模式和原型模式分开使用都会存在一些问题，因此我们可以组合使用这两种方式
> - 通过构造函数来初始化对象的属性
> - 通过原型对象来实现函数方法的复用

- **缺点**
   - 对于代码封装性不够好

```javascript
function Person (name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype = {
  constructor: Person,
  skin: 'yellow',
  show: function() {
    console.log('happy everyday')
  }
}

const per1 = new Person('dxg', 18)
const per2 = new Person('dxg1221', 28)
console.log(per1.name) // dxg
console.log(per2.name) // dxg1221
console.log(per2.show === per1.show) // true
```

##### 5. 动态原型模式
> 这种模式将原型方法赋值的创建过程移动到了构造函数的内部，通过对属性是否存在的判断，可以实现仅在第一次调用函数时对原型对象赋值一次的效果。这种方法很好地对上面的组合模式进行了封装。

```javascript
function Person (name, age, job) {
  // 属性
  this.name = name
  this.age = age
  this.job = job
  
  // 方法
  if(typeof this.sayName !== 'function') {
    Person.prototype.sayName = function() {
      console.log(this.name)
    }
  }
}

let per1 = new Person('dxg', 18, 'software Engineer')
let per2 = new Person('dxg', 18, 'software Engineer')
console.log(per1.sayName === per2.sayName) // true
per1.sayName() // dxg
```

##### 6. 寄生构造函数模式
> 这一种模式和工厂模式的实现基本相同，它主要是基于一个已有的类型，在实例化时对实例化的对象进行扩展。这样既不修改原来的构造函数，也达到了扩展对象的目的。它的缺点和工厂模式一样，无法实现对象的识别。

```javascript
function Person(name, sex, age) {
  const person = Object.create({})
  person.name = name
  person.age = age
  person.sex = sex
  return person
}

// 有无 new 关键字 效果一样
const p1 = new Person('dxg', 'n', 18)
const p2 = Person('dxg1221', 'n', 18)
console.log(p1.name) // dxg
console.log(p2.name) // dxg1221
```

##### 7. Object构造函数创建
```javascript
let Person = new Object()
Person.name = 'dxg'
Person.age = 28
```
##### 8. 使用对象字面量
```javascript
let Person = {} // 相当于 let Person = new Object()
let Person = {
  name: 'Nike',
  age: 28
}
```

#### 继承实现方式
##### 1. 原型链
> 实现原理：使用父类的实例重写子类的原型

- **缺点：**
   - 在包含引用类型的数据时，会被所有的实例对象所共享，容易造成修改混乱
   - 创建子类型的时候不能向超（父）类型传递参数

```javascript
function Parent () {
  this.isShow = true
  this.info = {
    name: 'dxg',
    age: 18
  }
}

Parent.prototype.getInfo = function () {
  console.log(JSON.stringify(this.info))
  console.log(this.isShow) // true
}

function Child () {}
Child.prototype = new Parent()

let child1 = new Child()
child1.info.gender = '男'
child1.getInfo() // {name: 'dxg', age: 18, gender: '男'}

let child2 = new Child()
// 引用类型的数据会共享
child2.getInfo() // {name: 'dxg', age: 18, gender: '男'}

child2.isShow = false;
console.log(child2.isShow) // false
console.log(child1.isShow) // true  非引用类型不会被共享

```

##### 2. 构造函数
> 实现原理： 在子类构造函数的内部调用父类的构造函数，将子类的执行环境 this 用 call 方法传到父类的构造函数中，使父类中的属性和方法被重写到子类上。

- **缺点**
   - 超（父）类型原型定义的方法，子类型没法访问（即不能访问Parent.prototype上定义的方法），因此，每次创建实例都会初始化，无法实现函数方法的复用
- **优点**
   - 属性和方法不会被子类所共享
   - 可以在子类构造函数向超（父）类型传递参数
- **不传参数**

```javascript
function Parent () {
  this.info = {
    name: 'dxg',
    age: 18
  }
}

function Child() {
  /**
    通过使用call()或apply()方法，Parent构造函数在为Child的实例创建的新对象的上下文执行了，就相当于新的Child实例对象上运行了Parent()函数中的所有初始化代码，结果就是每个实例都有自己的info属性。
  */
  Parent.call(this)
}

let child1 = new Child()
child1.info.gender = '男'
console.log(JSON.stringify(child1.info)) // {"name":"dxg","age":18,"gender":"男"}

let child2 = new Child()
console.log(JSON.stringify(child2.info)) // {"name":"dxg","age":18} 不会共享引用类型的属性

```

- **传递参数**

```javascript
function Parent (name) {
  this.info = {name: name}
}

Parent.prototype.getInfo = function () { console.log('parent info', this.info) }

function Child (name) {
  Parent.call(this, name)
  this.age = 18
}

let child1 = new Child('dxg')
console.log(child1.info.name) // dxg
console.log(child1.age) // 18
child1.getInfo() // child1.getInfo is not a function 无法访问父类原型上的方法

let child2 = new Child('dxg1221')
console.log(child2.info.name) // dxg1221
console.log(child2.age) // 18
```

##### 3. 组合原型链和构造函数
> 实现原理：使用原型链继承原型上的属性和方法，而通过构造函数继承实例属性，这样可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性

- **优点**
   - 解决了不能向超（父）类型传递参数 和 容易造成修改混乱的问题
   - 实现了函数的复用、子类型可以继承父类方法
- **缺点**
   - 由于以父类型的实例来作为子类型的原型，所以调用了两次父类的构造函数，造成了子类型的原型中多了很多不必要的属性

```javascript
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green']
}
Parent.prototype.sayName = function() {
  console.log(this.name)
}

function Child(name, age) {
  // 继承父类属性
  Parent.call(this, name)
  this.age = age
}
// 继承父类方法
Child.prototype = new Parent()
Child.prototype.sayAge = function () {
  console.log(this.age)
}

let child1 = new Child('dxg', 28)
child1.colors.push('pink')
console.log(child1.colors) // ['red', 'blue', 'green', 'pink']
child1.sayAge() // 28
child1.sayName() // dxg


let child2 = new Child('dxg1221', 18)
console.log(child2.colors) // ['red', 'blue', 'green']
child2.sayAge() // 18
child2.sayName() // dxg1221
```

##### 4. 原型式继承
> 实现原理：向函数中传入一个对象，然后返回一个以这个对象为原型的对象。这种继承思路主要不是为了实现创造一种新的类型，只是对某个对象实现一种简单继承。（对参数对象的一种浅复制）

> ES5的Object.create()方法在只有第一个参数时，与这里的objectCopy()方法效果相同

- **缺点**
   - 父类的引用类型会被所有子类共享
   - 子类实例不能向父类传参
- **优点**
   - 父类方法可复用

```javascript
function objectCopy(obj) {
  function Fun() {};
  Fun.prototype = obj;
  return new Fun()
}

let person = {
  name: 'dxg',
  age: 18,
  friends: ['jack', 'tom', 'rose'],
  sayName: function () {
    console.log(this.name)
  }
}

let person1 = objectCopy(person);
person1.name = 'hhh'
person1.friends.push('lily')
person1.sayName() // hhh

let person2 = objectCopy(person)
person2.name = 'yyy'
person2.friends.push('kobi')
person2.sayName()  // yyy

console.log(person.friends) // jack,tom,rose,lily,kobi
```

##### 5. 寄生式继承
> 实现原理：创建一个用于封装继承过程的函数，通过传入一个对象，然后复制一个对象副本，然后对象进行扩展，最后返回这个对象。

- **缺点**
   - 没办法实现函数复用
- **优点**
   - 对一个简单对象实现继承

```javascript
function objectCopy(obj) {
	function Fun() {}
	Fun.prototype = obj
	return new Fun()
}

function createAnother(original) {
	let clone = objectCopy(original)
	clone.getName= function () {
		console.log(this.name)
	}
	return clone;
}

let person = {
	name: 'dxg',
	friends: ['rose', 'tom', 'jack']
}

let person1 = createAnother(person)
person1.friends.push('lily')
console.log(person1.friends) // rose,tom,jack,lily
person1.getName() // dxg

let person2 = createAnother(person)
console.log(person2.friends) // rose,tom,jack,lily
```
##### 6. 寄生式组合继承 （算是引用类型继承 的最佳模式）
> 实现原理：使用超(父)类型的原型的副本来作为子类型的原型，这样避免了创建不必要的属性

- **缺点**
   - 使用超（父）类型的实例作为子类型的原型，导致添加不了必要的原型属性
- **优点**
   - 只调用一次父类构造函数
   - Child可以向Parent传参
   - 父类方法可以复用
   - 父类引用属性不会被共享

```javascript
function objectCopy(obj){
  function Fun() {}
  Fun.prototype = obj
  return new Fun()
}

function inheritPrototype(child, parent) {
  let prototype = objectCopy(parent.prototype) // 创建对象
  prototype.constructor = child // 增强对象
  child.prototype = prototype // 赋值对象
}

function Parent (name) {
  this.name = name;
  this.friends = ['jack', 'lily', 'tom']
}

Parent.prototype.sayName = function () {
  console.log(this.name)
} 

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

inheritPrototype(Child, Parent)
Child.prototype.sayAge = function () {
  console.log(this.age)
}

let child1 = new Child('dxg', 18)
child1.sayName() // dxg
child1.sayAge() // 18
child1.friends.push('jack')
console.log(child1.friends) // jack,lily,tom,jack

let child2 = new Child('dxg1221', 28)
child2.sayName() // dxg1221
child2.sayAge() // 28
console.log(child2.friends) // jack,lily,tom
```
##### 7. ES6 class 继承
> 实现原理：本质上是 `**寄生组合继承**`的语法糖

```javascript
class Person {
  constructor(age) {
    this.age_ = age;
  }
  sayAge () {
    console.log(this.age_)
  }
  // 静态方法,不会被实例继承，但是可以被子类继承
  static create() {
    // 使用随机年龄创建并返回一个Person实例
    return new Person(Math.floor(Math.random() * 100));
  }
}

class Doctor extends Person {}

const doctor = new Doctor(33)
doctor.sayAge() // 33
```

#### ES6 Class 私有方法和静态方法
##### 静态方法 static

   - 不会被实例继承，但是可以被子类继承。通过类来调用

```javascript
class Foo {
  static classMethod () {
    console.log('hello')
  }
}
Foo.classMethod() // hello

let foo = new Foo()
foo.classMethod() // 报错：TypeError: foo.classMethod is not a function

/*
* 代码中，Foo类的classMethod方法前有static关键字，表明该方法是一个静态方法，可以直接在Foo类上调用（Foo.classMethod()），而不是在Foo类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。
*/
```

   - 静态方法包含`this`关键字，这个this指的是类，而不是实例。静态方法可以与非静态方法重名。

```javascript
class Foo {
  static bar() {
    this.baz()
  }
  static baz() {
    console.log('hello')
  }
  baz () {
    console.log('world')
  }
}

Foo.bar() // hello
```

   - 父类方法可以被子类继承
```javascript
class Foo {
  static bar() {
    console.log('hello')
  }
}
class Bar extends Foo {}
Bar.bar() // hello
```

   - 静态方法也是可以从super对象上调用

```javascript
class Foo {
  static bar() {
    return 'hello'
  }
}
class Bar extends Foo {
  static classMethod () {
    console.log(super.bar() + ', too')
  }
}
Bar.classMethod() // hello, too
```
##### 私有方法
> 私有方法和是有属性，是只能在类的内部访问的方法和属性，外部都不能访问

   - 一种做法是在命名上加以区别，但是这种命名不保险

```javascript
class Widget {
  // 公有方法
  foo(baz) {
    this._bar(baz)
  }
  // 私有方法
  _bar(baz) {
    return this.snaf = baz
  }
  
  // ....
}
```

   - 另一种做法是将私有方法移出类，因为类内部的所有方法都是对外可见

```javascript
function bar (baz) {
  return this.snaf = baz;
}
class Widget {
  foo (baz) {
    bar.call(this, baz)
  }
  // ....
}
/*
* 上面代码中，foo是公开方法，内部调用了bar.call(this, baz)。这使得bar()实际上成为了当前类的私有方法。
*/
```

   - 还有一种做法是利用`symbol`值的唯一性，将私有方法的名字命名为一个`symbol`值

```javascript
const bar = Symbol('bar')
const snaf = Symbol('snaf')

export default class myClass {
  // 公有方法
  foo (baz) {
    this[bar](baz)
  }
  // 私有方法
  [bar](baz) {
    return this[snaf] = baz
  }
  
  // ....
}
```

- bar和snaf都是Symbol值，一般情况下无法获取到它们，因此达到了私有方法和私有属性的效果。但是也不是绝对不行，Reflect.ownKeys()依然可以拿到它们。

```javascript
const inst = new Myclass()

Reflect.onwKeys(myClass.prototype) // [ 'constructor', 'foo', Symbol(bar) ]
```

#### 垃圾回收机制
##### 标记清除（mark and sweep）

- 这是js最常见的垃圾回收方式。当变量进入执行环境的时候，比如函数中声明一个变量，垃圾回收器将其标记为‘进入环境’，当变量离开环境的时候（函数执行结束）将其标记为‘离开环境’
- 垃圾回收器会在运行的时候给存储在内存中的所有变量加上标记，然后去掉环境中的变量以及被环境中变量所引用的变量（闭包），在这些完成之后仍存在标记的就是要删除的变量了

##### 引用计数（reference counting）

- 在低版本IE中经常会出现内存泄漏，很多时候是因为其采用引用计数方式进行垃圾回收
- 引用计数的策略是跟踪记录每个值被使用的次数
- 当声明了一个变量并将一个引用类型赋值给该变量的时候这个值的引用次数就加1
- 如果该变量的值变成了另外一个，则这个值的引用次数减1
- 当这个值的引用次数变为0的时候，说明没有变量在使用，这个值没法被访问了，因此可以将其占用的空间回收，这样垃圾回收器会在运行的时候清理掉引用次数为0的值占用的空间

#### 深拷贝与浅拷贝
##### 深拷贝
> 参考链接：[https://juejin.cn/post/6889327058158092302](https://juejin.cn/post/6889327058158092302)

- `JSON.parse(JSON.stringify(obj))`
   - 会忽略undefined
   - 会忽略symbol
   - 不能序列化函数，会忽略函数
   - 不能解决循环引用的对象
- 递归克隆
   - 拷贝简单数据类型
   - 拷贝简单的对象
   - 拷贝复杂对象---数组
   - 拷贝复杂对象---函数
   - 拷贝复杂对象---正则表达式
   - 拷贝复杂对象---日期

```javascript
function deepClone(target) {
  if(target instanceof Object) {
    let dist;
    if(target instanceof Array) {
      // 如果是数组，创建一个[]
      dist = []
    }else if(target instanceof Function) {
      // 拷贝复杂对象---函数
      dist = function () {
        //函数中去执行原来的函数，确保返回的值相同
        return target.call(this, ...arguments)
      }
    } else if(target instanceof RegExp) {
      /*
      * 拷贝复杂对象---正则表达式
      * 一个正则有两部分组成，正则模式（斜杠之间的内容），通过source可以拿到
      * 另一个参数部分，通过flags可以拿到
      */
      dist = new RegExp(target.source, target.flags)
    } else if(target instanceof Date) {
      dist = new Date(target)
    } else {
      //  拷贝简单的对象
      dist = {}
    }
    for(let key in target){
      // 递归调用自己获取到每个值
      dist[key] = deepClone(target[key])
    }
    return dist
  } else {
    // 简单数据类型
    return target
  }
}


```

- 递归克隆的进一步优化
   - 忽略原型上的属性（**优化方法：**利用hasOwnProperty筛选出自身的属性，只遍历自身的属性）
   - 环状对象的爆栈问题 (**优化方法：**利用一个map来缓存（cache）已经拷贝过的target)
   - 共用缓存导致的互相影响问题(**优化方法：**将cache作为参数传入，在调用函数时，每次都创建一个新的map（默认参数），然后如果需要递归，就把这个map往下传**。**)
   - 对象过长导致的爆栈问题（对象a的对象深度有20000个属性。这样的话基本上递归到5000时就出现爆栈了，导致报错。）

```javascript
function deepClone(target, cache = new Map()) {
  if(cache.get(target)) {
      return cache.get(target)
  }
  if(target instanceof Object) {
    let dist;
    if(target instanceof Array) {
        // 如果是数组，创建一个[]
        dist = []
    }else if(target instanceof Function) {
        // 拷贝复杂对象---函数
        dist = function () {
            //函数中去执行原来的函数，确保返回的值相同
            return target.call(this, ...arguments)
        }
    } else if(target instanceof RegExp) {
      /*
      * 拷贝复杂对象---正则表达式
      * 一个正则有两部分组成，正则模式（斜杠之间的内容），通过source可以拿到
      * 另一个参数部分，通过flags可以拿到
      */
       dist = new RegExp(target.source, target.flags)
    } else if(target instanceof Date) {
  		dist = new Date(target)
  	} else {
        //  拷贝简单的对象
        dist = {}
    }
      
    //将属性和拷贝后的值作为一个map
    cache.set(target, dist)
    for(let key in target){
      // 利用hasOwnProperty筛选出自身的属性，只遍历自身的属性
      if(target.hasOwnProperty(key)) {
         dist[key] = deepClone(target[key], cache)
      }
    }
    return dist
  } else {
    // 简单数据类型
     return target
  }
}



```

##### 浅拷贝

- Object.assign
- 展开运算符 `...`


