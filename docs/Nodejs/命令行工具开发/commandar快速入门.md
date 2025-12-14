> commander.js 提供了完整的CLI开发解决方案，从简单的参数解析到复杂的企业级命令行应用都能轻松胜任。掌握这些基础和高级特性，你就能构建出专业、易用的命令行工具。


#### 1. 安装和基础设置

##### 安装 commander.js
```bash
  npm install commander

  #或者全局安装用于开发CLI工具
  npm install -g commander
```

**`最简单的例子`**
```js
  // cli.js
  const { program } = require('commander');

  program
    .name('my-cli')
    .description('我的第一个CLI工具')
    .version('1.0.0');

  program.parse();
```

**`运行效果`**
```bash
  node cli.js --version  # 输出: 1.0.0
  node cli.js --help     # 显示帮助信息
```

#### 2. 核心概念

##### 2.1 选项 (Options)

- **定义**: 以 - 或 -- 开头的可选参数
- **特点**: 可选的、命名的、有明确语义的配置参数
- **位置**: 可以出现在命令行的任何位置

**`示例`**
```js
  const { program } = require('commander');

  program
    .option('-d, --debug', '启用调试模式')
    .option('-s, --small', '小包装尺寸')
    .option('-f, --flavour <type>', '选择口味')
    .option('-p, --pizza-type <type>', '披萨类型', 'margherita')  // 默认值
    .option('-c, --cheese [type]', '添加指定奶酪类型', 'blue')     // 可选参数
    .option('-C, --no-cheese', '不添加奶酪');                    // 布尔取反

  program.parse();

  const options = program.opts();
  console.log('选项:', options);

  // 使用示例:
  // node cli.js -d -s -f chocolate -p hawaiian -c gouda
  // 输出: { debug: true, small: true, flavour: 'chocolate', pizzaType: 'hawaiian', cheese: 'gouda' }
```

##### 2.2 参数 (Arguments)

- **定义**: 按位置传递的必需或可选参数
- **特点**: 位置相关的、通常是命令的主要操作对象
- **位置**: 严格按顺序出现

**`示例`**
```js
  program
    .argument('<username>', '用户名')
    .argument('[password]', '密码', 'default_password')  // 可选参数带默认值
    .action((username, password) => {
      console.log('用户名:', username);
      console.log('密码:', password);
    });

  // 使用: node cli.js john secret123
  // 输出: 用户名: john
  // 密码: secret123
```

##### 2.3 变长参数

```js
  program
    .argument('<dirs...>')  // 接受多个参数
    .action((dirs) => {
      console.log('目录列表:', dirs);
    });

  // 使用: node cli.js dir1 dir2 dir3
  // 输出: ['dir1', 'dir2', 'dir3']
```

#### 3. 实际应用示例

##### 3.1 文件处理工具

