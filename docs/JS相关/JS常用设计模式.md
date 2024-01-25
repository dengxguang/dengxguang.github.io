### 什么是设计模式
> **设计模式是一套被反复使用、经过分类编目的、代码设计经验的总结。**

> **注意：我们得设计模式，需要记住其思想，并不是记住其结构，结构是不固定的。**

### 设计模式扮演的角色
> 1. 帮助我们组织模块：组织模块的组成结构
> 2. 帮助我们设计沟通：帮助我们设计模块间如何沟通
> 3. 提高代码质量：通过设计模式，让代码更优雅

### 设计原则
#### 1. 开闭原则
`
我们的程序对扩展开发，对修改关闭。我们要提供具体使用的时候的扩展接口，但是在具体使用的时候不能让其修改我们的代码。也就是不用修改源码就能扩展功能。vue、react等都有扩展的接口。
`
#### 2. 单一职责原则
`
我们的模块只做一件事情，模块的职责越单一越好。
`
#### 3. 依赖倒置原则
`
我们的上层模块不要依赖下层模块，应该依赖于抽象。
`
#### 4. 接口隔离原则
`
我们的接口要细化，功能要单一，一个接口不要调用太多方法，使其能力单一。看起来有点像单一原则，两者的区别在于，单一原则主要关注于模块本身，接口隔离关注于接口。
`
#### 5. 迪米特法则
`
两个对象之间产生沟通，最好让着两个对象之间知道的越少越好，没必要两者之间非常了解；我们的中介这模式是一个很好体现迪米特原则的设计模式。中介者模式让两个对象之间没必要直接的沟通，如果直接沟通需要了解两者之间的API和彼此的调用方式，这个时候我们可以采用一个中介者来转达我们的需求，而不用彼此知道。
`
#### 6. 里氏替换原则
`
它主要关注于继承。它的意义是任何使用父类的地方都可以使用子类去替换。直白的说就是我们子类继承父类的时候子类必须完全保证继承父类的属性和方法。这样的话父类使用的地方，子类可以进行替换。
`
### 常用设计模式分类
> 常用的有 创建型、结构型和行为型。

