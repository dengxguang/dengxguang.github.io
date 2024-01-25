### 一. nodejs 特性
- 单线程
- 非阻塞I/O
- 事件驱动
### 二. 适合开发的业务  

- 适合用来开发的应用程序（善于I/O，不善于计算）
> 当应用程序需要处理大量并发I/O，而在客户端发出响应之前，应用程序内部并不需要非常复杂的处理时候，Node.js非常适合。Nodejs也非常适合于 `web socket`配合，开发长连接的实时交互应用程序。比如：
> 1. 用户表单收集
> 2. 考试系统
> 3. 聊天室
> 4. 图文直播
> 5. 提供json的API

### 三. Node.js中的三类模块
> Node.js中的模块遵循`commonJS`模块规范，`CommonJS`规定了模块的特性和各模块间如何相互依赖。
> - 每个模块内部`module`变量代表当前模块
> - `module`变量是一个对象，它的`exports`属性（即`module.exports`）是对外的接口
> - 加载某个模块，其实就是加载模块的`module.exports`属性，`require`方法用于加载模块

#### 内置核心模块
##### fs 模块
> 用于处理文件的模块

1. 读取文件：`fs.readFile(path[,optionis], callback)`
> 参数1：必选参数，字符串，表示文件的路径<br />参数2：可选参数，表示什么编码格式来去读文件<br />参数3：必选参数，文件读取完成后，通过回调函数拿到读取的结果

```javascript
const fs = require('fs')
```

2. 写入文件：`fs.writeFile(path, data[,options], callback)`
> 参数1：必选参数，需要指定一个文件路径的字符串，表示文件的存放路径<br />参数2：必选参数，表示要写入的内容<br />参数3：可选参数，表示已什么格式写入文件内容，默认值是utf8<br />参数4：必选参数，文件写入完成后的回调函数

##### path模块
> 用于处理文件和目录的路径的实用工具，使用前需先引入模块

###### path.resolve
> 用于链接路径，但却和path.join()方法却很多不同，而且path.resolve()方法本身就自带一个to的绝对路径参数，也会自动转换分隔符，在某些场景用起来也方便很多；

- 当"path"路径为空时，得到结果是当前文件所在的绝对路径，类似 __dirname ；
```javascript
console.log(__dirname)                // E:\other\2023_up\Nodejs
console.log(path.resolve())           // E:\other\2023_up\Nodejs
console.log(path.resolve(__dirname))  // E:\other\2023_up\Nodejs
console.log(path.resolve(''))         // E:\other\2023_up\Nodejs
```

- 以`./`开头或者没有字符时，得到的结果是加不加 ./ 都不影响路径的拼接；
```javascript
console.log(path.resolve(''))                  // E:\other\2023_up\Nodejs
console.log(path.resolve('./a'))               // E:\other\2023_up\Nodejs\a
console.log(path.resolve('a'))                 // E:\other\2023_up\Nodejs\a
console.log(path.resolve('./a', 'b', 'c'))     // E:\other\2023_up\Nodejs\a\b\c
console.log(path.resolve('a', 'b', 'c'))       // E:\other\2023_up\Nodejs\a\b\c
```

- 以 `/` 开头，path.resolve()的特点之一就是碰到`"/"`斜杆则会直接跳转到E盘的根路径**(在哪个盘运行就是哪个盘)**，这里跟在终端输出`cd /`是一样的原理，也会跳转到E盘的根路径；
```javascript
console.log(path.resolve(''))                  // E:\other\2023_up\Nodejs
console.log(path.resolve('/a'))                // E:\a
console.log(path.resolve('/a', 'b', 'c'))      // E:\a\b\c
console.log(path.resolve('a', '/b', 'c'))      // E:\b\c
console.log(path.resolve('a', 'b', '/c'))      // E:\c
```

- 以`../`开头，也就是上一层的意思，path.resolve()会把上一级路径给覆盖掉；
```javascript
console.log(path.resolve(''))                  // E:\other\2023_up\Nodejs
console.log(path.resolve('../'))               // E:\other\2023_up
console.log(path.resolve('../a'))              // E:\other\2023_up\a
console.log(path.resolve('../a', 'b'))         // E:\other\2023_up\a\b
console.log(path.resolve('a', '../b'))         // E:\other\2023_up\b
console.log(path.resolve('c', 'b', '../a'))    // E:\other\2023_up\c\a
console.log(path.resolve('../c', 'b', 'a'))    // E:\other\2023_up\c\b\a
```

- path.resolve()搭配__dername变量，__dirname变量需放在第一个，否则会覆盖在它之前的'path'路径，包括斜杠' / '，还有个要注意的点，__dirname之后也不能出现' / '，不然也覆盖之前的路径；
```javascript
console.log(path.resolve(''))                     // E:\other\2023_up\Nodejs
console.log(path.resolve(__dirname, 'a'))         // E:\other\2023_up\Nodejs\a
console.log(path.resolve('a', 'b', __dirname))    // E:\other\2023_up\Nodejs
console.log(path.resolve(__dirname, './a', 'b'))  // E:\other\2023_up\Nodejs\a\b
console.log(path.resolve(__dirname, '/a', 'b'))   // E:\a\b
console.log(path.resolve(__dirname, '../a', 'b')) // E:\other\2023_up\a\b
console.log(path.resolve(__dirname, 'a', '../b')) // E:\other\2023_up\Nodejs\b
console.log(path.resolve('a', '/b', __dirname))   // E:\other\2023_up\Nodejs
```