```js
  const { program } = require('commander');
  const fs = require('fs');
  const path = require('path');

  program
    .name('file-tool')
    .description('文件处理工具')
    .version('1.0.0');

  // 复制文件命令
  program
    .command('copy <source> <dest>')
    .description('复制文件')
    .option('-f, --force', '强制覆盖')
    .action(async (source, dest, options) => {
      try {
        // 检查源文件是否存在
        if (!fs.existsSync(source)) {
          console.error(`错误: 源文件 ${source} 不存在`);
          process.exit(1);
        }

        // 检查目标文件是否存在
        if (fs.existsSync(dest) && !options.force) {
          console.error(`错误: 目标文件 ${dest} 已存在，使用 -f 强制覆盖`);
          process.exit(1);
        }

        // 复制文件
        fs.copyFileSync(source, dest);
        console.log(`✓ 文件复制成功: ${source} → ${dest}`);
      } catch (error) {
        console.error(`复制失败: ${error.message}`);
        process.exit(1);
      }
    });

  // 列出文件命令
  program
    .command('list [dir]')
    .alias('ls')
    .description('列出目录内容')
    .option('-a, --all', '显示隐藏文件')
    .option('-l, --long', '详细信息')
    .action((dir = '.', options) => {
      try {
        const files = fs.readdirSync(dir);

        let filteredFiles = files;
        if (!options.all) {
          filteredFiles = files.filter(file => !file.startsWith('.'));
        }

        if (options.long) {
          console.log('文件详细信息:');
          filteredFiles.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            const type = stats.isDirectory() ? 'DIR' : 'FILE';
            const size = stats.isDirectory() ? '-' : stats.size;
            console.log(`${type.padEnd(5)} ${size.toString().padStart(8)} ${file}`);
          });
        } else {
          console.log('文件列表:');
          filteredFiles.forEach(file => console.log(`  ${file}`));
        }
      } catch (error) {
        console.error(`列出文件失败: ${error.message}`);
      }
    });

  // 删除文件命令
  program
    .command('delete <files...>')
    .alias('rm')
    .description('删除文件')
    .option('-r, --recursive', '递归删除目录')
    .option('-f, --force', '强制删除')
    .action((files, options) => {
      files.forEach(file => {
        try {
          if (!fs.existsSync(file)) {
            if (!options.force) {
              console.error(`警告: 文件 ${file} 不存在`);
            }
            return;
          }

          const stats = fs.statSync(file);
          if (stats.isDirectory()) {
            if (options.recursive) {
              fs.rmSync(file, { recursive: true, force: options.force });
              console.log(`✓ 目录删除成功: ${file}`);
            } else {
              console.error(`错误: ${file} 是目录，使用 -r 递归删除`);
            }
          } else {
            fs.unlinkSync(file);
            console.log(`✓ 文件删除成功: ${file}`);
          }
        } catch (error) {
          console.error(`删除 ${file} 失败: ${error.message}`);
        }
      });
    });

  program.parse();
```

##### 3.2 项目管理工具

