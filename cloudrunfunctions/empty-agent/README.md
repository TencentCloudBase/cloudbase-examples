# 空白 Agent

本模板提供了自定义 Agent 的云函数实现，封装了一个最简的 Agent 接口，部署后提供以下 Agent 相关接口：

```shell
POST    /:botId/send-message       发送消息
```

本模板使用了 `@cloudbase/aiagent-framework`，只需要实现该库定义的 Agent 接口即可完成接入，详见 `src/bot.js`。

## 部署须知

在部署至云函数前，请删除本目录的 node_modules。

```shell
npm run preDeploy
```

## 参考文档

- [云函数2.0](https://docs.cloudbase.net/cbrf/intro)
- [云开发 AI+](https://docs.cloudbase.net/ai/introduce)
