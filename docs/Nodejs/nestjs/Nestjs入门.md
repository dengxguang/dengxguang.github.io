```javascript
参考链接： 
1. https://mp.weixin.qq.com/s/oprPwqR7Xsg6TmK21CKUuw
2. https://juejin.cn/post/7032079740982788132
```
### nestjs实现接口组成部分

1. **module**
2. **controller**
3. **service**
### 入口文件 main.ts
> 使用`Nestjs`的工厂函数`NestFactory`来创建一个`AppModule`实例，启动了http侦听器，以侦听`main.ts`中所定义的端口

```javascript
import {NestFactory} from '@nestjs/core'
import {AppMoudle} from './app.module'

async fuction bootstrap () {
  const app = await NestFactory.create(AppModule)
  app.listin(3000)
}
bootstrap()
```
### @Module

```javascript
import {Module} from '@nsetjs/common'
import {AppController} form './app.controller'
import {AppService} from './app.service.ts'

@Module({
  imports:[],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
```

> @Module装饰器接受4个属性分别如下：

- providers: `nest.js`注入器实例化的提供者（服务提供者），处理具体业务逻辑，各个模块之间可以共享
- controllers：处理http请求，包括路由控制、向客户端返回响应，将具体业务逻辑委托给providers处理
- imports：导入模块的列表，如果需要使用其他模块的服务，需要通过这里导入
- exports：导出服务的列表，供其他模块导入使用。如果希望当前模块下的服务可以被其他模块共享，需要在这里导出；

### 路由装饰器 --- @Controller 
> **Nest.js**中没有单独配置路由的地方，而是使用装饰器。每个要成为控制器的类，都需要借助`@Controller`装饰器的装饰。**该装饰器传入一个产生，作为访问这个装饰器的主路径**

```javascript
// 主路径为 app
@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  // 可以匹配到 get 请求 /app/
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

- app.controller.ts

```javascript
import {Controller, Get} from '@nestjs/common'
import {AppService} from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService){}
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```
> 代码解读：使用`@Controller`装饰器来定义控制器；`@Get`是请求方法的装饰器，对`getHello`方法进行装饰，表示这个方法会被GET请求调用

- app.service.ts

```javascript
import {Injectable} from '@nestjs/common'

@Injectable()
export class AppService {
  getHello():string {
    return 'i am hello'
  }
}
```
> 代码解读：`@Injectable`修饰后的`AppService`，在`AppModule`中注册之后，在`app.controller.ts`中使用，我们就不需要使用 `new AppService()`去实例化，直接引入过来就可以用

### HTTP方法处理装饰器
> @Get、@Post、@Put等众多用于http方法处理装饰器，经过他们装饰的方法，可以对相应的http请求进行相应。**同时他们可以接受一个字符串或者一个字符串数组作为参数，这里的字符串可以是固定的路径，也可以是通配符。**

```javascript
// 主路径为 app
@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  //1. 固定路径， 可以匹配到 get请求 /app/list
  @Get("list")
  getHello(): string{...}
  
  //可以匹配到 post请求 /app/list
  @Post("list")
  getHello(): string{...}
  
  //2. 通配符路径（?+*三种通配符）， 可以匹配到 get请求 /app/user_xxx
  @Get("user_*")
  getHello(): string{...}
  
  //3. 带参数路径， 可以匹配到 put请求 /app/list/xxx
  @Put("list/:id")
  update(): string{...}
  
  
}
```
### 全局路由前缀
> 除了装饰器可以设置路由外，还可以设置全局路由前缀，比如给所有路由都加上`/app`前缀。此时需要修改`main.js`

```javascript
async function bootstrap () {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 设置全局路由前缀
  await app.listen(9080);
}
bootstrap()
```
### nest-cli 提供创建快捷命令
> 语法：nest g [文件类型] [文件名] [文件目录]

> 注意创建顺序：先创建`Module`，再创建`Controller`和`Service`，这样创建出来的文件在`Module`中自动注册。反之，后创建`Module`,`Controller`和`Service`会被注册到外层`app.module.ts`

- 创建模块 -- nest g mo dogs
   - 执行命令后，可以发现同时在根模块`app.module.ts`中引入了`DogsModule`，也在@`@Module`装饰器中引入了`DogsModule`

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DogsModule } from './dogs/dogs.module'; // 关键代码

@Module({
  imports: [DogsModule], // 关键代码
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- 创建控制器 -- nest g co dogs
   - 执行命令后，文件`dogs.module.ts`中自动引入`DogsController`,并在@`@Module`中注入

```javascript
import { Module } from '@nestjs/common';
import { DogsController } from './dogs.controller'; // 关键代码
import { DogsService } from './dogs.service';

