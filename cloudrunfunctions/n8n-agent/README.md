# n8n Agent

本模板介绍如何将 n8n 的 workflow 接入云开发函数型智能体。
模板中包含一个 workflow，该工作流通过 n8n 的 Webhook 节点接收外部请求，根据请求进行条件判断（If 节点），将不同的请求分发给不同的 AI 大模型（如 Primary AI Agent 或 Secondary LLM），并可通过 MCP 调用云开发的搜索工具。模型处理完成后，最终通过 Webhook 响应返回给调用方。

```shell
# 发送消息
POST    /v1/aibot/bots/:botId/send-message

# 根据用户输入，推荐相似问题
POST    /v1/aibot/bots/:botId/recommend-questions
```

## 准备工作

### 部署 MCP 搜索工具
1. 部署 `云开发 AI 能力` MCP server，登陆云开发控制台，进入 `AI+ -> MCP`，点击 `创建 MCP server`，选择 `云开发 AI 能力`，鉴权方式选择 `云开发 API key 授权`，开始部署
1. MCP server 创建部署完成以后，进入详情页，复制 MCP server URL，在 `配置 MCP` 标签页中根据指引获取 API key

### 创建 n8n workflow
1. 将仓库中的 `Agent_for_cloudbase.json` 文件导入 n8n，创建 workflow
1. 获取工作流的 Webhook 地址，在工作流编辑器中选择 `Webhook` 节点，在配置面板中复制 Webhook URL `<your-webhook-url>`
1. 配置 Webhook URL 鉴权，在 `Webhook` 节点中配置 `Authentication` 为 `Header Auth`，在 `Credential for Header Auth` 中新建 credential，并设置 `Name` 为 `Authorization`，`Value` 为 `Bearer <your-token>`
1. 配置模型节点，这个示例中选择 DeepSeek 模型，[获取 API key](https://api-docs.deepseek.com/)。你可以根据需要选择其他模型
1. 配置 MCP 节点，`SSE endpoint` 为 MCP server URL，鉴权方式选择 `Bearer token`，`Credential for Bearer token` 为 MCP server API key

## 部署须知

注意：在部署至云函数前，请删除本目录的 node_modules。
复制 .env.example 文件为 .env，将之前准备 webhook URL 和 webhook token 填入 .env 文件中。

## 本地调试指引

运行 `npm run dev` 启动本地调试。

现在即可通过 `127.0.0.1:3000` 访问本地 Agent 服务了。

### cURL 访问本地服务

直接访问 `127.0.0.1:3000` 即可，例如 `POST /v1/aibot/bots/:botId/send-message 发送消息` 接口：

```shell
curl 'http://127.0.0.1:3000/v1/aibot/bots/ibot-myBot-botTag/send-message' \
  -H 'Accept: text/event-stream' \
  -H 'Content-Type: application/json' \
  --data-raw '{"msg":"hi"}'
```

### Web 访问本地服务

使用 Web 页面访问本地服务，可以直接编写网络请求代码，也可以使用 [@cloudbase/js-sdk 提供的 Agent SDK](https://docs.cloudbase.net/ai/agent/sdk)。

若使用 @cloudbase/js-sdk，则需要配置一定的代理服务。以 [whistle](https://wproxy.org/whistle/) 举例，按照如下配置：

```shell
/.*.api.tcloudbasegateway.com/([^S]*)/ http://localhost:3000/$1
```

即可使用 @cloudbase/js-sdk 用以下代码访问到本地服务：

```js
const res = await ai.bot.sendMessage({
  botId: "ibot-myBot-botTag",
  msg: "hi",
  history: [],
});

for await (let x of res.textStream) {
  console.log(x);
}
```

## 参考文档

- [函数型智能体](https://docs.cloudbase.net/ai/cbrf-agent/intro)
- [云函数 2.0](https://docs.cloudbase.net/cbrf/intro)
- [云开发 AI+](https://docs.cloudbase.net/ai/introduce)
