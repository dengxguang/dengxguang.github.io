# 脚手架/CLI 工具原理与开发时间
## 【初中级】面试官：了解过脚手架/命令行工具开发吗，简单说说开发要点

### 实现场景
- vue create
- vue page

### 总结一下你们工作流和自动化实际落地的东西
- 规范化：ESlint、styleLint、commintLint、规范库，然后通过自动化执行命令来处理这个事情
- 自动化：CI/CD、构建、打包、测试（单元测试：unit test，端对端测试：e2e）
- 重复工作、能够自动化执行的一些工作

### 设计命令
- 规范化     xxx lint
- CI/CD      xxx ci
- 构建       xxx dev   -> vite dev
- 打包       xxx build -> vite build
- 测试       xxx test/xxx e2e(技术栈：cypress、playwright)
- 初始化     xxx init
- 创建页面   xxx page
- 创建组件   xxx component

### 技术选型
- 整个命令的处理 **commander**
- 人机交互 **prompts**
- 控制台高亮 chalk(旧) **picocolors**
- 内容格式化 **table**
- 模板处理：**handlebars**

### verdaccio 搭建 npm 私服


## 【中高级】面试官：说说你们团队的团队基建，开发脚手架的目的与方案

### 定义

团队基建（team infrastructure）KPI产物，最终目的：
- 对于团队
  - 提效
  - 确保代码质量
  - 促进协作
- 对于个人
  - 个人影响力
  - 技术提升
无代码、低代码项目

### 如何设计

实操，从0到1去做一个命令行工具（CLI: command line tool）。

#### monorepo 工程化设计
使用 pnpm workspace
  - 初始化
    1. 创建目录 test-cli、test-cli/cli
    2. 运行命令`npm init -y`初始化
    3. 创建文件`pnpm-workspace.yaml`，进行定义，内容如下：
    ```yaml
      packages:
        - "packages/*"
        - "examples/*"
    ```
    4. 进入 test-cli/cli 目录运行命令`npm init -y`进行初始化
  - 细节
  1. 修改package.json 文件,修改name,添加index.js文件，添加type和bin配置。
  ```json
    {
    "name": "@test/cli",
    // ...
    "main": "index.js",
    "type": "module", // 告诉node这个文件是模块，可以通过import导入
    "bin": { // 挂载命令，告诉操作系统，在命令行输入 test-cli（名字可以随便写，但是要和package.json的bin的key一致） 就能执行这个文件
      "test-cli": "./index.js"
    },
    //...
    "license": "MIT"
  }
  ```

#### 脚手架基础开发与命令行原生解析
  - process.argv

  ```json
    console.log(process.argv.slice(2))
  ```

#### commander 参数解析实践
```js
//使用commander库处理命令行参数与输入
import { program } from 'commander';
import fs from 'fs';
let packageJson = null;

try {
  const json = fs.readFileSync('../../package.json');
  packageJson = JSON.parse(json)
} catch(error) {
  console.error('Error reading package.json:', error)
  process.exit(1)
}

// 定义命令行工具
program
  .name('tesc-cli')
  .description('测试脚手架')
  .version(packageJson.version)

program.parse();
```

```bash
# 命令
PS F:\2022\2023_up\Nodejs\test-cli\packages\cli> node .\index.js -h

# 执行结果：
Usage: tesc-cli [options]

测试脚手架

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

#### test-cli 初始化命令开发
```js
// 定义初始化（init）命令 
program
  .command('init')
  .arguments('<name>', '项目名称')
  .description('初始化项目')
  .action((name) => {
    console.log('sucess init', name)
  })
```
- 运行
```bash
# 命令
PS F:\2022\2023_up\Nodejs\test-cli\packages\cli> node .\index.js init hhhaha
# 结果：
sucess init hhhaha
```

#### 脚手架工程化结构优化思路与命令逻辑抽离

