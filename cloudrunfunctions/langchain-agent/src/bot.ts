import { BotCore, IBot, SendMessageInput } from "@cloudbase/aiagent-framework";
import { DynamicTool } from "langchain/tools";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatDeepSeek } from "@langchain/deepseek";
import { TavilySearch } from "@langchain/tavily";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { TencentHunyuanEmbeddings } from "@langchain/community/embeddings/tencent_hunyuan";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

async function wrapResult<T>(
  fn: () => T
): Promise<
  { success: true; data: Awaited<T> } | { success: false; error: unknown }
> {
  try {
    const data = await Promise.resolve(fn());
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
}

async function logIfError<T>(fn: () => T, log: (error: unknown) => void) {
  const result = await wrapResult(fn);
  if (result.success) {
    return result.data;
  } else {
    log(result.error)
    throw result.error
  }
}

export class MyBot extends BotCore implements IBot {
  private tools: any[] = []
  private toolsByName: any = {}
  constructor(context: any) {
    super(context)
    // 初始化工具列表
    this.tools = []
    this.toolsByName = {}
  }

  async getSearchTool() {
    const searchTool = new TavilySearch({
      maxResults: 5,
      topic: "general",
    });
    return searchTool
  }

  async getRetrieverTool() {
    const embeddings = new TencentHunyuanEmbeddings();
    const loader = new CheerioWebBaseLoader(
      "https://docs.cloudbase.net/ai/FAQ"
    );
    const docs = await loader.load();
    console.log('docs', docs)
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });
    const documents = await splitter.splitDocuments(docs);
    console.log('documents', documents)
    const vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      embeddings
    );
    const retriever = vectorStore.asRetriever();

    const retrieverTool = new DynamicTool({
      name: "tcb_faq_rag",
      description: "在云开发AI FAQ 知识库中检索相关内容",
      func: async (input: string) => {
        const docs = await retriever.getRelevantDocuments(input);
        console.log('retrieve docs', docs)
        return docs.map(d => d.pageContent).join("\n");
      },
    });

    // const retrieverTool = tool(
    //   async ({ input }, config) => {
    //     const docs = await retriever.invoke(input, config);
    //     console.log("retrieverTool docs", docs)
    //     return docs.map((doc) => doc.pageContent).join("\n\n");
    //   },
    //   {
    //     name: "tcb_faq_rag",
    //     description:
    //       "查询云开发AI 相关的问题. 对任何询问云开发 AI 相关问题，必须使用该工具!",
    //     schema: z.object({
    //       input: z.string(),
    //     }),
    //   }
    // );
    return retrieverTool;
  }

  async sendMessage({ msg }: SendMessageInput): Promise<void> {
    const envId =
      this.context.extendedContext?.envId || process.env.CLOUDBASE_ENV_ID;

    !envId &&
      console.warn(
        "Missing envId, if running locally, please configure \`CLOUDBASE_ENV_ID\` environment variable."
      );

    // 初始化 LLM
    const llm  = await logIfError(
      () =>
        new ChatDeepSeek({
          streaming: false,
          model: "deepseek-v3-0324",
          apiKey: this.apiKey,
          configuration: {
            baseURL: `https://${envId}.api.tcloudbasegateway.com/v1/ai/deepseek/v1`,
          },
        }),
        (e) => console.error(`create deepseek failed`, e)
    ); 

    const streamingLLM  = await logIfError(
      () =>
        new ChatDeepSeek({
          streaming: true,
          model: "deepseek-v3-0324",
          apiKey: this.apiKey,
          configuration: {
            baseURL: `https://${envId}.api.tcloudbasegateway.com/v1/ai/deepseek/v1`,
          },
        }),
        (e) => console.error(`create streaming deepseek failed`, e)
    ); 

    let tools = this.tools
    if (tools.length === 0) {
      const searchTool = await logIfError(() => this.getSearchTool(), (e) => console.error(`create search tool failed`, e))
      const retrieverTool = await logIfError(() => this.getRetrieverTool(), (e) => console.error(`create retriever tool failed`, e))
      tools = [searchTool, retrieverTool]
      this.tools = tools
      this.toolsByName = {
        tavily_search: searchTool,
        tcb_faq_rag: retrieverTool,
      };
    }

    const llmWithTools = llm.bindTools(tools)

    // 构建工具列表
    const messages = [new SystemMessage("你是一个智能助手，遇到无法直接回答的问题时，可以调用联网搜索工具，或在云开发AI FAQ 知识库中检索相关内容"), new HumanMessage(msg)];

    const aiMessage = await logIfError(() => llmWithTools.invoke(messages), (e) => console.error(`invoke llm failed`, e, messages))
    console.log(aiMessage);
    messages.push(aiMessage);

    for (const toolCall of aiMessage.tool_calls as any) {
      const selectedTool = this.toolsByName[toolCall.name];
      const toolMessage = await logIfError(() => selectedTool.invoke(toolCall), (e) => console.error(`invoke tool failed`, e, toolCall))
      messages.push(toolMessage);
    }

    console.log('final messages', messages);

    // 生成最终答案
    const finalStream = await logIfError(() => streamingLLM.stream(messages), (e) => console.error(`stream llm failed`, e, messages))
    let fullResponse = "";

    for await (const chunk of finalStream) {
      fullResponse += chunk.content;
      console.log("chunk", chunk.content)
      this.sseSender.send({
        data: {
          content: chunk.content as string ?? "",
          role: 'assistant',
          type: 'text',
          model: "deepseek-v3-0324",
          finish_reason: "",
        },
      });
    }
    console.log('fullResponse', fullResponse);
    this.sseSender.end();
  }

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
