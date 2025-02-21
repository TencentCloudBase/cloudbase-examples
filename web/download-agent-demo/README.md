# 微搭项目集成文档

## 项目概述
本项目基于腾讯云微搭低代码平台构建，使用React技术栈进行开发。项目通过集成微搭SDK实现与云开发服务的连接，支持多环境（开发/测试/预发布/生产）配置。

如果模仿该项目在您的项目中使用微搭代码包，请注意项目中的 ATTENTION 注释。

## 环境准备
### 系统要求
- Node.js v16.x（推荐使用nvm管理版本）
- npm 8.x+
- 现代浏览器（Chrome 88+ / Edge 88+）

### 依赖安装
```bash
# 安装项目基础依赖
npm install

# 安装下载的微搭代码包（确保当前目录存在./src/weda）
npm install ./src/weda
```

## 项目配置

### 环境ID配置

1. 打开 `./src/App.tsx` 文件
2. 定位到云环境初始化代码段：
    ```typescript
    wedaClient.app.init({
        /** 当前是否处于正式发布模式 */
        isProd: true,
        /** 云开发环境ID */
        envId: "YOUR_ENV_ID",
    });
    ```
3. 将 `YOUR_ENV_ID` 替换为从腾讯云控制台获取的实际环境ID


### 注意事项

- 目录结构：
  - 微搭SDK包必须位于 `./src/weda` 目录
  - 禁止修改 `./src/**/ATTENTION` 注释标记的代码段

### 版本兼容：

- 严格使用 Node.js 16.x 版本

### 如遇安装错误，尝试清除缓存：

```bash
rm -rf node_modules && npm cache clean --force
```

## 脚本说明

### 开发命令
```bash
# 启动开发服务器（默认开发环境）
npm run dev

# 指定环境启动
npm run dev:test    # 测试环境
npm run dev:pre     # 预发布环境
npm run dev:prod    # 生产环境
```

### 构建命令
```bash
# 构建开发环境包
npm run build:dev

# 构建测试环境包
npm run build:test

# 构建预发布环境包
npm run build:pre

# 构建生产环境包
npm run build:prod
```

## 开发指南

### 本地调试
- 选择对应的环境启动命令
- 访问 http://localhost:3000 （端口可能根据配置变化）
- 开启热更新功能，代码修改后自动刷新


### 构建与部署
- 运行对应环境的构建命令
- 产物输出至/dist目录

## 常见问题

### Q1: 如何获取环境ID？
A: 登录腾讯云控制台或者云开发控制台

### Q2: 安装微搭代码包报错？
A: 请检查：
- Node版本是否为v16.x
- ./src/weda目录是否存在
