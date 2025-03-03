import {
  BotCore,
  IBot,
  SendMessageInput,
  GetChatRecordInput,
  GetChatRecordOutput,
  GetRecommendQuestionsInput,
  SendFeedbackInput,
  SendFeedbackOutput,
  GetFeedbackInput,
  GetFeedbackOutput,
} from "@cloudbase/aiagent-framework";
import OpenAI from "openai";

export class MyBot extends BotCore implements IBot {
  async sendMessage({ msg, history }: SendMessageInput): Promise<void> {
    const yuanQiInput = {
      assistant_id: this.botTag,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: msg,
            },
          ],
        },
      ],
      stream: true,
    };

    const client = new OpenAI({
      apiKey: process.env.YUAN_QI_API_KEY,
      baseURL: "https://yuanqi.tencent.com/openapi/v1/agent/",
      defaultHeaders: {
        "X-Source": "openapi",
      },
    });

    const chatCompletion = await client.chat.completions.create(
      { stream: true, messages: [], model: "" },
      {
        body: yuanQiInput,
        path: "v1/aibot/bots/:bot_id/send-message",
      },
    );
    for await (const chunk of chatCompletion) {
      this.sseSender.send({
        data: {
          ...chunk,
          content: chunk.choices[0]?.delta?.content || "",
        },
      });
    }

    this.sseSender.end();
  }

  async getChatRecords(
    input: GetChatRecordInput,
  ): Promise<GetChatRecordOutput> {
    const ret: GetChatRecordOutput = {
      recordList: [],
      total: 0,
    };
    return ret;
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

    const client = new OpenAI({
      apiKey: process.env.YUAN_QI_API_KEY,
      baseURL: "https://yuanqi.tencent.com/openapi/v1/agent/",
      defaultHeaders: {
        "X-Source": "openapi",
      },
    });

    const chatCompletion = await client.chat.completions.create(
      { stream: true, messages: [], model: "" },
      {
        body: yuanQiInput,
      },
    );
    for await (const chunk of chatCompletion) {
      this.sseSender.send({
        data: {
          ...chunk,
          content: chunk.choices[0]?.delta?.content || "",
        },
      });
    }

    this.sseSender.end();
  }

  async sendFeedback(input: SendFeedbackInput): Promise<SendFeedbackOutput> {
    return { status: "success" };
  }

  async getFeedback(input: GetFeedbackInput): Promise<GetFeedbackOutput> {
    const ret: GetFeedbackOutput = {
      feedbackList: [],
      total: 0,
    };

    return ret;
  }
}
