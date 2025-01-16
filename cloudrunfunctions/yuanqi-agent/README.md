# 元器自定义 Agent 云函数模板

本模板提供了自定义接入元器 Agent 的云函数实现，部署后提供以下 Agent 相关接口：

```shell
GET    /:botId/records             聊天记录
POST   /:botId/feedback            提交用户反馈
GET    /:botId/feedback            获取用户反馈
GET    /:botId/recommend-questions 获取推荐问题
GET    /:botId/send-message        Tcb发送消息
```

## 目录结构

```shell
cloudrunfunctions/src
├── getChatRecord GET /:botId/records
│   ├── impl.ts
│   └── index.ts
├── getFeedback GET /:botId/feedback
│   ├── impl.ts
│   └── index.ts
├── index.ts 解析路径转发到具体实现函数
├── recommendQuestions GET /:botId/recommend-questions
│   ├── impl.ts
│   └── index.ts
├── sendFeedback POST /:botId/feedback
│   ├── impl.ts
│   └── index.ts
├── sendMessage GET /:botId/send-message
│   ├── impl.ts
│   └── index.ts
├── type.ts 类型定义
└── utils.ts 通用方法 
```

## 环境变量

需要将从元器平台上配置的 apiKey 配置到 `YUAN_QI_API_KEY` 环境变量中。

### 使用 VSCode 调试时

需在 `/.vscode/launch.json` 中设置 `YUAN_QI_API_KEY` 环境变量。

## 部署须知

在部署至云函数前，请运行以下命令：

```shell
npm run preDeploy
```

## 使用 sdk 调用

部署后，可使用云开发 `@cloudbase/js-sdk` 进行调用。可参考：

- `/examples` 目录下的示例代码
- [通过 SDK 调用云开发 Agent](https://docs.cloudbase.net/ai/agent/sdk)

## 参考文档

- [云函数2.0](https://docs.cloudbase.net/cbrf/intro)
- [云开发 AI+](https://docs.cloudbase.net/ai/introduce)