###### path.join
> 用于链接路径，并且会自动转换当前系统路径的分隔符"/"或"\"；

- 当"path"路径为无或空时，得到的结果是" . ",只有传入__dirname的时候，才能得到绝对路径
```javascript
console.log(path.join(''))                          // .
console.log(path.join('.'))                         // .
console.log(path.join(__dirname))                   // E:\other\2023_up\Nodejs
```

- 以 ./ 开头或者 / 和没有字符，得到的结果是加不加都不影响路径的拼接
```javascript
console.log(path.join())                    // .
console.log(path.join('a'))                 // a
console.log(path.join('./a'))               // a
console.log(path.join('/a'))                // \a
console.log(path.join('a', 'b'))            // a\b
console.log(path.join('a', './b'))          // a\b
console.log(path.join('./a', 'b', 'c'))     // a\b\c
console.log(path.join('./a', 'b', './c'))   // a\b\c
console.log(path.join('/a', 'b', '/c'))     // \a\b\c
```

- 以`../`开头的字符，此时你会发现join()不仅是单纯的去拼接路径，而且也是从右到左去拼接的，../之后还有"path"路径的话，也是会被覆盖掉；
```javascript
console.log(path.join())                    // .
console.log(path.join('../'))               // ..\
console.log(path.join('../a'))              // ..\a
console.log(path.join('../a', 'b'))         // ..\a\b
console.log(path.join('a', '../b'))         // b
console.log(path.join('c', 'b', '../a'))    // c\a
console.log(path.join('../c', 'b', 'a'))    // ..\c\b\a
```

- path.join()搭配__dername变量，为什么一定要把它放在第一位？因为`join`会不管对错，直接把你写入的路径都拼接到一块
```javascript
console.log(path.join(__dirname, 'a'))      // E:\other\2023_up\Nodejs\a
console.log(path.join('a', __dirname))      // a\E:\other\2023_up\Nodejs
```

- 总结

1. 在path.join()方法中，'/' 与 './' 一般情况下可以不用（特殊情况的拼接除外哈）；
2. 在path.join()方法中，最好与__dirname变量搭配使用；
3. path.join()方法也是从右到左依次被解析排列组成路径的；


###### path.join 与 path.resolve 的区别

1. path.resolve()自带to参数，也就是当前输出文件的路径，而path.join()没有；
2. path.resolve()遇到 ' / ' 则会跳转到根目录(E:\),而path.join()则没效果；
3. path.resove()搭配__dirname变量使用时，就算__dirname在最右边，resolve()会把左边的"path"路径给覆盖掉，形成正确的路径，而path.join()正常拼接，无论对错；


###### __dirname
> Node.js的一个全局变量，获得当前文件所在目录的完整目录名，搭配path一起使用；


##### http模块
> - req：访问客户端相关的数据和属性
> - res：访问服务端相关的数据和属性

- 解决乱码：

`res.setHeader('content-type', 'text/html'; charset='utf-8')`

#### 自定义模块
#### 第三方模块
### 四. Node.js中的模块作用域

- `module`对象：向外共享模块作用域中的成员，存储了当前模块的相关信息，如`exports`默认为`{}`
- 共享成员注意点：导入的结果永远以`module.exports`指向的对象为准
- 默认情况下`exports`和`module.exports`指向同一个对象，最终结果还是以`module.exports`指向的对象为准
- **注意：为了防止混乱，建议不要在同一个模块中同事使用**`**exports**`**和**`**module.exports**`

```javascript
// 例1
exports.userName = 'zz';
module.exports = {gender: 'man', age: 18}
// result:  {gender: 'man', age: 18}

// 例2
module.exports.userName = 'zz';
exports = {gender: 'man', age: 18}
// result:  {userName: 'zz'}

// 例3
exports.userName = 'zz';
module.exports.gender = 'man';
// result:  {userName: 'zz', 'gender': man}

// 例4
exports= {
  userName: 'zz',
  gender: 'man',
}
module.exports = exports
module.exports.age = 18
// result: {userName: 'zz', gender: 'man', age: 18}
```

### 五. npm与包

1. 包：指的是第三方模块，是基于内置模块封装的，提供了更高级的、更方便的API，极大提高了开发效率，包和内置模块的关系类型`jquery`和浏览器内置API的关系
2. 包的语义化版本规范
> 包的版本号是以‘点分十进制’形式进行定义的，总共3位数，例如：1.23.4，其中第一位数字代表大版本，第二位数字代表功能版本，第三位数字代表bug修复版本，只要前面的版本号增长，后面的版本号归零。

3. 包的分类

![](https://cdn.nlark.com/yuque/0/2022/jpeg/12794520/1667724067371-1bbc4298-5f6e-4192-983a-bea10e7e3569.jpeg)

4. 规范的包结构 
> - 包必须以单独的目录而存在
> - 包的顶级目录下必须包含`name`、`version`、`main`三个属性，分别代表包的名字，版本号、包的入口

5. 开发自己的包
> - 现在包目录，例如：tools
> - 在根目录下新建`package.json（包管理配置文件）`、`index.js（入口文件`、`README.md（包的说明文件）`
> - 初始化package.json，name、version、main、description、keyword、license（开源许可协议）

6. 模块加载机制
> - 多次加载，只加载一次，其余从缓存中加载
> - `require`方法不写后缀时，会按照以下顺序匹配：文件名精准匹配 -> js -> json -> node -> 加载失败
> - `require`方法加载目录顺序：先在当前目录下的package.json文件中的main字段指向的文件 -> index.js -> 加载失败

