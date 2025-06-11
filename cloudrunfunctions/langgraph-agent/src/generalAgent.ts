import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { mcpToolToStructuredTool } from "./util.js";
import { LanguageModelLike } from "@langchain/core/language_models/base";
import { StructuredTool } from "langchain/tools";

async function createAgentDescription(
  tools: StructuredTool[],
  llm: LanguageModelLike
): Promise<string> {
  const prompt = `我在用代码构建一个 Agent，需要一段对 Agent 的描述。我给这个 Agent 提供了一系列的工具，请你帮我据此生成一段对 Agent 的描述吧。你需要精准地告诉他他能做什么事，不要输出 Agent 描述之外的内容。你应该使用第二人称，把这个 Agent 当做你沟通的对象。工具列表如下： ${tools.map((x) => `工具名称：${x.name}，工具描述：${x.description}`).join("\n")}`;
  const res = await llm.invoke(prompt);

  let finalResult: string;

  // 从返回的消息对象中提取字符串内容
  if (typeof res === "string") {
    finalResult = res;
  } else if (res && typeof res.content === "string") {
    finalResult = res.content;
  } else if (res && Array.isArray(res.content)) {
    // 处理多模态内容的情况
    finalResult = res.content
      .map((item: any) => (typeof item === "string" ? item : item.text || ""))
      .join("");
  } else {
    console.warn("Unexpected LLM response format:", res);
    finalResult = String(res?.content || res || "");
  }

  // 调试：打印原始响应和最终结果
  console.log("prompt", prompt);
  console.log("LLM 原始响应:", JSON.stringify(res, null, 2));
  console.log("提取的最终描述:", finalResult);

  return finalResult;
}

export async function createGeneralAgent(
  mcpClient: Client,
  llm: LanguageModelLike
) {
  const { tools } = await mcpClient.listTools();
  console.log("mcp tools", JSON.stringify(tools, null, 2));
  const structuredTools = tools.map((tool) =>
    mcpToolToStructuredTool(tool, mcpClient!)
  );

  // 动态生成 Agent 描述
  const prompt = await createAgentDescription(structuredTools, llm);

  return {
    agent: createReactAgent({
      llm,
      tools: structuredTools,
      prompt,
      name: "generalAgent",
    }),
    description: prompt,
  };
}
