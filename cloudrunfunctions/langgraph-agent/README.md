# LangGraph 多Agent协作 函数型智能体模板

## 项目简介

本项目是一个基于 [LangGraph](https://github.com/langchain-ai/langgraph) 框架的多Agent协作智能体模板。
它支持多智能体（Agent）协作、流式输出，云开发 MCP Server调用，适合构建复杂的 AI 助手、RAG 检索、智能问答等场景。

- **多Agent协作**：支持 FAQ 检索、联网搜索、地图导航等多智能体分工协作
- **Supervisor 自动调度**：采用 langgraph-supervisor，自动分配任务给最合适的 Agent
- **流式输出**：支持 Supervisor 多阶段流式 + 总结 LLM token 级流式
- **Agent 集成云开发 MCP 工具调用**：智能体中支持配置调用云开发 MCP Server

---

## 架构与流程说明

### 多Agent 协作架构

![](https://qcloudimg.tencent-cloud.cn/raw/5fca7334d5a552d4a8d4f9a6c6d423ab.png)

> **说明：**
> - 用户输入首先由 Supervisor 主管 Agent 解析，自动分配给最合适的子 Agent（FAQ、搜索、地图等）。
> - 各子 Agent 可调用工具（如 FAQ 检索、联网搜索、MCP 工具）。
> - Supervisor 汇总所有 Agent 的回复，最终交给总结 LLM 进行 token 级流式输出，提升用户体验。

---

### 主要模块说明

- **Supervisor（主管）**  
  负责全局调度，判断用户问题应分配给哪个子 Agent，自动串联多轮协作。

- **FAQ Agent**  
  内置 RAG 检索工具，专注于云开发 FAQ 知识库问答。

- **Search Agent**  
  内置联网搜索工具（如 Tavily），补充最新互联网信息。

- **Map Agent**  
  动态注入 MCP 工具（如地图/导航/自定义 API），自动适配 JSON Schema → zod schema，支持 StructuredTool 方式调用。

- **总结 LLM**  
  用于对 Supervisor 的多阶段消息流做最终 token 级流式总结，提升输出体验。

---

## 环境变量

本项目提供了环境变量模板 `.env.template`，可将其重命名为 `.env.development` 后进行编辑。 `.env.development` 将会在本地调试时生效，部署至线上时，可通过[命令行进行传参](https://docs.cloudbase.net/cli-v1/runf/deploy#%E8%BF%9B%E9%98%B6%E7%94%A8%E6%B3%95)，或者部署后前往云开发平台进行环境变量配置。

> 部分环境变量只在本地调试需要，部署至线上时可以不对这些环境变量进行配置。

- `TAVILY_API_KEY`：Tavily 搜索工具的 API Key（联网搜索用）
- `TENCENT_SECRET_ID`：腾讯云 SecretID (腾讯混元向量化模型用)
- `TENCENT_SECRET_KEY`：腾讯云 SecretKey (腾讯混元向量化模型用)
- `MCP_SERVER_URL`：您的云开发 MCP Server URL (云开发MCP Server 服务url，例：https://your-env-id.api.tcloudbasegateway.com/v1/cloudrun/your-service-name/messages)
- `CLOUDBASE_ENV_ID`：云开发环境 ID（仅本地调试使用）
- `CLOUDBASE_API_KEY`：云开发 API Key（用于 DeepSeek 大模型对话能力）（仅本地调试使用）[前往云开发平台获取](https://tcb.cloud.tencent.com/dev#/env/apikey)

如需自定义模型/embedding 能力，可改造相关环境变量。

## 依赖安装

```shell
npm install
```

## 本地调试

1. 配置好 `.env.development` 环境变量
2. 启动本地服务

```shell
npm run dev
```

3. 通过 curl/Web/SDK 访问本地服务，体验智能体能力

```shell
curl 'http://127.0.0.1:3000/v1/aibot/bots/ibot-myBot-botTag/send-message' \
  -H 'Accept: text/event-stream' \
  -H 'Content-Type: application/json' \
  --data-raw '{"msg":"云开发 Agent 使用 DeepSeek 模型时支持联网搜索吗"}'
```

## 扩展开发

- **添加新Agent**：参考 `faqAgent`，`searchAgent` 方法实现，添加到 supervisor 管理的 agent 列表即可。
- **自定义知识库**：可用 Cheerio/WebLoader 加载任意网页/文档，结合分词和 embedding 构建向量库。
- **切换模型**：修改 LLM 初始化部分即可支持其他模型（需确认模型是否支持工具调用能力）。

## 部署

```shell
npm run build
npm run deploy
```

根据输出提示填入云开发环境 id、服务名即可。

## 参考文档

- [LangGraph 官方文档](https://langchain-ai.github.io/langgraphjs/)
- [腾讯云开发 AI+](https://docs.cloudbase.net/ai/introduce)
- [函数型云托管](https://docs.cloudbase.net/cbrf/intro)
- [Tavily 官方文档](https://docs.tavily.com/)