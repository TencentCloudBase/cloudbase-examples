import { BotCore, IBot, SendMessageInput } from "@cloudbase/aiagent-framework";
import { ChatDeepSeek } from "@langchain/deepseek";
import { HumanMessage } from "@langchain/core/messages";
import { createSupervisor } from "@langchain/langgraph-supervisor";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { PostClientTransport } from "@cloudbase/mcp/transport/client/post";
import { retrieverTool, searchTool } from "./tools.js";
import { createGeneralAgent } from "./generalAgent.js";
import { llmCallback } from "./util.js";
import { omit } from "remeda";

export class MyBot extends BotCore implements IBot {
  private mcpClient: Client | null = null;
  constructor(context: any) {
    super(context);
    this.mcpClient = null;
  }

  async sendMessage({ msg }: SendMessageInput): Promise<void> {
    console.log("context", this.context);

    const envId =
      this.context.extendedContext?.envId || process.env.CLOUDBASE_ENV_ID;

    !envId &&
      console.warn(
        "Missing envId, if running locally, please configure \`CLOUDBASE_ENV_ID\` environment variable."
      );

    const createDeepseek = () =>
      new ChatDeepSeek({
        streaming: true,
        model: "deepseek-v3-0324",
        apiKey: this.apiKey,
        configuration: {
          baseURL: `https://${envId}.api.tcloudbasegateway.com/v1/ai/deepseek/v1`,
        },
        callbacks: [llmCallback],
      });

    if (!this.mcpClient) {
      try {
        this.mcpClient = await this.getMCPClient();
      } catch (e) {
        console.error("getMCPClient error", e);
      }
    }

    // LLM
    const llm = createDeepseek();
    // 子Agent
    const faqAgent = createReactAgent({
      llm,
      tools: [retrieverTool],
      prompt:
        "你是云开发 FAQ 知识专家，善于用工具检索云开发 AI 相关知识，为团队提供权威解答。不要处理回答云开发 AI 知识之外的事情。",
      name: "faqAgent",
    });
    const searchAgent = createReactAgent({
      llm,
      tools: [searchTool],
      prompt:
        "你是互联网搜索专家，善于用工具联网搜索，为团队补充最新信息。不要处理进行互联网搜索之外的事情。",
      name: "searchAgent",
    });

    let generalAgentInfo = null;

    if (this.mcpClient) {
      generalAgentInfo = await createGeneralAgent(this.mcpClient, llm);
    }

    // Supervisor LLM
    const supervisorLLM = createDeepseek();
    // Supervisor prompt
    let supervisorPrompt =
      "你拥有一个强大的 Agent 团队。" +
      "对于云开发 AI 相关的问题，交给 faqAgent。" +
      "对于互联网搜索相关的问题，交给 searchAgent。";

    // 创建 Supervisor
    const agents = [faqAgent, searchAgent];
    if (generalAgentInfo) {
      supervisorPrompt +=
        "对于其他问题，交给 generalAgent。" +
        `generalAgent 的能力非常强大，这是 generalAgent 的描述
=== generalAgent 描述 start ===
${generalAgentInfo.description}
=== generalAgent 描述 end ===` +
        "如果某个专家表示无法完成任务，你也应该 fallback 给 generalAgent 处理。" +
        "如果你给出的最后答复不能解决用户的问题，你应该检查是否至少交给 generalAgent 处理过一次。如果 generalAgent 一次都没有处理过，你应该把问题交给 generalAgent 处理。";

      agents.push(generalAgentInfo.agent);
    }

    console.log(
      "agents",
      agents.map((x) => x.name)
    );
    const supervisor = createSupervisor({
      agents,
      llm: supervisorLLM,
      prompt: supervisorPrompt,
    }).compile();
    // 启动协作，无需流式
    const result = await supervisor.invoke({
      messages: [new HumanMessage(msg)],
    });

    // 用 finalMessages 作为 prompt，流式总结
    const streamingLLM = createDeepseek();
    const summaryStream = await streamingLLM.stream(result.messages);

    for await (const chunk of summaryStream) {
      console.log(
        "summary chunk",
        omit(chunk, [
          "response_metadata",
          "usage_metadata",
          "lc_kwargs",
          "additional_kwargs",
          "lc_namespace",
          "lc_serializable",
        ])
      );
      this.sseSender.send({
        data: {
          content: chunk.content as string,
          role: "assistant",
          type: "text",
          model: "deepseek-v3-0324",
          finish_reason: "",
        },
      });
    }

    this.sseSender.end();
  }

  // MCP 客户端
  async getMCPClient() {
    if (!process.env.MCP_SERVER_URL) {
      throw new Error("MCP_SERVER_URL is not set");
    }

    const transport = new PostClientTransport(
      new URL(process.env.MCP_SERVER_URL),
      {
        requestInit: {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      }
    );

    const proxiedTransport = new Proxy(transport, {
      set(target, prop, value) {
        if (prop === "onmessage") {
          target.onmessage = (message) => {
            if (
              (message as any)?.result?.toolResult &&
              !(message as any).result.structuredContent
            ) {
              (message as any).result.structuredContent = (
                message as any
              ).result.toolResult;
            }
            value(message);
          };
          return true;
        }
        return Reflect.set(target, prop, value);
      },
    });

    const client = new Client(
      {
        name: "langgraph-agent",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    await client.connect(proxiedTransport);
    return client;
  }

  // 从上下文中获取云开发 accessToken
  get apiKey() {
    const accessToken =
      this.context?.extendedContext?.accessToken ||
      process.env.CLOUDBASE_API_KEY;
    if (typeof accessToken !== "string") {
      throw new Error("Invalid accessToken");
    }

    return accessToken.replace("Bearer", "").trim();
  }
}
