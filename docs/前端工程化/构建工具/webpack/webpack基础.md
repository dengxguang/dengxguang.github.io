## module、chunk和bundle

1. **module：**对于一份同逻辑代码，当我们写下一个个文件，不管是ESM还是commonJS或是AMD，他们都是`**module**`**；**
2. **chunk**：我们写的module源文件传到webpack进行打包时，webpack会根据文件引用关系生成chunk文件，webpack会对这个chunk文件进行一些操作；
3. **bundle**：webpack处理好chunk文件后，最后会输出bundle文件，这个bundle文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行。

一般来说，一个chunk对应一个bundle，但是也有例外，比如使用了`MiniCssExtractPlugin`抽离出一个bundle文件。

- 总结

**直接写出来的是**`**module**`**，webpack处理时的是**`**chunk**`**，最后生成浏览器可以直接运行的**`**bundle**`**。**
## webpack构建过程
`

1. 初始化参数：从配置文件和shell语句中读取与合并参数，得出最终的参数。
2. 开始编译：用上一步得到的参数初始化`Compiler`对象，加载所有配置的插件，执行`Compiler`对象的run方法开始执行编译。以下是加载执行插件流程：
- **webpack启动后，在读取配置的过程中会执行 new Myplugin(options)初始化一个**`**MyPlugin**`**实例**
- **在初始化**`**compiler**`**对象后，在调用myPlugin.apply(options)给插件实例传入**`**compiler**`**对象。**
- **插件实例在获取到**`**complier**`**对象后，就会通过complier.plugin(事件名称，回调方法)监听到Webpack广播出来的事件**
- **并且可以通过**`**complier**`**对象去操作 webapck。**
3. 确定入口：根据配置中的`entry`找出所有的入口文件。
4. 编译模块：从入口文件出发，调用所有配置的`loader`对模块进行翻译，再找出该模块依赖的模块，在递归本步骤直到所有入口依赖的文件都经过了本步骤处理。
5. 完成模块编译：经过第4步使用`loader`翻译完所有模块后，得到每个模块被翻译后的最终内容以及他们的依赖关系。
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的`chunk`，再把每个`chunk`转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会。
7. 输出完成：在确定好输出内容后，根据配置确定输出路径和文件名，把文件内容写入到文件系统。
`