@Module({
  controllers: [DogsController], // 关键代码
  providers: [DogsService]
})
export class DogsModule {}

```

- 创建服务类 -- nest g service dogs
   - 执行命令后，文件`dogs.module.ts`中自动引入`DogsService`,并在@@Module中注入


```javascript
import { Module } from '@nestjs/common';
import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service'; // 关键代码

@Module({
  controllers: [DogsController], 
  providers: [DogsService] // 关键代码
})
export class DogsModule {}
```

### 连接mysql
#### 安装mysql
> 常用数据库可视化工具：SQLyog 、Navicat for MySql 等等

#### TypeORM 简介 （需要深入看一下官网文档）

- 什么是ORM
> ORM技术**（Object-Relational Mapping）**把关系数据库的结构映射到对象上。常用的有`Sequelize`、`typeORM`、`Prisma`等。这样我们读写的都是js对象。

- 例如利用ORM技术插入一条数据

`await connection.getRepository(Dogs).save({name: 'black', age: 3})`
#### 使用typeORM连接数据库

- 安装依赖包

`npm install @nestjs/typeorm typeorm mysql2 -S`<br />**前置条件**

1. 安装好mysql
2. 启动mysql  --- `net start mysql`
3. 创建好对应的数据库等等

**官网提供了两种连接数据库的方法**<br />**方法1：**

- 1. 首先在项目根目录下创建两个文件.env和.env.prod，分别存的是开发环境和线上环境不同的环境变量：

```javascript
//数据库地址
DB_HOST = localhost
// 数据库端口
DB_PORT =  3306
// 数据库登录名
DB_USER = root
// 数据库登录密码
DB_PASSWD = 123456
// 数据库名字
DB_DATABASE = blog
```
> `.env.pro`中的是上线要用的数据库信息，为了安全性考虑，建议这个文件添加到`.gitignore`中

- 2. 接着在根目录下创建`config`目录（与src同级），然后创建一个`env.ts`用于根据不同环境读取相应的配置文件

```javascript
import * as fs from 'fs';
import * as path from 'path';
const isProd = process.env.NODE_ENV === 'production'

function parseEnv() {
  const localEnv = path.resolve('.env')
  const prodEnv = path.resolve('.env.prod')
  
  if(!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('缺少环境配置文件')
  }
  
  const filePath = isProd && fs.existsSync(prodEnv) ? prodEnv : localEnv;
  return {path: filePath}
}

