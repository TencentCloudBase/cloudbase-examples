import { BotCore, IBot, SendMessageInput } from "@cloudbase/aiagent-framework";
import OpenAI from "openai";
import { LKE_APP_KEY, LKE_URL } from "./const";
import { LKEChunk } from "./reply";
import { randomUUID } from "crypto";

const openai = new OpenAI({
  apiKey: "xx", // LKE 不用这个
  baseURL: LKE_URL,
});

export class MyBot extends BotCore implements IBot {
  async sendMessage({ msg }: SendMessageInput): Promise<void> {
    if (!LKE_APP_KEY) {
      throw new Error("`LKE_APP_KEY` not found");
    }

    // 新建聊天记录，放到数据模型中
    const { updateBotRecord } = await this.createRecordPair({
      userContent: msg,
    });

    let userId = this.context.extendedContext?.userId;
    if (userId) {
      console.log("Using `extendedContext.userId` as `session_id`");
    } else {
      console.log("Using `randomUUID()` as `session_id`");
      userId = randomUUID();
    }

    // 调用 LKE 接口
    const chatCompletion = await openai.chat.completions.create(
      { stream: true, messages: [], model: "" },
      {
        body: {
          session_id: userId,
          bot_app_key: LKE_APP_KEY,
          content: msg,
          incremental: true,
          stream: "enable",
        },
        path: "",
      },
    );

    // 存放 Agent 回复内容的变量
    let replyContent = "";
    for await (const _chunk of chatCompletion) {
      const chunkWithData = _chunk as unknown as { data: LKEChunk };
      const chunk = chunkWithData.data;

      if (chunk.type === "reply") {
        const content = chunk?.payload?.content ?? "";
        // 累加到 replyContent 中
        replyContent += content;
        // 发送给客户端
        this.sseSender.send({
          data: {
            ...chunk?.payload,
            type: "text",
            content,
          },
        });
      }
      if (chunk.type === "thought") {
        const reasoning_content = chunk?.payload?.procedures
          ?.map((x) => x?.debugging?.content ?? "")
          .join("");
        this.sseSender.send({
          data: {
            ...chunk?.payload,
            type: "text",
            reasoning_content,
            content: "",
          },
        });
      }
    }

    // 消息传输结束
    this.sseSender.end();
    // 收集到完整的 Agent 消息后，更新数据模型中的消息记录
    await updateBotRecord({ content: replyContent });
  }
}
