# LangChain Agent 云开发函数型智能体模板

本项目基于腾讯云开发函数型 Agent 模板，采用 [LangChain.js](https://js.langchain.com/) 框架，提供了一个支持多工具（RAG 检索、联网搜索）能力的智能体（Agent）实现。

## 主要特性

- **多工具能力**：
  - 自定义知识库 RAG 检索（支持网页文档自动加载、分词、embedding、向量召回）
  - 联网搜索（Tavily）
- **流式输出**：支持 SSE 流式返回

## 工具能力演示

- 联网搜索

<img src="https://qcloudimg.tencent-cloud.cn/raw/a0b60cfe6672d5f7ad72489fd68bb744.png" width="375" />

- 自定义云开发 FAQ 知识库检索

<img src="https://qcloudimg.tencent-cloud.cn/raw/541e24f06da76fb80fd7b5748c724f46.png" width="375" />


## 环境变量

请参考 `.env.template`，配置如下环境变量：

- `TAVILY_API_KEY`：Tavily 搜索工具的 API Key（联网搜索用）
- `TENCENT_SECRET_ID`：腾讯云 SecretID (腾讯混元向量化模型用)
- `TENCENT_SECRET_KEY`：腾讯云 SecretKey (腾讯混元向量化模型用)
- `DEEPSEEK_API_KEY`：DeepSeek API Key （DeepSeek 大模型对话能力）

如需自定义模型/embedding 服务，可扩展相关环境变量。

## 依赖安装

```shell
npm install
```

## 本地调试

1. 配置好 `.env` 环境变量
2. 启动本地服务

```shell
npm run dev
```

3. 通过 curl/Web/SDK 访问本地服务，体验智能体能力

```shell
curl 'http://127.0.0.1:3000/v1/aibot/bots/ibot-myBot-botTag/send-message' \
  -H 'Accept: text/event-stream' \
  -H 'Content-Type: application/json' \
  --data-raw '{"msg":"2024年中国GDP是多少？"}'
```

## 扩展开发

- **添加新工具**：参考 `getSearchTool`，`getRetrieverTool` 方法实现，添加到 tools 列表即可。
- **自定义知识库**：可用 Cheerio/WebLoader 加载任意网页/文档，结合分词和 embedding 构建向量库。
- **切换模型**：修改 LLM 初始化部分即可支持其他模型（需确认模型是否支持工具调用能力）。

## 部署

```shell
npm run build
npm run deploy
```

根据输出提示填入云开发环境 id、服务名即可。

## 参考文档

- [LangChain.js 官方文档](https://js.langchain.com/docs/)
- [腾讯云开发 AI+](https://docs.cloudbase.net/ai/introduce)
- [函数型云托管](https://docs.cloudbase.net/cbrf/intro)
- [Tavily 官方文档](https://docs.tavily.com/)


