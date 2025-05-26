# 小程序云开发模板项目

本项目是一个基于小程序 + 云开发的空白项目，提供了基本的云开发能力演示，帮助开发者快速上手小程序云开发。

## 项目特点

📄 小程序完善的前端开发能力
🚀 集成云开发云函数等后端能力
🤖 集成 AI IDE 规则，提供智能化开发体验
☁️ 集成云开发 MCP，提供一站式云服务开发部署体验
🎁 深度集成腾讯云开发 CloudBase，提供一站式后端云服务

## 项目架构

### 云函数
- `getOpenId`：用于获取用户的 `openid`、`appid` 和 `unionid`。

### 小程序页面
- `index`：初始页面，用于展示获取到的 `openid`。

## 开始使用

### 前提条件
- 安装小程序开发工具。
- 拥有腾讯云开发账号。

### 安装依赖
云函数依赖已在 `cloudfunctions/getOpenId/package.json` 中定义，可在云开发控制台中安装依赖。

### 配置云开发环境
在小程序开发工具中，打开 `miniprogram/app.js` 文件里修改环境 ID，找到如下代码部分：
```javascript
wx.cloud.init({
  env: 'your-env-id', // 替换为你的云开发环境 ID  
  traceUser: true,
});
```
将 `your-env-id` 替换为你实际的云开发环境 ID。

### 本地开发
1. 打开小程序开发工具，导入本项目。
2. 上传并部署 `getOpenId` 云函数。
3. 点击开发工具中的预览按钮，查看效果。

## 目录结构
```
├── cloudfunctions/
│   └── getOpenId/
│       ├── index.js
│       └── package.json
├── miniprogram/
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── components/
│   ├── pages/
│   │   └── index/
│   │       ├── index.js
│   │       ├── index.json
│   │       ├── index.wxml
│   │       └── index.wxss
│   └── sitemap.json
├── project.config.json
└── project.private.config.json
```

## 扩展开发
您可以根据项目需求，添加新的云函数和页面，实现更多的云开发功能。