# 云开发 · 自定义登陆授权服务器

## 特性

- 基于 Koa 开发
- 提供[云开发自定义登陆](https://cloud.tencent.com/document/product/876/34660#.E8.87.AA.E5.AE.9A.E4.B9.89.E7.99.BB.E5.BD.95)的服务端实现

## 用法

1. clone 项目到本地
2. 从腾讯云·云开发控制台中的[用户管理](https://console.cloud.tencent.com/tcb/user) 中获取私钥, 并替换本项目目录中的 `tcb_custom_login.json` 文件![](https://main.qcloudimg.com/raw/e08751567a86afceda9e3e8536d37c52.png)
3. 执行 `npm install` 来安装相关依赖
4. 执行 `npm run serve` 启动服务
5. 在 Web 端使用 `fetch` 等 API 请求 `loclhost:3000` 获取到用户的登陆 Ticket
6. 在 Web 端使用 `auth.signInWithTicket(ticket)` 完成登陆。

## 文档
### 业务时序图
![](https://postimg.aliavv.com/mbp/6csa1.png)
### 架构图
![](https://postimg.aliavv.com/mbp/9ti97.png)
## 文件说明
```bash
- index.js // 项目主文件
- package.json // 项目依赖文件
- tcb-custom-login.json // 自定义登陆密玥，替换为你自己的
```

## LICENSE
ISC