### 可以做什么
> - web网站服务器：专门对外提供网页资源的服务器。
> - API接口服务器：专门对外提供API接口服务

### 托管静态资源
> 注意：访问路径不出现对外提供的目录名

`app.use(express.static())`
### 路由

- 创建路由模块的步骤
> - 创建路由模块对应的`js/ts`文件
> - 调用`express.Router()`方法创建`route`对象，
> - 向路由对象上挂载对应的路由
> - 使用`module.exports`向外共享路有对象
> - 使用`app.use()`方法注册路由模块

### 在项目中操作mysql数据库的步骤
> **使用mysql模块来连接数据库和执行sql语句**

- 步骤
1. 安装第三方模块`mysql`
2. 导入模块，连接数据库
3. 通过`mysql`模块执行`sql`语句
4. 代码演示

```javascript
// 1. 导入 mysql 模块
const msyql = require('mysql');
// 2. 建立与 Mysql 数据库 的连接
const db = msyql.createPool({
    host: '127.0.0.1', // 数据库IP地址
    user: 'root', // 数据库登录账号
    password: '123456', // 数据库登录密码
    database: 'my_db_01' // 指定操作那个数据库
})

// 3. 测试 mySQL 模块能否正常工作
db.query('SELECT 1', (err, results) => {
    if(err) return console.log(err.message);

    // 只要能打印出 [ RowDataPacket {'1': 1}]的结果，就证明数据库连接正常
    console.log(results)
})

module.exports = db
```

- mysql
1. sql语言大小写不敏感
2. 常用sql语句语法

```sql
-- select
select * from table;

-- insert
insert into table_name (name, id) values('123', '1221')

-- update
update 表名称 set 列名称=新值 where 列名称=值

-- delete
delete from 表名称 where 列名称=值

-- count 关键字： 返回结果集的总数
-- as : 为列设置别名
select count(*) as total from table1

```

1. where 中的 `order by` 语句
> - 用于排序，默认是升序，可用关键字`DESC`进行降序排序

### 项目中使用jwt认证步骤

1. 下载相关依赖库，`jsonwebtoken`、`express-jwt`,其中`jsonwebtoken`用于生产token字符串，`express-jwt`用于将字符串解析还原成json对象。
2. 导入jwt 相关模块，定义secret秘钥，建议使用secretKey
3. 登录成功后，通过jwt.sign()方法生成token字符串，并且返回
4. 在需要jwt鉴权的接口，使用`express-jwt`中间件，解析还原token字符串为json对象
5. 使用了`express-jwt`中间件后，如果解析成功后，会在`req`对象中多了一个`auth`(低版本的为user)对象，用于保存还原后的json对象数据
6. jwt 错误捕获：使用`express`错误中间件进行捕获

代码演示
```javascript
// 导入 express 模块
const express = require('express')

// 导入 cors 允许跨域资源共享
const cors = require('cors')

const bodyParser = require('body-parser')
// 创建 express 服务器实例
const app = express();

// jwt: 1、安装并导入jwt相关的两个包： jsonwebtoken、express-jwt
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')



//允许跨域资源共享
app.use(cors())

// 配置express 接收json数据
const json = express.json({type: '*/json'})
app.use(json)

// 解析post表单数据中间件
app.use(bodyParser.urlencoded({ extended: false}));


// jwt: 2、定义secret秘钥,建议将秘钥命名为 secretKey
const secretKey = 'dxg_No1 ^_^';


// jwt: 4、 解析还原token为json对象
// （1）使用 app.use()来注册中间件；
// （2）expressjwt({secret: secretKey}) 就是用来解析token的中间件
// （3）.unless({path: [/^\/api\//]}) 用来指定那些接口不需要访问权限
// 注意：只要配置成功了express-jwt 这个中间件，就可以把解析出来的用户信息，挂载到req.user属性上
// algorithms: ['HS256'] --> 对称算法和非对称算法(即HS256/RS256)  
app.use(expressjwt({secret: secretKey, algorithms: ['HS256']}).unless({path: [/^\/api\//]}))


// 登录接口
app.post('/api/login', (req, res) => {
    const userInfo = req.body

    console.log(userInfo)

    //登录失败
    if(userInfo.username !== 'admin' || userInfo.password !== '123456') {
        return res.send({
            status: 400,
            message: '登录失败！'
        })
    }

    // 登录成功，
    // jwt: 3、在登录成功之后，在调用jwt.sign()方法生成jwt字符串，并通过token属性发送给客户端
    // jwt.sign() 三个参数分别为 用户的信息对象，加密的秘钥，配置对象，可以配置当前token的有效期
    const tokenStr = jwt.sign({username: userInfo.username}, secretKey, {expiresIn: '300s'})
    res.send({
        status: 200,
        message: '登录成功！',
        token: tokenStr
    })
})

app.get('/admin/getInfor', (req, res) => {
    // jwt: 5、 使用req.user(新版本req.auth)获取用户信息，并使用data属性将用户信息发送给客户端
    console.log('req.auth', req.auth)
    res.send({
        status: 200,
        message: '获取用户信息成功！',
        data: req.auth // 要发送给客户端的用户信息
    })
})

// 错误捕获
app.use((err, req, res, next) => {
    // jwt: 6、错误捕获
    // token解析失败导致的错误
    if(err.name === 'UnauthorizedError') {
        return res.send({status: 401, message: '无效的token'})
    }
    // 其他原因导致的错误
    res.send({status: 500, message: '未知异常'})
})

app.listen('8080', ()=> {
    console.log('server run in http://127.0.0.1:8080')
})
```
### 中间件

