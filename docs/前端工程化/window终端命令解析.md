### 前言
前端工程离不开 `npm`、`yarn`或者`pnpm`等包管理工具。通过这些包管理工具我们可以对项目进行依赖安装和维护，同事还可以通过 `package.json` 文件中的 `script` 设置进行串联各个工程化不同阶段需要运行的命令。<br />`.npmrc`文件，是npm的配置文件，主要是供npm、yarn和pnpm这些包管理工具进行配置使用。
### 终端命令的执行流程

1. 命令解析器

通过命令操控计算机在DOS、Linux系统中最常用的方式。命令操作的核心便是命令解析器（如Linux中的Shell）。命令解析器实现接收命令字符串，解析命令并执行相应操作。

- 本质： 对用户输入的命令进行解析，调用对应的执行程序。
- 常见的命令解析器：
> 1. shell：Unix操作系统下的命令解析器
> 2. bash：Linux操作系统下的命令解析器
> 3. cmd：windows 命令解析器
> 4. PowerShell：一种跨平台的任务自动化和配置管理框架，由命令行管理程序和脚本语言组成。（win10默认提供）


2. 命令执行流程

输入命令后，系统执行流程如下：
> 1. **判断命令路径**
> - 先判断该命令是否包含了路径，如果命令已经存在路径，则会直接读取该路径下的命令文件并执行。这就是通过命令路径执行命令。
> 2. **判断是内部命令还是外部命令**
> - 当用户在终端输入字符后，命令解析器就需要判断该字符是系统内部命令还是系统外部命令。所谓内部命令就是该命令常驻内存，直接执行即可（例如：cd、ls），外部命令就是指命令的代码在磁盘中，在执行时需要先把磁盘中的命令代码读入内存才能执行。
> 3. **在 PATH 变量中查找命令**
> - 如果用户输入的命令不是内部命令，又没包含命令路径的话，那么就需要去系统环境变量 PATH 中配置的目录中进行查找。我们平时很多软件需要配置PATH环境变量的原因也在于此。
> 4. **其他**： 报错，输入的不是命令。

### Node 安装及执行

- 通常，我们去Node官网下载集成版的安装包（.msi文件），安装之后，它就会自动给系统的环境变量 PATH 配置一个 `node.exe`文件所在的目录路径，也就是安装路径。这样我们输入`node -v`命令，就会进行上述的命令执行步骤，最终在环境变量 PATH 配置的目录中找到 `node.exe` 执行命令，然后进行相关程序的执行。
- 此外，我们也可以手动下载单独版本，然后手动设置`node.exe`文件所在的目录路径到系统的PATH环境变量上。

基于上述原理我们可以下载不同版本的Node文件，然后需要用到不同版本的Node时，就手动设置不同版本的`node.exe`文件所在的目录路径到系统的PATH环境变量上。从而达到手动切换node版本的目的。例如 Node版本管理工具 nvm 切换不同版本Node的原理也是如此。
### npm run 发生了什么

- 背景
1. 安装npm命令
- 默认安装Node时候会默认安装了npm命令，在`node.exe`文件所在目录下会有`npm`、`npm.cmd`两个文件，这两个就是npm的命令执行文件。
- 同时我们也可以手动下载不同版本的npm，然后把npm命令文件所在的目录设置到系统的PATH环境变量上，这样在命令终端输入 npm 时，就可以通过系统的PATH环境变量上配置的目录路径找到对应的npm命令文件了。然后系统就会把npm命令文件中的内容读取到内存中，就可以执行了。

2. 全局命令与局部命令

以 typescript 为例

- 全局安装
`
npm install typescript -g
`
执行以上命令之后，会在系统的环境变量PATH中设置node命令所在的目录上写入命令文件`tsc`、`tsc.cmd`、`tsc.ps1`，所以我们获得一个全局命令`tsc`，我们就可以在终端输入 `tsc`开头的命令。输入`tsc -v`命令之后，命令解析器就可以通过系统环境变量PATH中设置目录路径找到对应的tsc命令。

- 局部安装
`
npm install typescript -D
`

执行局部安装命令，会在当前目录`./node_modules/.bin`文件目录下写入tsc命令文件`tsc`、`tsc.cmd`、`tsc.ps1`，这时候不能直接通过终端执行`tsc`命令，因为此时tsc命令文件所在目录并没有在系统变量PATH中。但是我们可以使用以下方式执行：
`
./node_modules/.bin/tsc -v
`