export default parseEnv();
```

- 3. 然后在`app.module.ts`中链接数据库

**使用环境变量，推荐使用官方提供的**`**@nestjs/config**`**,开箱即用**
> `@nestjs/config`依赖`dotenv`，可以通过`key=value`形式配置环境变量，项目默认加载根目录下的`.env`文件，我们只需在`app.module.ts`中引入`ConfigModule`，使用`ConfigModule.forRoot()`方法即可，然后`ConfigService`读取相关的配置变量

```javascript
import {Module} from '@/nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigService, ConfigModule} from '@/nestjs/config'
import envConfig from '../config/env'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        type: 'mysql', // 数据库类型
        entities: [], // 数据库实体
        host: configService.get('DB_HOST', 'localhost'), // 主机
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', '123456'), // 密码
        database: configService.get('DB_DATABASE', 'blog'), // 数据库名
        timezone: '+08:00' , // 服务器上配置的时区  
        synchronize: true, // 根据实体自动创建数据库表，生产环境建议关闭
      }
    }),
    ...
  ],
  ...
})
export class AppModule {}
```

**方法2：**

1.  在根目录下创建一个`ormconfig.json`
```javascript
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "123456",
  "database": "blog",
  "synchronize": true,
  "entities": ["dist/**/*.entity{.ts,.js}"]
}
```

1. 然后在`app.module.ts`中不带任何选项的调用`forRoot()`，这样就可以了

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

1. 然后 `npm run start:dev`启动项目，数据库连接成功

### CRUD

1. 接下来就进行数据操作，`typeOrm`是通过实体映射到数据库表，所以先建立一个文章实体`PostEntit`，在`posts`目录下创建`posts.entity.ts`

**前置条件：创建好posts的module、controller、service**
```javascript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主键，值自动生成

  @Column({ length: 50 })
  title: string;

  @Column({ length: 20 })
  author: string;

  @Column('text')
  content: string;

  @Column({ default: '' })
  thumb_url: string;

  @Column('tinyint')
  type: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}

```

2. 在`posts.service.ts`文件中实行URUD操作的业务逻辑，（简单表操作）

```javascript
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';

export interface PostsRo {
  list: PostsEntity[];
  count: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  // 创建文章
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    return await this.postsRepository.save(post);
  }

  // 获取文章列表
  async findAll(query): Promise<PostsRo> {
    const qb = await getRepository(PostsEntity).createQueryBuilder('post');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  // 获取指定文章
  async findById(id): Promise<PostsEntity> {
    return await this.postsRepository.findOne(id);
  }

  // 更新文章
  async updateById(id, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  // 刪除文章
  async remove(id) {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.postsRepository.remove(existPost);
  }
}
```

1. 在`posts.module.ts`中将`PostsEntiry`导入

```javascript
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

1. 采用REST风格实现接口，在`posts.controller.ts`中设置路由

```javascript
import { PostsService, PostsRo } from './posts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 创建文章
   * @param post
   */
  @Post()
  async create(@Body() post) {
    return await this.postsService.create(post);
  }

  /**
   * 获取所有文章
   */
  @Get()
  async findAll(@Query() query): Promise<PostsRo> {
    return await this.postsService.findAll(query);
  }

  /**
   * 获取指定文章
   * @param id
   */
  @Get(':id')
  async findById(@Param('id') id) {
    return await this.postsService.findById(id);
  }

  /**
   * 更新文章
   * @param id
   * @param post
   */
  @Put(':id')
  async update(@Param('id') id, @Body() post) {
    return await this.postsService.updateById(id, post);
  }

  /**
   * 删除
   * @param id
   */
  @Delete('id')
  async remove(@Param('id') id) {
    return await this.postsService.remove(id);
  }
}

```
### 操作数据库的坑
### 注册（对用户密码进行加密储存）
> 在注册功能中，当用户是通过用户名和密码进行注册，密码我们不能直接用明文在数据库中，所以需要使用`bcryptjs`实现加密，然后在存入数据库


主要步骤如下：

1. 在用户实体中使用`bcryptjs`和`@BeforeInsert()`在插入数据库之前对密码进行加密处理。

2. 加密后，可以发现密码也被返回了，提高了风险性。有两种处理方式：一种是从数据层面，从数据库就不返回password字段，另一种方式是返回数据给用户时处理数据，不反回给前端。具体操作如下：

2.1. `TypeORM`提供列属性select，**进行查询是是默认隐藏此列。但是只能用于查询时。**比如save方法返回的数据依然会包含password。<br />2.2. 使用`class-transformer`提供的`Exclude`来序列化，对返回的数据实现过滤掉password 的效果。
> 参考：[https://blog.csdn.net/xgangzai/article/details/121882097](https://blog.csdn.net/xgangzai/article/details/121882097)


### 登录/扫码登录+token验证
### 统一返回数据格式