- 1、中间件的作用
> 多个中间件之间共享一份`req`和`res`。基于这样的特性，我们可以在上游的中间件中统一为`req`或`res`对象添加自定义的属性和方法，供下游中间件或路由使用。

- 2、中间件的分类
> 1. 应用级别的中间件（全局中间件），使用app.use()来注册全局中间件
> 2. 路由级别的中间件（局部中间件）
> 3. 错误级别的中间件
> 4. express内置的中间件：`json()`、`static()`、`urlencoded()`
> 5. 第三方中间件： `body-parser`

- 3、定义多个全局中间件，会按照注册顺序依次执行，多次使用`app.use()`进行注册
- 4、局部有效中间件(不使用app.use()注册)，写法为`app.get('/user', mv1, function(req, res){...})`；同时使用多个中间件写法(2种)：`app.get('/user', mv1,mv2, function(req, res){...})`、`app.get('/user', [mv1, mv2], function(req, res){...})`
- 5、中间件的5个使用注意事项
> 1. 一定要在路由之前注册中间件
> 2. 客户端发送过来的请求可以连续调用多个中间件进行处理
> 3. 执行完中间件的业务代码后，不要忘记调用`next()`函数
> 4. 为了防止业务代码逻辑混乱，调用`next()函数后不要再写额外的代码`
> 5. 连续调用多个中间件时，多个中间件之间共享`req`和`res`对象

- 代码演示

```javascript
const express = require('express');

const app = express();

const mv1 = (req, res, next) => {
    console.log('中间件1');
    next()
}
const mv2 = (req, res, next) => {
    console.log('中间件2');
    next()
}

app.use(express.json())

// 全局中间件
app.use(mv1)

// 路由中间件（局部中间件）
app.post('/', [mv2], (req, res) => {
    /*
    *中间件1
		*中间件2
		*访问了 / 路由
    */
    console.log('访问了 / 路由');
    res.send(req.body)
})

app.get('/', (req, res) => {
    /*
    *中间件1
    */
    res.send(req.query)
})

app.listen(80, () => {
    console.log('httP://localhost');
})
```
### CORS跨域资源共享

- 分类
> 1. `Access-Control-Allow-Origin` ---  控制访问来源
> 2. `Access-Control-Allow-Header` ---  控制访问请求头
> 3. `Access-Control-Allow-Methods` --- 控制访问请求方式

### CORS请求分类

1. 简单请求
> 1. 请求方式为： GET、 POST、HEAD三者之一
> 2. http请求头部信息不超过以下几种字段：无自定义头部字段、Accept、Accept-language、Content-Language、DRR、DownLink、save-Data、viewport-width、width、content-type（只有三个值：application/x-www-urlencoded、multipart/form-data、text/plain）

2. 预检请求Option：不符合普通请求就是
### 关于jsonp

- 概念
> 浏览器通过`script`标签的`src`属性请求服务器数据同时服务器发挥一个函数调用，这种请求数据的方式叫做`jsonp`。

- 特点
> 1. 不属于真正的ajax请求，因为没有使用`XMLHTTPRequest`对象
> 2. 仅支持`GET`请求方式，不支持POST、PUT、DELETE等等

- 创建jsonp接口注意事项
> 如果项目中已设置了CORS跨域资源共享，为防止冲突，必须在配置CORS中间件之前声明jsonp接口，否则jsonp即可会被处理成开启CORS接口

- 创建步骤
> 1. 获取毁掉方法名称
> 2. 定义要发送给客户端的数据
> 3. 拼接出一个函数调用
> 4. 把拼接字符串响应给客户端