- npx 

npx可以直接运行 `node_modules/.bin`文件下的命令。也可以自动检查命令是否在`node_modules/.bin`目录中后者是否在系统环境变量PATH配置的目录路径中。npx另一个更实用的特点是，它在执行相关模块命令时会先进行依赖安装，但是会在安装成功并执行完相关命令代码后删除此依赖，从而避免了全局安装带来的问题。

3. npm scripts 的本质

我们知道可以在`package.json`文件的`scripts`选项中进行自定义脚本，然后通过npm run xxx来执行。原理就是`npm run`会创建一个shell脚本，package.json文件的自定义脚本内容会在这个新创建的shell脚本中运行。因此上述局部安装typescript的命令还可以通过 package.json 文件的 scripts 选项自定义脚本内容方式进行执行。package.json 代码设置如下：
```json
"scripts": {
  "tsctest": "tsc -v"
}
```
执行`npm run tsctest`即可。此外package.json文件的scripts选项也可以允许全局命令。

- 小结
> 1. 全局安装的工具，可以直接直接在命令终端中运行，但是在项目中安装的，就需要通过package.json文件的scripts选项配置脚本来执行命令
> 2. 通过上述的介绍可以知道`npm run` 发生了什么。首先是` npm scripts`本质是一个`shell`脚本，原理就是执行`npm run`的时候回自动创建一个`Shell`，在这个`Shell`里面执行指定的命令，同时会把当前目录下的`node_modules/.bin` 目录路径添加到环境变量PATH中，这样Shell脚本的命令解析器就可以查找到目录中的`node_modules/.bin`目录中的命令了，执行结束后，再将PATH变量恢复原样。然后在通过执行对应的应用程序，然后输出结果。重点：**Shell在寻找命令的时候是按照环境变量PATH中配置的目录去查找，如果找到了就执行对应的命令，若找不到就会报错。**
> 3. 只要是Shell脚本可以运行的命令，都可以作为npm scripts脚本。因此不一定是Node脚本，任何可执行文件都可以写在里面。比如如果系统安装了 `ffmpeg`，也可以将 `ffmpeg`脚本作为npm scripts。npm脚本的退出码也遵守Shell脚本规则。如果退出码不是 0 ，npm就认为这个脚本执行失败。

### Node Cli 命令运行原理

1. 创建 Node Cli 命令
- 首先创建一个目录：npm-link-test，然后在根目录下进行node项目初始化，即运行此命令：`npm init -y`
- 然后新建目录`bin`，在`bin`目录下新建一个index.js文件，这个文件是作为一个shell文件进行执行的，需要在文件开头加一行`#!/usr/bin/env node`。这段代码的意思是指定脚本解析器类型，本来shell环境只能执行B-shell文件，如果执行js文件，则需要指定解析器为node。
- 配置package.json文件：这个配置的意思是：这个指令名称是`npm-link-test`，运行之后执行的是`./bin/index.js`这个文件的代码。
```json
{
  "bin": {
    "npm-link-test": "./bin/index.js" 
  }
}
```

- 测试验证：因为我们只是为了理解Node Cli命令的原理，我们只需要在终端输入`npm-link-test`命令能运行起来即可。所以我们在`./bin/index.js`文件中加一行体现命令行运行成功的代码：
```javascript
#!/usr/bin/env node
console.log("这是测试命令")
```
所以只需要在终端根目录输入`npm link`后再输入`npm-link-test`然后打印出“这是测试命令”即可。

2. 利用npm link 进行本地调试
- 全局安装调试（在cli项目根目录下执行 npm link 命令）
> - 开发了一个库包或者一个Node Cli 工具，是不适合发布到线上进行调试的，所以我们可以利用`npm link`命令进行全局虚拟安装，即可高效的进行本地调试。
> - 执行命令后就会在环境变量PATH设置Node命令安装的目录下创建npm-link-test、npm-link-test.cmd、npm-link-test.ps1这三个文件，这样我们就可以正常执行命令了。
> - 执行 `npm link` 命令相当于执行了全局安装，他会把项目安装到全局的`node_modules`目录文件下。
> - 调试结束后，执行`npm unlink`命令取消安装关联。