#### 1. 创建型
`这些设计模式可以帮助我们优雅的创建对象`
##### 工厂模式 -- 大量创建对象
```javascript
/**
 * 工厂模式 Factory pattern
 * 【核心思想】：就是你需要什么东西不直接使用new的方法生成实例，然后统一通过工厂进行生产加工再生成实例。
 * 【优势】：那么使用工厂模式的好处也是显而易见的，比如实例的生产比较复杂，或者说生成实例后还需要额外加工，这个时候工厂给了我们一个统一的出入口，也方便了日后对这个实例的修改。比如你要修改工厂产出是一个单例的时候，就不需要在所有的类中修改，而只要在工厂出口修改即可达到目标。
 */

/**举个例子 */
// 1.比如我们现在有很多形状比如圆形，矩形和正方形。这类都是属于形状，那我们是不是可以通过专门生产形状的工厂来生成它们的实例么？
class Circle {
  draw() {
    console.log('I am Circle')
  }
}
class Rectangle {
  draw() {
    console.log('I am Rectangle')
  }
}
class Square {
  draw() {
    console.log('I am Square')
  }
}

// 2. 那么接下来，我们可以建立一个专门生产形状的工厂来生产它们了。
// 即根据字符串来产生对应需要的类。你在这里可以看到类的出口都已经在一个方法中了。
class ShapeFactory {
  getShape(shapeType) {
    switch (shapeType) {
      case 'CIRCLE': return new Circle();
      case 'RECTANGLE': return new Rectangle();
      case 'SQUARE': return new Square();
      default: return null;
    }
  }
}

// 3.那么我们需要使用的时候，就可以直接只需要new出一个工厂，在根据字符串就能拿到对应的需要生产的类了。而不需要分别对类进行new。
const shapeFactory = new ShapeFactory();

// 4. 通过工厂拿各种形状
const shape1 = shapeFactory.getShape('CIRCLE')
shape1.draw() // I am Circle
const shape2 = shapeFactory.getShape('RECTANGLE')
shape2.draw() // I am Rectangle
const shape3 = shapeFactory.getShape('SQUARE')
shape3.draw() // I am Square
```
##### 抽象工厂模式
```javascript
/**
 * 抽象工厂模式 - abstract Factory Pattern
 * 【核心思想】：简单来说工厂的工厂。因为一般的工厂只负责加载一类组件，那么如果有很多小类组件需要生产，那么势必会有很多小类的工厂。那么最终生产一个大类，那就要很多小类的工厂负责生产。那么如何更方便的管理或者说生产这些工厂呢？那就用生产工厂的工厂来生产吧。
 */

/**举个例子 */
// 1.将工厂模式中的形状工厂搬过来
class Circle {
  draw() {
    console.log('I am Circle')
  }
}
class Rectangle {
  draw() {
    console.log('I am Rectangle')
  }
}
class Square {
  draw() {
    console.log('I am Square')
  }
}
class ShapeFactory {
  getShape(shapeType) {
    switch (shapeType) {
      case 'CIRCLE':
        return new Circle();
      case 'RECTANGLE':
        return new Rectangle();
      case 'SQUARE':
        return new Square();
      default:
        return null;
    }
  }
}

// 2. 这时候已经有形状了，但是觉得不够美观，还需要颜色，这个时候又搞了一个颜色工厂，如下：
class Red {
  fill() {
    console.log('fill red')
  }
}
class Blue {
  fill() {
    console.log('fill blue')
  }
}
class Green {
  fill() {
    console.log('fill green')
  }
}

class ColorFactory {
  getColor(color) {
    switch (color) {
      case 'RED': return new Red();
      case 'BLUE': return new Blue();
      case 'GREEN': return new Green();
      default: return null;
    }
  }
}

// 3. 颜色工厂好了，但是担心以后工厂原来越多不好管理，因此通过抽象工厂生产出来，如下：最后添加抽象工厂
class FactoryProducer {
  static getFactory(choice) {
    switch (choice) {
      case 'SHAPE': return new ShapeFactory();
      case 'COLOR': return new ColorFactory();
      default: return null
    }
  }
}

// 4.那么这个时候只需要new出一个抽象工厂，就能把所有需要的东西拿到手了

//通过抽象工厂拿到形状工厂
const shapeFactory = FactoryProducer.getFactory('SHAPE');
// 通过形状工厂拿到工厂
const shape1 = shapeFactory.getShape('CIRCLE')
shape1.draw();
const shape2 = shapeFactory.getShape('RECTANGLE')
shape2.draw();
const shape3 = shapeFactory.getShape('SQUARE')
shape3.draw();

//通过抽象工厂拿到颜色工厂
const colorFactory = FactoryProducer.getFactory('COLOR');

// 通过颜色工厂拿到颜色
const color1 = colorFactory.getColor('RED')
color1.fill()
const color2 = colorFactory.getColor('BLUE')
color2.fill()
const color3 = colorFactory.getColor('GREEN')
color3.fill()

/**
 * output
 * I am Circle
 * I am Rectangle
 * I am Square
 * fill red
 * fill blue
 * fill green
 *
*/
```
##### 单例模式 -- 全局只有我一个实例
```javascript
/**
 * 单例模式 Singleton Pattern
 * 【核心思想】：实例只生产一次。
 * 【优势】：对于频繁使用且可重复使用的对象，可以极大来减少内存消耗和没必要的垃圾回收。
 */

//  这是一种“懒汉式”写法，还有一种叫饿汉式写法，区别是懒汉使用时才初始化，饿汉则先初始化，用的时候直接给。
// 由于js不需要考虑线程安全，所以推荐使用懒汉式写法，饿汉在JS中反而容易产生没必要的垃圾。
class SingleObject {
  instance = null;
  constructor() {
    // 防止调用new初始化
    if (new.target != undefined) {
      const errorMessage = 'This is single object, Can`t use keyword new!';
      const tipMsg = 'You shuld use method getInstance to get instacne.';
      throw new Error(`\n${errorMessage}\n${tipMsg}`);
    }
  }

  static getInstance() {
    // 生产单例
    if(SingleObject.instance) {
      return SingleObject.instance
    }
    SingleObject.instance = {};
    SingleObject.instance.__proto__ = SingleObject.prototype;
    return SingleObject.instance
  }

  showMessage() {
    console.log("this is Singleton Pattern")
  }
}

const instance1 = SingleObject.getInstance()
const instance2 = SingleObject.getInstance()
console.log('instance1 === instance2?', instance1 === instance2)
instance1.showMessage()
instance2.showMessage()

/**
 * output
 * instance1 === instance2? true
 * this is Singleton Pattern
 * this is Singleton Pattern
 */

```
##### 建造者模式 -- 精细化组合对象
```javascript
/**
 * 建造者模式
 * 【核心思想】：让简单的对象通过组合的方式构造成多种复杂对象。
 * 【优势】：这是一种创建复杂对象的最佳实践。尤其是复杂对象多变的情况下，通过基础组件来组合，在基础组件变更时，多种依赖于基础组件的复杂组件也能方便变更，而不需要更改多种不同的复杂组件。
 */