```js
  const { program } = require('commander');
  const fs = require('fs').promises;
  const path = require('path');
  const { exec } = require('child_process');
  const { promisify } = require('util');

  const execAsync = promisify(exec);

  program
    .name('project-manager')
    .description('项目管理工具')
    .version('2.0.0');

  // 初始化项目
  program
    .command('init [name]')
    .description('初始化新项目')
    .option('-t, --template <template>', '项目模板', 'basic')
    .option('--typescript', '使用 TypeScript')
    .option('--git', '初始化 Git 仓库', true)
    .option('--install', '自动安装依赖', true)
    .action(async (projectName, options) => {
      const name = projectName || 'my-project';

      console.log(`🚀 创建项目: ${name}`);
      console.log(`📋 模板: ${options.template}`);

      try {
        await createProject(name, options);
        console.log(`✅ 项目 ${name} 创建成功！`);

        if (options.install) {
          console.log('📦 安装依赖...');
          await execAsync('npm install', { cwd: name });
          console.log('✅ 依赖安装完成！');
        }

        console.log(`\n下一步:\n  cd ${name}\n  npm start`);
      } catch (error) {
        console.error(`❌ 创建失败: ${error.message}`);
        process.exit(1);
      }
    });

  // 构建项目
  program
    .command('build')
    .description('构建项目')
    .option('-m, --mode <mode>', '构建模式', 'production')
    .option('-w, --watch', '监听模式')
    .option('-a, --analyze', '分析包大小')
    .option('--clean', '构建前清理', true)
    .action(async (options) => {
      console.log(`🔨 开始构建 (${options.mode} 模式)`);

      try {
        if (options.clean) {
          console.log('🧹 清理构建目录...');
          await fs.rmdir('dist', { recursive: true }).catch(() => {});
        }

        const buildCmd = options.watch ? 'npm run build:watch' : 'npm run build';
        console.log(`📦 执行构建命令: ${buildCmd}`);

        const { stdout, stderr } = await execAsync(buildCmd);
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);

        if (options.analyze) {
          console.log('📊 分析包大小...');
          await analyzeBundle();
        }

        console.log('✅ 构建完成！');
      } catch (error) {
        console.error(`❌ 构建失败: ${error.message}`);
        process.exit(1);
      }
    });

  // 运行开发服务器
  program
    .command('serve')
    .alias('dev')
    .description('启动开发服务器')
    .option('-p, --port <port>', '端口号', '3000')
    .option('-h, --host <host>', '主机地址', 'localhost')
    .option('-o, --open', '自动打开浏览器')
    .option('--https', '使用 HTTPS')
    .action(async (options) => {
      console.log(`🚀 启动开发服务器...`);
      console.log(`📍 地址: ${options.https ? 'https' : 'http'}://${options.host}:${options.port}`);

      try {
        let cmd = `npm run dev -- --port ${options.port} --host ${options.host}`;

        if (options.https) {
          cmd += ' --https';
        }

        if (options.open) {
          cmd += ' --open';
        }

        // 启动开发服务器
        const child = exec(cmd);

        child.stdout.on('data', (data) => {
          console.log(data.toString());
        });

        child.stderr.on('data', (data) => {
          console.error(data.toString());
        });

        // 处理退出信号
        process.on('SIGINT', () => {
          console.log('\n👋 停止开发服务器...');
          child.kill('SIGINT');
          process.exit(0);
        });

      } catch (error) {
        console.error(`❌ 启动失败: ${error.message}`);
        process.exit(1);
      }
    });

  // 测试命令
  program
    .command('test [files...]')
    .description('运行测试')
    .option('-w, --watch', '监听模式')
    .option('-c, --coverage', '生成覆盖率报告')
    .option('-u, --update-snapshots', '更新快照')
    .option('--ci', 'CI 模式')
    .action(async (files, options) => {
      console.log('🧪 运行测试...');

      try {
        let testCmd = 'npm test';

        if (files.length > 0) {
          testCmd += ` -- ${files.join(' ')}`;
        }

        if (options.watch && !options.ci) {
          testCmd += ' --watch';
        }

        if (options.coverage) {
          testCmd += ' --coverage';
        }

        if (options.updateSnapshots) {
          testCmd += ' --updateSnapshot';
        }

        const { stdout, stderr } = await execAsync(testCmd);

        if (stdout) console.log(stdout);
        if (stderr && !stderr.includes('PASS')) console.error(stderr);

        console.log('✅ 测试完成！');
      } catch (error) {
        console.error(`❌ 测试失败: ${error.message}`);
        process.exit(1);
      }
    });

  // 辅助函数
  async function createProject(name, options) {
    // 创建项目目录
    await fs.mkdir(name, { recursive: true });

    // 创建基础文件结构
    const dirs = ['src', 'public', 'tests'];
    for (const dir of dirs) {
      await fs.mkdir(path.join(name, dir), { recursive: true });
    }

    // 生成 package.json
    const packageJson = {
      name,
      version: '1.0.0',
      description: '',
      main: options.typescript ? 'src/index.ts' : 'src/index.js',
      scripts: {
        start: options.typescript ? 'ts-node src/index.ts' : 'node src/index.js',
        build: 'webpack --mode production',
        dev: 'webpack serve --mode development',
        test: 'jest'
      },
      dependencies: {},
      devDependencies: {
        webpack: '^5.0.0',
        'webpack-cli': '^4.0.0',
        'webpack-dev-server': '^4.0.0'
      }
    };

    if (options.typescript) {
      packageJson.devDependencies.typescript = '^4.0.0';
      packageJson.devDependencies['ts-node'] = '^10.0.0';
      packageJson.devDependencies['@types/node'] = '^18.0.0';
    }

    await fs.writeFile(
      path.join(name, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // 创建入口文件
    const ext = options.typescript ? '.ts' : '.js';
    const indexContent = options.typescript
      ? `console.log('Hello TypeScript!');`
      : `console.log('Hello World!');`;

    await fs.writeFile(path.join(name, 'src', `index${ext}`), indexContent);

    // 初始化 Git
    if (options.git) {
      await execAsync('git init', { cwd: name });

      const gitignore = `
  node_modules/
  dist/
  .env
  *.log
  .DS_Store
      `.trim();

      await fs.writeFile(path.join(name, '.gitignore'), gitignore);
    }
  }

  async function analyzeBundle() {
    try {
      const stats = await fs.readdir('dist');
      let totalSize = 0;

      console.log('\n📦 包大小分析:');
      for (const file of stats) {
        const filePath = path.join('dist', file);
        const stat = await fs.stat(filePath);
        const sizeKB = (stat.size / 1024).toFixed(2);
        console.log(`  ${file}: ${sizeKB} KB`);
        totalSize += stat.size;
      }

      console.log(`\n📊 总大小: ${(totalSize / 1024).toFixed(2)} KB`);
    } catch (error) {
      console.warn('⚠️  分析失败:', error.message);
    }
  }

  program.parse();
```

#### 4. 高级特性

##### 4.1 自定义帮助信息
```js
  const { program } = require('commander');

  program
    .configureHelp({
      sortSubcommands: true,
      subcommandTerm: (cmd) => cmd.name() + ' ' + cmd.usage(),
    })
    .addHelpText('before', `
  🚀 我的超级CLI工具
  ====================
    `)
    .addHelpText('after', `
  示例:
    $ mycli create myapp --template react
    $ mycli build --production
    $ mycli serve --port 8080

  更多信息: https://xxxx.com/my/cli-tool
    `);

```
##### 4.2 参数验证和转换
```js
  program
    .command('server')
    .option('-p, --port <number>', '端口号', (value) => {
      const port = parseInt(value, 10);
      if (isNaN(port) || port < 1 || port > 65535) {
        throw new commander.InvalidArgumentError('端口号必须在 1-65535 之间');
      }
      return port;
    })
    .option('-t, --timeout <seconds>', '超时时间', (value) => {
      const timeout = parseFloat(value);
      if (isNaN(timeout) || timeout < 0) {
        throw new commander.InvalidArgumentError('超时时间必须是正数');
      }
      return timeout * 1000; // 转换为毫秒
    })
    .action((options) => {
      console.log('启动服务器，端口:', options.port);
      console.log('超时设置:', options.timeout, 'ms');
    });
```
##### 4.3 环境变量集成
```js
  program
    .option('-d, --database <url>', '数据库URL', process.env.DATABASE_URL)
    .option('--api-key <key>', 'API密钥', process.env.API_KEY)
    .option('--debug', '调试模式', process.env.NODE_ENV === 'development');
```
##### 4.4 配置文件支持
```js
  const fs = require('fs');
  const path = require('path');

  function loadConfig() {
    const configPaths = [
      '.mycli.json',
      path.join(process.env.HOME, '.mycli.json'),
      '/etc/mycli.json'
    ];

    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        try {
          return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (error) {
          console.warn(`警告: 配置文件 ${configPath} 格式错误`);
        }
      }
    }

    return {};
  }

  const config = loadConfig();

  program
    .option('-p, --port <port>', '端口号', config.port || '3000')
    .option('--host <host>', '主机地址', config.host || 'localhost');
```

##### 4.5 交互式命令
```js
  // 需要安装: npm install inquirer
  const inquirer = require('inquirer');

  program
    .command('setup')
    .description('交互式设置')
    .option('--non-interactive', '非交互模式')
    .action(async (options) => {
      if (options.nonInteractive) {
        // 使用默认配置
        await setupWithDefaults();
      } else {
        // 交互式设置
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: '项目名称:',
            default: 'my-project',
            validate: (input) => {
              if (/^[a-zA-Z0-9-_]+$/.test(input)) {
                return true;
              }
              return '项目名称只能包含字母、数字、连字符和下划线';
            }
          },
          {
            type: 'list',
            name: 'template',
            message: '选择模板:',
            choices: [
              { name: 'React', value: 'react' },
              { name: 'Vue', value: 'vue' },
              { name: 'Angular', value: 'angular' },
              { name: '基础模板', value: 'basic' }
            ]
          },
          {
            type: 'confirm',
            name: 'typescript',
            message: '使用 TypeScript?',
            default: true
          },
          {
            type: 'checkbox',
            name: 'features',
            message: '选择功能:',
            choices: [
              { name: 'ESLint', value: 'eslint' },
              { name: 'Prettier', value: 'prettier' },
              { name: 'Jest 测试', value: 'jest' },
              { name: 'Git Hooks', value: 'husky' }
            ]
          }
        ]);

        await setupProject(answers);
      }
    });