## 实现简易版本webpack
[项目代码](https://gitee.com/dengxiangguang/2023_up/tree/master/webpack/simpleWebapck)
#### 项目结构

smipleWebpack<br />├── dist   // 构建产物目录<br />│   ├── index.html<br />│   └── main.js<br />├── package.json<br />├── pnpm-lock.yaml<br />├── src<br />│   ├── index.js  // Compiler 类<br />│   ├── test    //  测试目录<br />│   │   ├── a.js<br />│   │   ├── b.js<br />│   │   └── index.js<br />│   └── utils   // 代码转换方法 Parser 类<br />│       └── parser.js<br />└── webpack.config.js  // 配置文件

#### 1. 定义 Compiler 类
```javascript
class Compiler {
  constructor(options){
    // webpack 配置
    const {entry, output} = options;
    // 入口
    this.entry = entry
    // 出口
    this.output = output
    // 模块
    this.modules = []
  }
  // 构建启动
  run() {}
  // 重写 require 方法， 输出bundle
  generate() {}  
}
```

#### 2. 解析入口文件，获取AST
我们使用`@babel/parser`（这是bable7的工具），来帮助我们分内部的语法，返回AST抽象语法树。

- 定义 Compiler 类的参数
```javascript
const path = require('path')
module.exports = {
	entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js'
  }
}
```

- 定义`parser`用于定义 将文件内容装换成AST、收集所有依赖模块、将 AST 换成 code等方法
```javascript
// Parser 类  
const fs = require('fs')
const parser = require('@babel/parser')
/**关键代码 */
const Parser = {
  /**关键代码 */
  getAst: path => {
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8')
    // 将文件内容转为AST抽象语法树
    return parser.parse(content, {
      sourceType: 'module'
    })
  }
}
```

- Complier 类中引入

```javascript
//Compiler 类 
const optinos = require('./webpack.config')
const { getAst } = require('./utils/parser')
class Compiler {
  constructor(options) {
    const {entry, output} = options
    this.entry = entry // 入口
    this.output = output // 出口
    this.modules = [] // 模块
  }
  // 构建启动
	run() {
    const ast = Parser.getAst(this.entry) /**关键代码 */
  }
}
new Compiler(options).run()
```

#### 3. 找出所有依赖模块
`**Babel**`提供了`@babel/traverse`（遍历）方法维护这AST树的整体状态，我们使用它来帮我们找出依赖模块。

- parser对象中添加收集所有依赖方法`getDependencies`
```javascript
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const Parser = {
  getAst: path => {
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8')
    // 将文件内容转为AST抽象语法树
    return parser.parse(content, {
      sourceType: 'module'
    })
  },
  /**关键代码 */
  getDependencies: (ast, filename) => {
    const dependencies = {}
    // 遍历所有的 import 模块，存入 dependencise
    traverse(ast, {
      // 类型为 ImportDeclaration 的 AST 节点 即为 import 语句
      ImportDeclaration({node}){
        const dirname = path.dirname(filename)
        // 保存依赖路径，之后生成依赖关系图要用到
        const filepath = './' + path.join(dirname, node.source.value)
        dependencies[node.source.value] = filepath
      }
    })
  }
}
```

- Complier 类引入方法`getDependencies`
  
```javascript
const optinos = require('./webpack.config')
const { getAst, getDependencise } = require('./utils/parser')
class Compiler {
  constructor(options) {
    const {entry, output} = options
    this.entry = entry // 入口
    this.output = output // 出口
    this.modules = [] // 模块
  }
  // 构建启动
	run() {
    const ast = getAst(this.entry)
    /*关键代码 */
    const dependencies = getDependencise(ast, this.entry)
  }
  // ...
}
new Compiler(options).run()
```
#### 4. AST 转换成 code
将AST语法树转换为浏览器可执行代码，可以使用`@babel/core`和`@babel/preset-env`。

- Parser 类添加AST 转换为 code 方法：`getCode`
```javascript
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const {transformFromAst} = require('@babel/core')
const Parser = {
  getAst: path => {
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8')
    // 将文件内容转为AST抽象语法树
    return parser.parse(content, {
      sourceType: 'module'
    })
  },
  getDependencies: (ast, filename) => {
    const dependencies = {}
    // 遍历所有的 import 模块，存入 dependencise
    traverse(ast, {
      // 类型为 ImportDeclaration 的 AST 节点 即为 import 语句
      ImportDeclaration({node}){
        const dirname = path.dirname(filename)
        // 保存依赖路径，之后生成依赖关系图要用到
        const filepath = './' + path.join(dirname, node.source.value)
        dependencies[node.source.value] = filepath
      }
    })
  },
  /**关键代码 */
  getCode: ast => {
    // AST 转换为 code
    const {code} = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })
    return code
  }
}
```

- Compiler 类引入`getCode`方法
```javascript
const optinos = require('./webpack.config')
const {getAst, getDependencise, getCode} = require('./utils/parser.js')
class Compiler {
  constructor(options) {
    const {entry, output} = options
    this.entry = entry // 入口
    this.output = output // 出口
    this.modules = [] // 模块
  }
  // 构建启动
	run() {
    const ast = getAst(this.entry)
    const dependencies = getDependencise(ast, this.entry)
    /*关键代码 */
    const code = getCode(ast)
  },
  // 重写 require 方法， 输出 bundle
  genarate() {}
}
new Compiler(options).run()
```

#### 5. 递归解析所有依赖模块，生成依赖关系图

```javascript
const fs = require('fs')
const path = require('path')
const configs = require('../webpack.config')
const { getAst, getDependencise, getCode } = require('./utils/parser')
class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = []
  }
  run() {
    // 1. 解析入口文件
    const info = this.build(this.entry)
    this.modules.push(info)
    /**关键代码 */
    this.modules.forEach(({ dependecies }) => {
      // 判断有依赖对象，递归解析所有依赖项
      if (dependecies) {
        for (const dependency in dependecies) {
          this.modules.push(this.build(dependecies[dependency]))
        }
      }
    })
    /**关键代码 */
    // 生成依赖关系图
    const dependencyGraph = this.modules.reduce((graph, item) => ({
      ...graph,
      [item.filename]: {
        dependecies: item.dependecies,
        code: item.code
      }
    }), {})
  }
  /**关键代码 */
  build(filename) {
    const ast = getAst(filename)
    const dependecies = getDependencise(ast, filename)
    const code = getCode(ast)
    return {
      /**文件路径，可以作为每个模块的唯一标识符 */
      filename,
      /**依赖对象，保存着依赖模块路径 */
      dependecies,
      /**文件内容 */
      code
    }
  }
}
new Compiler(configs).run()
```

#### 6. 重写 require 方法， 输出 bundle

```javascript
const fs = require('fs')
const path = require('path')
const configs = require('../webpack.config')
const { getAst, getDependencise, getCode } = require('./utils/parser')
class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = []
  }
  run() {
    // 1. 解析入口文件
    const info = this.build(this.entry)
    this.modules.push(info)
    this.modules.forEach(({ dependecies }) => {
      // 判断有依赖对象，递归解析所有依赖项
      if (dependecies) {
        for (const dependency in dependecies) {
          this.modules.push(this.build(dependecies[dependency]))
        }
      }
    })
    // 生成依赖关系图
    const dependencyGraph = this.modules.reduce((graph, item) => ({
      ...graph,
      [item.filename]: {
        dependecies: item.dependecies,
        code: item.code
      }
    }), {})
    /**关键代码 */
    this.genarate(dependencyGraph) 
  }
  build(filename) {
    const ast = getAst(filename)
    const dependecies = getDependencise(ast, filename)
    const code = getCode(ast)
    return {
      /**文件路径，可以作为每个模块的唯一标识符 */
      filename,
      /**依赖对象，保存着依赖模块路径 */
      dependecies,
      /**文件内容 */
      code
    }
  }
  /**关键代码 */
  /**重写require函数，输出bundle */
  genarate(code) {
    // 输出文件路径
    const filePath = path.join(this.output.path, this.output.filename)
    console.log('filepath', filePath)
    const bundle = `(function(graph){
      function require(module) {
        function localRequire(relativePath){
          return require(graph[module].dependecies[relativePath])
        }
        var exports = {};
        (function(require, exports, code){
          eval(code)
        })(localRequire, exports, graph[module].code)
        return exports;
      }
      require('${this.entry}')
    })(${JSON.stringify(code)})`
    // 把文件内容写入到文件系统
    const curDir = path.dirname(filePath)
    if (!fs.existsSync(curDir)) {
      fs.mkdirSync(curDir)
    }
    fs.writeFileSync(filePath, bundle, 'utf-8')
  }
}
new Compiler(configs).run()
```

#### 7. 搞懂bundle 实现
以这个代码为例，进行解释
```javascript
(function (graph) {
  function require(module) {
    function localRequire(relativePath) {
      return require(graph[module].dependecies[relativePath])
    }
    var exports = {};
    (function (require, exports, code) {
      eval(code)
    })(localRequire, exports, graph[module].code)
    return exports;
  }
  require('./src/test/index.js')
})({
  "./src/test/index.js": {
    "dependecies": { "a.js": "src\\test\\a.js", "b.js": "src\\test\\b.js" },
    "code": "\"use strict\";\n\nvar _a = require(\"a.js\");\nvar _b = require(\"b.js\");\nconsole.log('a and b ==>', _a.a, _b.b);"
  },
  "src\\test\\a.js": {
    "dependecies": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.a = void 0;\nvar a = 1111;\nexports.a = a;"
  },
  "src\\test\\b.js": {
    "dependecies": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.b = void 0;\nvar b = 2;\nexports.b = b;"
  }
})
```

- step1：从入口文件开始执行
```javascript
// 定义一个立即执行函数,传入生成的依赖关系图
;(function (graph) {
  function require(module) {
  	console.log(module) // ./src/test/index.js
  }
  // 从入口文件开始执行
  require('./src/test/index.js')
})({
  "./src/test/index.js": {
    "dependecies": { "a.js": "src\\test\\a.js", "b.js": "src\\test\\b.js" },
    "code": "\"use strict\";\n\nvar _a = require(\"a.js\");\nvar _b = require(\"b.js\");\nconsole.log('a and b ==>', _a.a, _b.b);"
  },
  "src\\test\\a.js": {
    "dependecies": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.a = void 0;\nvar a = 1111;\nexports.a = a;"
  },
  "src\\test\\b.js": {
    "dependecies": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.b = void 0;\nvar b = 2;\nexports.b = b;"
  }
})
```

- step2：使用 eval 执行代码
```javascript
// 定义一个立即执行函数,传入生成的依赖关系图
;(function (graph) {
  // 重写 require 方法
  function require(moduleId) {
    ;(function (code) {
      console.log(code) 
      eval(code) // Uncaught TypeError: Cannot read property 'code' of undefined
    })(graph[module].code)
  }
  require('./src/test/index.js')
})({
  "./src/test/index.js": {
    "dependecies": { "a.js": "src\\test\\a.js", "b.js": "src\\test\\b.js" },
    "code": "\"use strict\";\n\nvar _a = require(\"a.js\");\nvar _b = require(\"b.js\");\nconsole.log('a and b ==>', _a.a, _b.b);"
  },
  "src\\test\\a.js": {
    "dependecies": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.a = void 0;\nvar a = 1111;\nexports.a = a;"
  },
  "src\\test\\b.js": {
    "dependecies": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.b = void 0;\nvar b = 2;\nexports.b = b;"
  }
})
```

可以看到，执行'./src/test/index.js'文件代码的时候报错了，这是因为index.js里引用了依赖a.js和b.js，而我们没有对依赖进行处理，接下来就对依赖引用进行处理。

- step3：依赖对象寻址映射，获取 exports 对象。
```javascript
// 定义一个立即执行函数，传入生成的依赖关系图
;(function (graph) {
  // 重写 require 函数
  function require(module) {
    // 找到对应 module 的依赖对象，调用 require 函数，eval 执行，拿到 exports 对象
    function localRequire(relativePath) {
      return require(graph[module].dependecies[relativePath])
    }
    // 定义 exports 对象
    var exports = {};
    ;(function (require, exports, code) {
      // commonjs语法使用module.exports暴露实现，我们传入exports对象会捕获依赖对象（a.js/b.js）暴露的（xports.a = void 0;\nvar a = 1111;/exports.b = void 0;\nvar b = 2;）,并写入
      eval(code)
    })(localRequire, exports, graph[module].code)

    // 暴露 exports 对象， 即暴露依赖对象对应的实例
    return exports;
  }
  require('./src/test/index.js')
})({
  "./src/test/index.js": {
    "dependecies": { "a.js": "src\\test\\a.js", "b.js": "src\\test\\b.js" },
    "code": "\"use strict\";\n\nvar _a = require(\"a.js\");\nvar _b = require(\"b.js\");\nconsole.log('a and b ==>', _a.a, _b.b);"
  },
  "src\\test\\a.js": {
    "dependecies": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.a = void 0;\nvar a = 1111;\nexports.a = a;"
  },
  "src\\test\\b.js": {
    "dependecies": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.b = void 0;\nvar b = 2;\nexports.b = b;"
  }
})
```

参考：<br />[webpack打包原理 ? 看完这篇你就懂了 ! - 掘金](https://juejin.cn/post/6844904038543130637#heading-12)