/**举个例子 */

// 1.这里举例西式快餐，里面有非常多的套餐种类，但是各种套餐都是由不同种类的冷饮和汉堡组合而成。同时冷饮需要瓶子装，汉堡需要纸盒包住，那么我们可以先定义冷饮和汉堡类和它们所需要的瓶子和纸盒。

// 纸盒
class Wrapper {
  pack() {
    return 'Wrapper'
  }
}
// 瓶子
class Bottle {
  pack() {
    return 'Bottle'
  }
}
// 汉堡需要纸盒包住
class Burger {
  packing() {
    return new Wrapper()
  }
}
// 冷饮需要瓶子装
class ColdDrink {
  packing() {
    return new Bottle();
  }
}

// 2.那么我们肯定不止一种冷饮和一种汉堡，比如汉堡有蔬菜汉堡和肌肉汉堡，冷饮有可乐和百事。那么我们需要不同的类型和对应的价格。

// 蔬菜汉堡
class VegBurger extends Burger {
  price() {
    return 25.0
  }
  name() {
    return 'Veg Burger'
  }
}
// 肌肉汉堡
class ChickenBurger extends Burger {
  price() {
    return 50
  }
  name() {
    return 'Chicken Burger'
  }
}
// 可乐
class Coke extends ColdDrink {
  price() {
    return 30.0
  }
  name(){
    return 'Coke'
  }
}
// 百事
class Pepsi extends ColdDrink {
  price() {
    return 35.0
  }
  name() {
    return 'Pepsi'
  }
}

// 3.那一个套餐肯定是有多个不同冷饮和汉堡，那么我们需要用一个数组作为储存不同冷饮和汉堡的条目，以下套餐就很容易打造好了。

class Meal {
  constructor() {
    const items = [];
    /**
     * 为什么不使用proxy而是用definePropety
     * 因为proxy虽然实现和definePropety类似的功能
     * 但是在这个场景，语义上是定义属性，而不是需要代理
     */
    Reflect.defineProperty(this, 'items', {
      get(){
        if(this.__proto__ != Meal.prototype) {
          throw new Error('items is private!');
        }
        return items;
      }
    })
  }
  addItem(item) {
    this.items.push(item)
  }

  getCost() {
    let cost = 0;
    for(const item of this.items) {
      cost += item.price()
    }
    return cost;
  }

  showItems() {
    for(const item of this.items) {
      const nameStr = `Item: ${item.name()}`;
      const packStr = `Packing: ${item.packing().pack()}`;
      const priceStr = `Price: ${item.price()}`
      console.log(`${nameStr}，${packStr}，${priceStr}`)
    }
  }
}

// 4. 最后只需要对外提供多个套餐即可。这个叫它套餐建造者

class MealBuilder {
  prepareVegMeal() {
    const meal = new Meal();
    meal.addItem(new VegBurger())
    meal.addItem(new Coke())
    return meal;
  }
  prepareNonVegMeal(){
    const meal = new Meal();
    meal.addItem(new ChickenBurger())
    meal.addItem(new Pepsi())
    return meal;
  }
}

// 5. 最后只要用套餐建造者，给我们做出相应的套餐

const mealBuilder = new MealBuilder();
const vegMeal = mealBuilder.prepareVegMeal()
console.log('Veg meal----->>>>>')
vegMeal.showItems();
console.log(`Total Cost: ${vegMeal.getCost()}`);
console.log('Veg meal----->>>>>')

const nonVegMeal = mealBuilder.prepareNonVegMeal()
console.log('Non Veg meal----->>>>>')
nonVegMeal.showItems();
console.log(`Total Cost: ${nonVegMeal.getCost()}`);
console.log('Non Veg meal----->>>>>')

/**
 * output
 * Veg meal----->>>>>
  Item: Veg Burger，Packing: Wrapper，Price: 25    
  Item: Coke，Packing: Bottle，Price: 30
  Total Cost: 55
  Veg meal----->>>>>
  
  Non Veg meal----->>>>>
  Item: Chicken Burger，Packing: Wrapper，Price: 50
  Item: Pepsi，Packing: Bottle，Price: 35
  Total Cost: 85
  Non Veg meal----->>>>>
 */


```
##### 原型模式 -- js的灵魂
```javascript
/**
 *原型模式（Prototype Pattern）
 *【优势】创建大对象的性能比较高。在其他编程语言中，使用原型模式的优势是使用更小的代价来创建对象。通过原型引用的方式而不是开辟新的空间。但是JS是个例外，直接new就好了，因为js创建对象的方式ius原型引用。
*/

