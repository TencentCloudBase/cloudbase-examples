# 查询天气 Agent ———— 基于混元大模型

本模板提供了自定义 Agent 的云函数实现，通过调用大模型封装 Agent 接口，部署后提供以下 Agent 相关接口：

```shell
GET    /:botId/records             聊天记录
POST   /:botId/feedback            提交用户反馈
GET    /:botId/feedback            获取用户反馈
GET    /:botId/recommend-questions 获取推荐问题
GET    /:botId/send-message        发送消息
```

其中，我们对这两个接口进行了简单实现，通过大模型能力构建了一个查询天气的 Agent，并将调用结果通过 SSE 返回。

- GET /:botId/recommend-questions 获取推荐问题
- GET /:botId/send-message Tcb 发送消息

其余的接口只做了空实现，保证返回值符合类型，但无真实功能，需要开发者自行实现。

- GET /:botId/records 聊天记录
- POST /:botId/feedback 提交用户反馈
- GET /:botId/feedback 获取用户反馈

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
