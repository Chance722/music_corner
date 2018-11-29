# music_corner
音乐角落小程序项目（服务端 + 审核后台 + mpvue 小程序）

## 写在前面
该项目主要用于小程序开发及nodejs服务端开发练手（而且还没开发完），所以切勿生搬硬套。下面先说下项目的整体架构：
* 1 服务端采用koa2+mysql，使用sequelize.js作为数据库orm工具
* 2 审核后台普通的vue单页应用
* 3 小程序则基于美团开源的mpvue框架进行开发

项目思路：
 *小程序主要提供一个音乐交流及分享的平台，在该小程序上有入口可以给用户提供来自唱吧app或者全民K歌app的歌曲分享链接，服务端通过该链接,可以爬取歌曲内容并将歌曲信息上传到七牛，审核后台则通过相关接口获取用户上传的歌曲列表。经过审核后台审核通过的歌曲，便会同步更新到小程序的歌曲列表，淘汰的歌曲则从七牛上删除对应的歌曲副本，此外，小程序上的歌曲还应支持评论，点赞，收藏，搜索等功能，审核后台也应有数据统计，查看留言，更改管理员资料等基本功能
 （注：七牛已经对测试域名进行回收机制，解决办法详见[七牛测试域名过期解决办法](https://github.com/qiniu/qshell/issues/188)）*
 
 ###########环境依赖
 
 node v8.0+
 mysql
 
 ###########部署步骤
 
1. 安装各个项目的项目依赖
npm install
2. 启动服务端，详见music_corner_server内README.md
3. 使用微信开发者工具运行mpvue项目，详见[mpvue官网5分钟上手教程](http://mpvue.com/mpvue/quickstart/)
4. 启动审核后台，npm run dev

#############部分项目截图

![image](https://user-images.githubusercontent.com/27771964/49151143-1168a400-f34a-11e8-8f3e-d06144017aab.png)

![image](https://user-images.githubusercontent.com/27771964/49151194-35c48080-f34a-11e8-9119-288a39229a12.png)

![image](https://user-images.githubusercontent.com/27771964/49151207-41b04280-f34a-11e8-9cf8-fbbf1a5a8ebe.png)

![image](https://user-images.githubusercontent.com/27771964/49151245-5f7da780-f34a-11e8-9ac4-473e285d44dd.png)

![image](https://user-images.githubusercontent.com/27771964/49151269-6e645a00-f34a-11e8-9f6f-c73b25901dd2.png)

![image](https://user-images.githubusercontent.com/27771964/49151303-8340ed80-f34a-11e8-8c06-5b670f4c5826.png)
