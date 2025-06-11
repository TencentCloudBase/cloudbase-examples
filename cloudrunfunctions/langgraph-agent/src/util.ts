import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { LLMResult } from "@langchain/core/outputs";
import { StructuredTool } from "langchain/tools";
import { z, ZodTypeAny } from "zod";

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
export function mcpToolToStructuredTool(mcpTool: Tool, mcpClient: Client) {
  const zodSchema = jsonSchemaToZodSchema(mcpTool.inputSchema);
  return new (class extends StructuredTool {
    name = mcpTool.name;
    description = mcpTool.description || "";
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

export function filterLog() {
  const FILTER_MESSAGES = [
    "already exists in this message chunk",
    "Failed to calculate number of tokens, falling back to",
  ];

  const oldWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      FILTER_MESSAGES.some((shouldBeFiltered) =>
        args[0]?.includes(shouldBeFiltered)
      )
    ) {
      return;
    }
    return oldWarn(...args);
  };
}

// 自定义 Callback Handler 用于拦截 LLM 请求
class LLMInterceptorCallback extends BaseCallbackHandler {
  name = "LLMInterceptorCallback";
  logSeparator = () => console.log("==========");

  async handleLLMStart(llm: any, prompts: string[]) {
    this.logSeparator();
    console.log("🚀 LLM 请求开始:", llm);
    console.log("发送的 Prompts:", JSON.stringify(prompts, null, 2));
    this.logSeparator();
  }

  async handleLLMEnd(output: LLMResult) {
    this.logSeparator();
    console.log("✅ LLM 请求结束:");
    console.log("原始响应:", JSON.stringify(output, null, 2));
    this.logSeparator();
  }

  async handleLLMError(err: Error) {
    this.logSeparator();
    console.log("❌ LLM 请求错误:");
    console.log("错误:", err.message);
    this.logSeparator();
  }

  async handleText(text: string) {
    this.logSeparator();
    console.log("📝 处理文本:");
    console.log("文本内容:", text);
    this.logSeparator();
  }
}

export const llmCallback = new LLMInterceptorCallback();
