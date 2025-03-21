import {
  BotCore,
  IBot,
  SendMessageInput,
  GetRecommendQuestionsInput,
} from "@cloudbase/aiagent-framework";
import OpenAI from "openai";
import { messageToYuanQiMessage } from "./util";
import {
  YUAN_QI_AGENT_ID,
  YUAN_QI_API_KEY,
  YUAN_QI_HOST,
  YUAN_QI_VERSION,
} from "./const";

const addVersion = (x: object) => {
  if (typeof YUAN_QI_VERSION === "string" && YUAN_QI_VERSION) {
    try {
      const version = parseInt(YUAN_QI_VERSION);
      return Object.assign(x, { version });
    } catch (e) {
      return x;
    }
  }

  return x;
};

const getOpenai = (() => {
  console.log("Using Host: ", YUAN_QI_HOST);
  let openai: OpenAI;
  return () => {
    if (!openai) {
      openai = new OpenAI({
        apiKey: YUAN_QI_API_KEY,
        baseURL: YUAN_QI_HOST,
        defaultHeaders: {
          "X-Source": "openapi",
        },
      });
    }
    return openai;
  };
})();

export class MyBot extends BotCore implements IBot {
  async sendMessage({ msg }: SendMessageInput): Promise<void> {
    // 获取历史消息
    const messages = await this.getHistory();

    // 添加本次请求用户消息
    messages.push({
      role: "user",
      content: [{ type: "text", text: msg }],
    });

    // 新建聊天记录，放到数据模型中
    const { updateBotRecord } = await this.createRecordPair({
      userContent: msg,
    });

    // 调用元器接口
    const chatCompletion = await getOpenai().chat.completions.create(
      { stream: true, messages: [], model: "" },
      {
        body: addVersion({
          assistant_id: YUAN_QI_AGENT_ID,
          messages,
          stream: true,
        }),
      },
    );

    // 存放 Agent 回复内容的变量
    let replyContent = "";
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      // 累加到 replyContent 中
      replyContent += content;
      // 发送给客户端
      this.sseSender.send({
        data: {
          ...chunk,
          content,
          role: 'assistant',
          type: 'text',
        },
      });
    }

    // 消息传输结束
    this.sseSender.end();
    // 收集到完整的 Agent 消息后，更新数据模型中的消息记录
    await updateBotRecord({ content: replyContent });
  }

  async getRecommendQuestions(
    input: GetRecommendQuestionsInput,
  ): Promise<void> {
    const yuanQiInput = {
      assistant_id: this.botTag,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "你会推荐我问你什么问题？给出三个例子。",
            },
          ],
        },
      ],
      stream: true,
    };

    const client = getOpenai();

    const chatCompletion = await client.chat.completions.create(
      { stream: true, messages: [], model: "" },
      {
        body: addVersion(yuanQiInput),
      },
    );
    for await (const chunk of chatCompletion) {
      this.sseSender.send({
        data: {
          ...chunk,
          content: chunk.choices[0]?.delta?.content || "",
          role: 'assistant',
          type: 'text',
        },
      });
    }

    this.sseSender.end();
  }

  async getHistory() {
    const messages = await this.getHistoryMessages();
    return messages.map(messageToYuanQiMessage);
  }
}
