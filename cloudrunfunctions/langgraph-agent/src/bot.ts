import { BotCore, IBot, SendMessageInput } from "@cloudbase/aiagent-framework";
import { DynamicTool } from "langchain/tools";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatDeepSeek } from "@langchain/deepseek";
import { TavilySearch } from "@langchain/tavily";
import { HumanMessage } from "@langchain/core/messages";
import { TencentHunyuanEmbeddings } from "@langchain/community/embeddings/tencent_hunyuan";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createSupervisor } from "@langchain/langgraph-supervisor";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
const { PostClientTransport } = require("@cloudbase/mcp/transport/client/post");
import { StructuredTool } from "langchain/tools";
import { z, ZodTypeAny } from "zod";

// FAQ RAG 工具
async function getRetrieverTool() {
  const embeddings = new TencentHunyuanEmbeddings();
  const loader = new CheerioWebBaseLoader(
    "https://docs.cloudbase.net/ai/FAQ"
  );
  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  const documents = await splitter.splitDocuments(docs);
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    embeddings
  );
  const retriever = vectorStore.asRetriever();
  return new DynamicTool({
    name: "faq_rag",
    description: "在云开发AI FAQ 知识库中检索相关内容",
    func: async (input: string) => {
      const docs = await retriever.getRelevantDocuments(input);
      return docs.map((d) => d.pageContent).join("\n");
    },
  });
}

// 联网搜索工具
function getSearchTool() {
  return new TavilySearch({ maxResults: 5, topic: "general" });
}

// 简易实现 jsonSchema 转 zod schema
function jsonSchemaToZodSchema(schema: any): ZodTypeAny {
  switch (schema.type) {
    case "string":
      return z.string();
    case "number":
      return z.number();
    case "integer":
      return z.number().int();
    case "boolean":
      return z.boolean();
    case "array":
      return z.array(jsonSchemaToZodSchema(schema.items));
    case "object":
      const shape: Record<string, ZodTypeAny> = {};
      for (const key in schema.properties) {
        shape[key] = jsonSchemaToZodSchema(schema.properties[key]);
      }
      let obj = z.object(shape);
      if (schema.required) {
        for (const key in shape) {
          if (!schema.required.includes(key)) {
            obj = obj.partial({ [key]: true } as any);
          }
        }
      } else {
        obj = obj.partial();
      }
      return obj;
    default:
      return z.any();
  }
}

// 适配 MCP 工具为 StructuredTool
function mcpToolToStructuredTool(mcpTool: any, mcpClient: any) {
  const zodSchema = jsonSchemaToZodSchema(mcpTool.inputSchema);
  return new (class extends StructuredTool {
    name = mcpTool.name;
    description = mcpTool.description;
    schema = zodSchema;
    async _call(input: any) {
      const result = await mcpClient.callTool({
        name: mcpTool.name,
        arguments: input,
      });
      return typeof result === "string" ? result : JSON.stringify(result);
    }
  })();
}

export class MyBot extends BotCore implements IBot {
  private mcpClient: Client | null = null;
  private retrieverTool: DynamicTool | null = null;
  private searchTool: TavilySearch | null = null;
  constructor(context: any) {
    super(context);
    this.mcpClient = null;
  }

  async sendMessage({ msg }: SendMessageInput): Promise<void> {
    console.log('context', this.context);
    if (!this.mcpClient) {
      try {
        this.mcpClient = await this.getMCPClient();
      } catch (e) {
        console.error('getMCPClient error', e);
      }
    }

    // 工具准备
    if (!this.retrieverTool) {
      this.retrieverTool = await getRetrieverTool();
    }
    if (!this.searchTool) {
      this.searchTool = getSearchTool();
    }

    const retrieverTool = await getRetrieverTool();
    const searchTool = getSearchTool();

    // LLM
    const llm = new ChatDeepSeek({ model: "deepseek-chat", streaming: false });
    // 子Agent
    const faqAgent = createReactAgent({
      llm,
      tools: [retrieverTool],
      prompt: "你是云开发FAQ知识专家，善于用工具检索云开发 AI 相关知识，为团队提供权威解答。遇到无法解答的问题可交给其他助手。",
      name: "faqAgent",
    });
    const searchAgent = createReactAgent({
      llm,
      tools: [searchTool],
      prompt: "你是互联网搜索专家，善于用工具联网搜索，为团队补充最新信息。遇到无法解答的问题可交给其他助手。",
      name: "searchAgent",
    });

    let mapAgent = null

    if (this.mcpClient) {
      const tools = await this.mcpClient.listTools();
      console.log('mcp tools', tools, JSON.stringify(tools.tools[0]));
      const structuredTools = tools.tools.map((tool: any) =>
        mcpToolToStructuredTool(tool, this.mcpClient)
      );

      mapAgent = createReactAgent({
        llm,
        tools: structuredTools,
        prompt: "你是地图导航助手，善于用工具查询地理信息和导航信息。遇到无法解答的问题可交给其他助手。",
        name: "mapAgent",
      });
    }

    // Supervisor LLM
    const supervisorLLM = new ChatDeepSeek({ model: "deepseek-chat", streaming: true });
    // Supervisor prompt
    const supervisorPrompt = "你是一个AI主管，负责判断用户问题应该分配给FAQ专家，搜索专家，还是导航专家。请根据问题内容，合理分配任务。";
    // 创建 Supervisor
    const agents = [faqAgent as any, searchAgent as any]
    if (mapAgent) {
      agents.push(mapAgent as any)
    }
    const supervisor = createSupervisor({
      agents: agents,
      llm: supervisorLLM,
      prompt: supervisorPrompt,
    }).compile();
    // 启动流式协作
    const stream = await supervisor.stream({
      messages: [new HumanMessage(msg)],
    });

    let finalMessages: any[] = []
    for await (const chunk of stream) {
      console.log('agent 工具 chunk', chunk);
      // 只流式输出最终AI回复
      if (chunk?.supervisor?.messages) {
        // 只取supervisor的messages, 
        const messages = chunk.supervisor.messages;
        finalMessages = messages as any[]
      }
    }

    // 用 finalMessages 作为 prompt，流式总结
    const streamingLLM = new ChatDeepSeek({ model: "deepseek-chat", streaming: true });
    const summaryStream = await streamingLLM.stream(finalMessages);
    for await (const chunk of summaryStream) {
      console.log('summary chunk', chunk);
      this.sseSender.send({
        data: {
          content: chunk.content as string,
          role: 'assistant',
          type: 'text',
          model: 'deepseek-v3-0324',
          finish_reason: '',
        },
      });
    }

    this.sseSender.end();
  }

  // MCP 客户端
  async getMCPClient() {
    if (!process.env.MCP_SERVER_URL) {
      throw new Error('MCP_SERVER_URL is not set');
    }

    const transport = new PostClientTransport(
      new URL(
        process.env.MCP_SERVER_URL as string
      ),
      {
        requestInit: {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      }
    );

    const client = new Client(
      {
        name: "mcp-tencent-map-xunif0",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    await client.connect(transport);
    return client;
  }

  // 从上下文中获取云开发 accessToken
  get apiKey() {
    const accessToken = this.context?.extendedContext?.accessToken || process.env.TCB_API_KEY;
    if (typeof accessToken !== "string") {
      throw new Error("Invalid accessToken");
    }

    return accessToken.replace("Bearer", "").trim();
  }
}
