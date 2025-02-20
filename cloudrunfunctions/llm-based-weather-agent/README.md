# 查询天气 Agent ———— 基于混元大模型

本模板提供了自定义 Agent 的云函数实现，通过调用大模型封装 Agent 接口，部署后提供以下 Agent 相关接口：

```shell
GET    /:botId/records             获取聊天记录
POST   /:botId/feedback            提交用户反馈
GET    /:botId/feedback            获取用户反馈
GET    /:botId/recommend-questions 获取推荐问题
POST    /:botId/send-message       发送消息
```

本模板使用了 `@cloudbase/aiagent-framework`，只需要实现该库定义的 Agent 接口即可完成接入，详见 `src/bot.ts`。

## 部署须知

在部署至云函数前，请运行以下命令：

```shell
npm run preDeploy
```

## 参考文档

- [云函数2.0](https://docs.cloudbase.net/cbrf/intro)
- [云开发 AI+](https://docs.cloudbase.net/ai/introduce)