```

##### 4.6 错误处理和退出码
```js
  const { program } = require('commander');

  // 全局错误处理
  program.exitOverride((err) => {
    if (err.code === 'commander.help') {
      process.exit(0);
    } else if (err.code === 'commander.version') {
      process.exit(0);
    } else if (err.code === 'commander.unknownCommand') {
      console.error('❌ 未知命令:', err.message);
      process.exit(1);
    } else if (err.code === 'commander.invalidArgument') {
      console.error('❌ 无效参数:', err.message);
      process.exit(1);
    }

    console.error('❌ 程序错误:', err.message);
    process.exit(1);
  });

  // 命令级错误处理
  program
    .command('risky-operation')
    .action(async () => {
      try {
        await performRiskyOperation();
        console.log('✅ 操作成功完成');
      } catch (error) {
        console.error('❌ 操作失败:', error.message);

        // 根据错误类型设置不同的退出码
        if (error.code === 'ENOENT') {
          process.exit(2); // 文件不存在
        } else if (error.code === 'EACCES') {
          process.exit(3); // 权限不足
        } else {
          process.exit(1); // 通用错误
        }
      }
    });
```

##### 4.7 进度显示
```js
  // 需要安装: npm install cli-progress colors
  const cliProgress = require('cli-progress');
  const colors = require('colors');

  program
    .command('download <url>')
    .option('-o, --output <file>', '输出文件名')
    .action(async (url, options) => {
      const progressBar = new cliProgress.SingleBar({
        format: '下载进度 |' + colors.cyan('{bar}') + '| {percentage}% | {value}/{total} KB | ETA: {eta}s',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
      });

      try {
        console.log(`开始下载: ${url}`);

        // 模拟下载过程
        const totalSize = 1000; // KB
        progressBar.start(totalSize, 0);

        for (let i = 0; i <= totalSize; i += 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          progressBar.update(i);
        }

        progressBar.stop();
        console.log('✅ 下载完成!');

      } catch (error) {
        progressBar.stop();
        console.error('❌ 下载失败:', error.message);
        process.exit(1);
      }
    });