- 局部安装调试
> - 在其他的非cli项目根目录执行`npm link npm-link-test`命令即可局部安装，但这种方式可能会报错，我们可以通过`npx link D:\2022\npm-link-test`方式安装。安装成功之后，在项目的`node_modules`目录中安装了相关命令文件：npm-link-test，npm-link-test.cmd，npm-link-test.ps1。
> - 这时候删除掉全局安装的命令文件，再在命令终端运行`npm-link-test`发现会报错，原因是局部安装的命令无法同命令终端执行，需要通过package.json文件中的scripts选项进行自定义脚本进行局部安装的执行命令：

```javascript
"scripts": {
  "test": "npm-link-test"
}
```
这个时候执行命令`npm run test`即可打印“这是测命令”
### npm install 发生了什么

- `npm install`命令是用来安装项目依赖。执行之后，当前如果定义了`preinstall`钩子此时会被执行。之后获取npm配置，即`.npmrc`文件。**优先级**：项目级的`.npmrc文件` > 用户级 `.npmrc文件` > 全局的`.npmrc文件` > npm内置的`.npmrc文件`
- 然后检查项目根目录下有没有`package-lock.json`文件，如果有，则检查`package-lock.json`文件和`package.json`文件中声明的版本是否一致。
- 一致，直接使用`package-lock.json`文件中的信息，从缓存或者网络中加载依赖
- 不一致，则根据npm版本进行处理
> - **npm v5.0x：根据**`**package-lock.json**`**下载。**
> - **npm v5.1.0-v5.4.2：当package.json声明的依赖版本规范有符合的更新版本是，忽略package-lock.json，按照package.json安装，并更新package-lock.json**
> - **npm v5.4.2 以上：当package.json声明的依赖版本规范与package-lock.json安装版本兼容是，则根据package-lock.json安装；如果不兼容，则按照package.json安装，并更新package-lock.json。**

- 如果没有package-lock.json文件，则根据package.json文件递归构建依赖树，然后构建好的依赖树下载完整的依赖资源，在下载是会检查是否有相关缓存。有缓存，则将缓存的内容解压到node_modules目录中；没有缓存，则先从网络下载包资源，检查包的完整性，并将其添加到缓存，同时解压到node_modules目录中。最后胜出package-lock.json文件。
- 如果项目定义了postinstall钩子，此时会被执行以下流程：

构建依赖树时，首先将项目根目录下的`package.json`文件中的`depedencies`和`devDepedencies`选项的依赖按照首字母（@排最前）进行排序，排序好后，npm会开启多进程从每个首层依赖模块向下递归获取子依赖。这样便获得一棵完整的依赖树，其中可能包含大量重复依赖。在**npm3**以前会严格按照依赖树的结构进行安装，因此会造成依赖冗余。从**npm3以后**开始默认加了一个`dedupe`的过程，它会遍历所有依赖，将每个依赖安装在根目录的node_modules目录中，当发现有重复依赖时，则将其丢弃，不重复则在新模块的node_modules目录下放置该依赖。这就是所谓的**依赖扁平化结构处理。**<br />再次执行`npm install`时，会根据package-lock.json中的integrity、version、name信息生成一个唯一的key，再根据这个key就可以找到对应的缓存包了，再把对应的缓存安装到node_modules下即可，这样省去了网络下载资源的开销。

关于依赖我们需要特别了解一下package.json中dependencies和devDependencies选项：<br />**dependencies**表示项目依赖，这些依赖都会成为线上生产环境中的代码组成部分。例如在项目中安装Element-plus组件时，组件库中的dependencies选项中的依赖就同时被下载。<br />**devDependencies**选项的依赖则不会被下载。因为devDependencies选项依赖一般只在开发环境中被使用到。但如果我们从github上克隆Element-plus组件库源码项目下来，进入项目执行`npm install`时，则dependencies和devDependencies选项都会被下载，因为此时是在开发Element-plus组件库阶段

这里还需要说明一点的就是，并不是dependencies选项中的依赖才会被一起打包，而devDependencies选项中的依赖就一定不会被打包。事实上，dependencies和devDependencies选项中的依赖是否被打包，只取决于项目中是否引入了依赖。dependencies和devDependencies选项在业务中更多起到的是规范作用。
### peerDependencies 依赖类型声明

