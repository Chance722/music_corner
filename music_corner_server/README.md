# music_corner_server

## 环境依赖
	node v8.0+
	mysql

## 部署步骤

```
1. 安装依赖
   cnpm install

2. 新建数据库nodesql 数据库用户名与密码与配置文件保持一致
>  something to do...

3. 初始化建表
   npm run mysql

3. 启动服务器
   npm run dev 
```

## 项目说明

1. 使用koa2-generator搭建, app目录 -> 服务端代码逻辑实现, config目录 -> 数据库配置, lib目录 -> 初始化建表代码实现, middlewares
     -> 中间件, routes目录 -> 接口路由文件

2. controllers目录只做路由转发, 具体逻辑实现放在services目录

3. models目录做表建模, 每张表对应一个js文件, 用于数据库操作

4. helper目录放置自己封装的工具类

5. public目录放置服务端静态文件