/**举个例子 */
// 1. 首先需要实现一个类，这个类可以通过clone的方法实现原型的创建对象，那么这个clone实际是实现了new的功能，因为JS对象的创建本来就是通过原型的方式实现，而不是完全重新开辟空间。因此原型模式可以直接模拟js类创建的方式即可。

class Shape {
  constructor() {
    this.id = null;
    this.type = null;
  }
  getType() {
    return this.type;
  }
  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }
  clone() {
    /**
      * 如果子类要改成class形式，这个方法要改写成下面形式
      * 因为主要是通过JS原型链帮助理解原型模式，所以子类不使用class形式
      * class和function构造函数的区别是class的构造函数增加了只能作为构造函数使用的校验，比如new
      * return Reflect.construct(
      * this.__proto__.constructor, 
      * [], 
      * this.__proto__.constructor
      * )
    */
    let clone = {}
    // 注意如果此类被继承，this会变成子类的方法
    // 同时这里使用的是原型的指针，所以比直接创建对象性能损耗更低
    clone.__proto__ = this.__proto__;
    this.__proto__.constructor.call(clone);
    return clone;
  }
}

// 2.对于子类，原型链要实现继承是需要通过不断追溯__proto__之上的对象作为继承的类，而prototype实例化之后会赋引用值到__proto__上，所以要实现继承则是绑定prototype.__proto__作为追溯所得的结果之一。
function Rectangle() {
  this.type = "Rectangle";
}
Rectangle.prototype.__proto__ = new Shape();
Rectangle.prototype.draw = function () {
  console.log('I am rectangle')
}

function Circle() {
  this.type = "Circle";
}
Circle.prototype.__proto__ = new Shape();
Circle.prototype.draw = function () {
  console.log('I am Circle')
}

// 3.本例中，通过载入形状的cache方式，在从cache中调用clone方法实现原型创建的例子
class ShapeCache {
  static getShape(shapeId) {
    const cacheShape = ShapeCache.shapeMap.get(shapeId)
    return cacheShape.clone();
  }
  static loadCache() {
    const rectangle = new Rectangle()
    rectangle.setId('3');
    ShapeCache.shapeMap.set(rectangle.getId(), rectangle)

    const circle = new Circle()
    circle.setId('2');
    ShapeCache.shapeMap.set(circle.getId(), circle)
  }
}
ShapeCache.shapeMap = new Map();

ShapeCache.loadCache()
const cloneShape = ShapeCache.getShape('3')
console.log("Shape: " + cloneShape.getType()) // Shape : Rectangle
cloneShape.draw() // I am rectangle

const cloneShape2 = ShapeCache.getShape('2')
console.log("Shape: " + cloneShape2.getType()) // Shape : Circle
cloneShape2.draw() // I am Circle


```
#### 2. 结构型
`帮助我们优雅的设计代码结构`
##### 外观模式 -- 给你的一个套餐
##### 适配器模式 -- 用适配代替更改
##### 装饰者模式 -- 跟优雅地扩展需求
##### 享元模式 -- 共享来减少数量
##### 桥接模式 -- 独立出来，然后再对接过去 
##### 过滤器模式 -- *
##### 组合模式
##### 代理模式
#### 3. 行为型
`模块之间行为的模式总结，帮助我们组织模块行为`
##### 观察者模式 -- 我作为第三方转发
##### 状态模式 -- 用状态代替判断
##### 策略模式 -- 算法工厂
##### 职责链模式 -- 像生产线一样组织模块
##### 命令模式 -- 用命令去解耦
##### 迭代器模式 -- 告别 for 循环
##### 解释器模式
##### 中介者模式
##### 备忘录模式
##### 空对象模式 -- *
##### 模板模式
##### 访问者模式
#### 4. 技巧型
`一些帮助我们优化代码的技巧。`
##### 链模式 -- 链式调用
##### 委托模式 -- 让别人代替你收快递
##### 数据访问模式 -- 一个方便的数据管理器
##### 惰性模式 -- 我要搞机器学习（第一次执行完成后把状态记录下来）
##### 等待者模式 -- 等你们都回来在吃饭


![](https://cdn.nlark.com/yuque/0/2023/jpeg/12794520/1677219999798-109a1a9f-a390-4458-b13e-65eb7563d2d1.jpeg)

参考：<br />[https://senior-frontend.pages.dev/jsadvanced/designpattern.html#_4-1-%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E6%A6%82%E8%AE%BA](https://senior-frontend.pages.dev/jsadvanced/designpattern.html#_4-1-%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E6%A6%82%E8%AE%BA)<br />[https://github.com/zy445566/design-pattern-in-javascript](https://github.com/zy445566/design-pattern-in-javascript)