- 前言

`peerDependencies`表示同版本依赖，简单来说就是安装了`组件A`最好也安装`组件A对应的依赖`。例如 Element Plus 组件库，它需要宿主环境提供指定的Vue版本来搭配使用，所以Element plus组件库项目需要在package.json文件中配置`"peerDependencies": {"vue": "^3.2.0"}`，因此element plus 必须运行在Vue3的环境下。

- 依赖版本号的前缀代表的意思
> 1. `**~**`**波浪号，匹配最新补丁版本号，即版本号的第三个数字，例如**`**~5.0.0**`**就会匹配**`**5.0.x**`**版本，将在**`**5.1.0**`**停止**
> 2. `**^**`**插入符号，匹配次要的版本号，即版本号的的第二个数字，例如**`**^5.0.0**`**就会匹配任何**`**5.x.x**`**，将在**`**6.0.0**`**停止**
> 3. `**>、<、>=、<=**`**比较运算符，匹配的就是这个区间的版本，例如**`**>2.0.0 <=2.1.4**`**，就会匹配这个区间的版本号。**

- 不使用peerDependencies

当不使用peerDependencies时，如果宿主环境所依赖的版本和组件依赖的版本不一致，会分别在宿主的node_modules和组件的node_modules目录下安装对应版本的依赖包，会造成重复安装依赖的情况。

- npm V5、V6、V7及pnpm下使用peerDependencies

事实上像element-plus这类ui组件库或者像webpack/vite/babel/eslint等的插件，它们都有一个共同点，就是不能单独运行且毫无意义，它们必须运行在各自的本体环境下，比如Element-Plus就必须运行在Vue3的环境下。它无须对本体依赖进行声明，而且应该直接使用宿主项目中的本体依赖。这时候我们就可以使用peerDependencies选项对本体依赖进行声明了。<br />**npm v5-npm v6：**

- **无冲突：**当宿主环境中没有子依赖peerDependencies中声明的依赖时，也会把安装peerDependencies的声明将相关依赖安装到宿主项目的根目录`node_modules`中；
- **有冲突：**如果宿主环境依赖和`peerDependencies`的声明**依赖发生冲突**会有版本不兼容的警告，但仍会安装依赖，官方资料是npm4-6的版本的处理情况都一样。

**npm7：**

- **无冲突：**正常安装，并且把peerDependencies中的相关依赖安装到根目录的node_modules下。
- **有冲突：**有冲突的情况下，无法自动解决依赖的冲突，会报错并且阻止安装。错误建议我们使用 --force或者 --legacy-peer-deps命令进行重新安装。即便可以安装成功，也不一定代表项目能正常运行。

`--force 或 -f`: 强制安装<br />`--legacy-peer-deps`: 安装上忽略所有对等依赖（peerDependencies），以npm v4~v6的方式安装。<br />**pnpm：**

- **无冲突：**可以正常安装，但是会报`peerDependencies`中声明的依赖缺失，不会自动安装缺失的依赖。
- 有冲突：以宿主环境中的依赖为准。不会主动安装`peerDependencies`中的依赖，如果要自动安装`peerDependencies`中的依赖，需要在`.npmrc`文件中进行配置：`auto-install-peer=true`

`**auto-install-peer**`

- 默认值： false；类型：boolean；当值为true时，将自动安装任何缺少的非可选同级依赖。

`**strict-peer-dependencies**`

- 默认值：false（was true from v7.0.0 until v7.13.5）；类型： boolean; 如果启用了此选项，那么在依赖树中存在缺少或无效的peer依赖时，命令将执行失败。
- 设置为false，缺少peer依赖或者peer依赖冲突也不再报错，只是报了一个警告，跟npm 4~6的安装方式一样。
### 幽灵依赖

- **由来：**没有被定义在项目中的package.json文件中的包，也被导入使用了，如果引用的那个主包不再使用了，项目中还引用着它包中的依赖，就会出错。
- **pnpm 的解决方法：**package.json中显式声明的依赖会平铺在`node_modules`根目录下，而依赖中的依赖则防止node_modules根目录下的`.pnpm`目录总的`node_modules`目录下。