```

#### 5. 最佳实践

##### 5.1 项目结构

```md
  my-cli/
  ├── bin/
  │   └── cli.js          # 主入口文件
  ├── src/
  │   ├── commands/       # 命令目录
  │   │   ├── create.js
  │   │   ├── build.js
  │   │   └── serve.js
  │   ├── utils/          # 工具函数
  │   │   ├── config.js
  │   │   ├── logger.js
  │   │   └── helpers.js
  │   └── index.js        # 程序入口
  ├── package.json
  └── README.md
```

##### 5.2 package.json 配置
```json
  {
    "name": "my-awesome-cli",
    "version": "1.0.0",
    "description": "My awesome CLI tool",
    "bin": {
      "mycli": "./bin/cli.js"
    },
    "files": [
      "bin/",
      "src/",
      "README.md"
    ],
    "engines": {
      "node": ">=14.0.0"
    },
    "dependencies": {
      "commander": "^9.0.0"
    },
    "devDependencies": {
      "jest": "^28.0.0"
    }
  }
```
##### 5.3 命令分离
```js
  // src/commands/create.js
  const { Command } = require('commander');

  const createCommand = new Command('create')
    .description('创建新项目')
    .argument('<name>', '项目名称')
    .option('-t, --template <template>', '模板类型', 'basic')
    .action(async (name, options) => {
      // 创建逻辑
    });

  module.exports = createCommand;

  // src/index.js
  const { program } = require('commander');
  const createCommand = require('./commands/create');
  const buildCommand = require('./commands/build');

  program
    .name('mycli')
    .version('1.0.0')
    .addCommand(createCommand)
    .addCommand(buildCommand);

  module.exports = program;
```
##### 5.4 测试
```js
  // tests/commands.test.js
  const { program } = require('../src');

  describe('CLI Commands', () => {
    test('should show version', async () => {
      const output = await runCommand(['--version']);
      expect(output).toMatch(/1\.0\.0/);
    });

    test('should create project', async () => {
      const output = await runCommand(['create', 'test-project']);
      expect(output).toContain('项目创建成功');
    });
  });

  async function runCommand(args) {
    // 模拟命令执行
    return new Promise((resolve) => {
      const originalLog = console.log;
      let output = '';

      console.log = (msg) => {
        output += msg + '\n';
      };

      program.parse(['node', 'cli.js', ...args]);

      console.log = originalLog;
      resolve(output);
    });
  }
```

### commandar VS arg