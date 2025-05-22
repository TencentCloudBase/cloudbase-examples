![awsome-cloudbase-examples](https://socialify.git.ci/TencentCloudBase/awsome-cloudbase-examples/image?font=Inter&forks=1&owner=1&pattern=Circuit+Board&stargazers=1)

# Awesome CloudBase Examples

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)


<<<<<<< HEAD
- android: 存放 Android 端 Demo / Workshop
- ios: 存放 iOS 端 Demo / Workshop
- minigame: 存放小游戏端 Demo / Workshop
- miniprogram: 存放小程序端 Demo / Workshop
- server: 存放服务端 Demo / Workshop
- web: 存放 Web 端 Demo / Workshop
- cloudbaserun: 存放 云应用 端 Demo / Workshop
- cloudrunfunctions: 存放 `函数型云托管` Demo
- lowcode: 存放微搭低代码应用
=======
>>>>>>> 1c1d250 (doc: 更新文档)

> 精选的腾讯云开发（CloudBase）示例项目和资源列表

[云开发（CloudBase）](https://cloud.tencent.com/product/tcb) 是腾讯云提供的云原生一体化开发环境和工具平台，为开发者提供高可用、自动弹性扩缩的后端云服务，包含计算、存储、托管等能力，可用于构建多种应用场景下的应用系统。

## 目录

- [官方资源](#官方资源)
- [示例项目](#示例项目)
  - [Web 应用](#web-应用)
  - [小程序](#小程序)
  - [小游戏](#小游戏)
  - [云托管应用](#云托管应用)
  - [函数型托管](#函数型托管)
  - [AI Agent 服务](#ai-agent-服务)
  - [MCP Server](#mcp-server)
  - [低代码应用](#低代码应用)
- [贡献指南](#贡献指南)
- [联系我们](#联系我们)
- [许可证](#许可证)

## 📚 官方资源

- [云开发官网](https://cloud.tencent.com/product/tcb) - 腾讯云开发产品官网
- [云开发控制台](https://console.cloud.tencent.com/tcb) - 云开发管理控制台
- [云开发文档](https://cloud.tencent.com/document/product/876) - 官方文档
- [云开发 CLI](https://github.com/TencentCloudBase/cloudbase-cli) - 云开发命令行工具
- [云开发 Framework](https://github.com/Tencent/cloudbase-framework) - 云开发多端应用前后端一体化部署工具

## 💡 示例项目

### 🌐 Web 应用

- [React 应用模板](./web/cloudbase-react-template) - 基于 React 的云开发应用模板
- [文件上传下载](./web/tcb-demo-files) - 云开发文件存储示例
- [自定义登录](./web/custom-login) - Web 端自定义登录认证示例
- [下载代理示例](./web/download-agent-demo) - 云开发下载代理示例
- [快照工具](./web/snapshots) - 网页快照与截图工具

### 📱 小程序

- [AgentUI](./miniprogram/tcb-agent-ui) - 云开发Agent UI AI 小程序
- [AI 相机](./miniprogram/tcb-demo-AICamera) - 基于云开发的 AI 相机小程序
- [博客](./miniprogram/tcb-demo-blog) - 基于云开发的博客小程序
- [论坛](./miniprogram/tcb-demo-bbs) - 基于云开发的论坛小程序
- [美食地图](./miniprogram/tcb-demo-foodmap) - 基于云开发的美食地图小程序
- [表白墙](./miniprogram/tcb-demo-hole) - 基于云开发的表白墙小程序
- [名片小程序](./miniprogram/tcb-demo-namecard) - 基于云开发的名片小程序
- [名片小程序专业版](./miniprogram/tcb-demo-namecard-pro) - 基于云开发的名片小程序专业版
- [OCR 识别](./miniprogram/tcb-demo-ocr) - 基于云开发的 OCR 文字识别小程序
- [AI 应用](./miniprogram/tcb-demo-ai) - 基于云开发的 AI 应用示例
- [订阅消息](./miniprogram/tcb-demo-subscribeMessage) - 基于云开发的订阅消息示例
- [短信验证码](./miniprogram/tcb-demo-sms) - 基于云开发的短信验证码示例
- [安全示例](./miniprogram/tcb-demo-sec) - 基于云开发的安全功能示例
- [视频应用](./miniprogram/tcb-demo-video) - 基于云开发的视频应用示例
- [用户管理](./miniprogram/tcb-demo-user) - 基于云开发的用户管理示例
- [体育赛事](./miniprogram/tcb-demo-sports) - 基于云开发的体育赛事小程序
- [早餐店](./miniprogram/tcb-demo-breakfast) - 基于云开发的早餐店小程序
- [弹幕应用](./miniprogram/tcb-demo-danmu) - 基于云开发的弹幕应用示例
- [相册应用](./miniprogram/tcb-demo-album) - 基于云开发的相册应用示例
- [头像编辑器](./miniprogram/tcb-demo-avatar) - 基于云开发的头像编辑器示例
- [小程序转微信小商店](./miniprogram/tcb-demo-mpToWxStore) - 小程序转微信小商店示例
- [消息推送](./miniprogram/tcb-demo-messsend) - 基于云开发的消息推送示例
- [祝福小程序](./miniprogram/tcb-demo-happy) - 基于云开发的祝福小程序
- [商城示例](./miniprogram/tcb-shop) - 基于云开发的商城小程序
- [官网模板](./miniprogram/tcb-official-website) - 基于云开发的官网模板小程序
- [订阅消息](./miniprogram/subscription-message) - 订阅消息示例

### 🎮 小游戏

- [五子棋](./minigame/tcb-demo-gomoku) - 基于云开发的五子棋小游戏



### ☁️ 云托管应用

- [Node.js 应用](./cloudbaserun/node) - 基于云应用的 Node.js 示例
- [PHP 应用](./cloudbaserun/php) - 基于云应用的 PHP 示例
- [Java 应用](./cloudbaserun/java) - 基于云应用的 Java 示例
- [Go 应用](./cloudbaserun/go) - 基于云应用的 Go 示例
- [Python 应用](./cloudbaserun/python) - 基于云应用的 Python 示例
- [Spring Cloud Docker](./cloudbaserun/spring-cloud-docker-demo) - 基于 Spring Cloud 的 Docker 示例
- [Hello World](./cloudbaserun/helloworld) - 云应用入门示例

### ⚡ 函数型托管

- [TypeScript 多函数](./cloudrunfunctions/ts-multiple-functions) - 基于 TypeScript 的多函数示例
- [全栈项目](./cloudrunfunctions/fullstack-project) - 云函数全栈项目示例
- [消息中心](./cloudrunfunctions/message-center) - 基于云函数的消息中心示例

### 🤖 AI Agent 服务

- [DeepSeek Agent](./cloudrunfunctions/deepseek-agent) - DeepSeek 大模型代理示例
- [Manus Agent](./cloudrunfunctions/manus-agent) - Manus 代理示例
- [Mastra Agent](./cloudrunfunctions/mastra-agent) - Mastra 代理示例
- [元器 Agent](./cloudrunfunctions/yuanqi-agent) - 源起代理示例
- [空白 Agent 模板](./cloudrunfunctions/empty-agent) - 代理空白模板
- [大模型天气 Agent](./cloudrunfunctions/llm-based-weather-agent) - 基于大模型的天气代理示例
- [腾讯云智能体开发平台Agent](./cloudrunfunctions/lke-agent) - 腾讯云智能体开发平台 Agent 示例

### 🔗 MCP Server

- [混元 3D MCP](./cloudrunfunctions/cloudrun-mcp-hunyuan-3d) - 混元 3D 生成代理示例
- [Manus MCP](./cloudrunfunctions/cloudrun-mcp-mini-manus) - Manus 迷你代理示例
- [模拟医院 MCP](./cloudrunfunctions/cloudrun-mcp-mock-hospital) - 模拟医院代理示例


### 🔧 低代码应用

- [客户关系管理系统](./lowcode/scrm-demo) - 基于低代码平台的客户关系管理系统示例


## 🤝 贡献指南

欢迎贡献更多优质的云开发示例！请阅读我们的[贡献指南](CONTRIBUTING.md)，了解项目结构和如何提交您的示例项目。

## 📞 联系我们

更多云开发使用技巧及大前端 Serverless 行业动态，扫码关注我们：

<p align="center">
    <img src="https://puui.qpic.cn/vupload/0/20190603_1559545575934_lettsbvkvdn.jpeg/0" width="200px">
</p>

## 📄 许可证

[MIT](LICENSE)
