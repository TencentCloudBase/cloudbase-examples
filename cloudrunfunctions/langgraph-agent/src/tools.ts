import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TencentHunyuanEmbeddings } from "@langchain/community/embeddings/tencent_hunyuan";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TavilySearch } from "@langchain/tavily";
import { DynamicTool } from "langchain/tools";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";

const createRetriever = (() => {
  let retriever: VectorStoreRetriever | null = null;
  return async () => {
    if (retriever) return retriever;

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
    retriever = vectorStore.asRetriever();

    return retriever;
  };
})();

// FAQ RAG 工具
export const retrieverTool = new DynamicTool({
  name: "faq_rag",
  description: "在云开发AI FAQ 知识库中检索相关内容",
  func: async (input: string) => {
    const retriever = await createRetriever();
    return (await retriever.invoke(input)).map((d) => d.pageContent).join("\n");
  },
});

// 联网搜索工具
export const searchTool = new TavilySearch({ maxResults: 5, topic: "general" });
