import {
  BotCore,
  IBot,
  SendMessageInput,
  GetChatRecordInput,
  GetChatRecordOutput,
  GetRecommendQuestionsInput,
} from "@cloudbase/aiagent-framework";
import OpenAI from "openai";
import { fixMessages } from "./util";
import { YUAN_QI_AGENT_ID, YUAN_QI_API_KEY } from "./const";
import { createNewChat, updateReplyMsgContent } from "./record";
import { getChatRecordDataModel } from "./model";

const openai = new OpenAI({
  apiKey: YUAN_QI_API_KEY,
  baseURL: "https://yuanqi.tencent.com/openapi/v1/agent/",
  defaultHeaders: {
    "X-Source": "openapi",
  },
});

export class MyBot extends BotCore implements IBot {
  async sendMessage(
    x: SendMessageInput & {
      yuanQiMessages?: SendMessageInput["history"];
    },
  ): Promise<void> {
    let messages;
    const { msg, history, yuanQiMessages } = x;

    if (yuanQiMessages && yuanQiMessages.length !== 0) {
      messages = fixMessages(yuanQiMessages);
    } else {
      messages = fixMessages(history);
      if (messages.length === 0)
        messages = await this.getHistoryFromDataModel();

      if (
        messages.length !== 0 &&
        messages[messages.length - 1].role === "user"
      ) {
        messages.pop();
      }
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: msg,
          },
        ],
      });
    }

    console.log(messages);

    const replyRecordId = await createNewChat({
      userId: this.context.extendedContext?.userId ?? "",
      botId: this.botId,
      ctxId: this.context.ctxId,
      envId: this.context.extendedContext?.envId ?? "",
      messages,
    });

    const chatCompletion = await openai.chat.completions.create(
      { stream: true, messages: [], model: "" },
      {
        body: {
          assistant_id: YUAN_QI_AGENT_ID,
          messages,
          stream: true,
        },
      },
    );

    let replyContent = "";
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      replyContent += content;
      this.sseSender.send({
        data: {
          ...chunk,
          content,
        },
      });
    }

    this.sseSender.end();

    await updateReplyMsgContent(
      this.context.extendedContext?.envId ?? "",
      replyContent,
      replyRecordId,
    );
  }

  async getChatRecords({
    pageNumber,
    pageSize,
    sort,
  }: GetChatRecordInput): Promise<GetChatRecordOutput> {
    const recordDataModel = getChatRecordDataModel(
      this.context.extendedContext?.envId ?? "",
    );

    const res = await recordDataModel.list({
      filter: {
        where: {
          $and: [
            {
              conversation: {
                $eq: this.context.extendedContext?.userId ?? "",
              },
            },
            {
              bot_id: {
                $eq: this.botId,
              },
            },
          ],
        },
      },
      getCount: true,
      select: {
        $master: true,
      },
      orderBy: [
        {
          createdAt: sort as any,
        },
      ],
      pageSize,
      pageNumber,
    });

    const ret: GetChatRecordOutput = {
      recordList: res.data.records.map(
        (x) =>
          ({
            botId: x.bot_id,
            recordId: x.record_id,
            role: x.role,
            content: x.content,
            sender: x.sender,
            conversation: x.conversation,
            type: x.type,
            triggerSrc: x.trigger_src,
            originMsg: x.origin_msg,
            replyTo: x.reply_to,
            reply: x.reply,
            traceId: x.trace_id,
            needAsyncReply: x.sender,
            asyncReply: x.async_reply,
            createdAt: x.createdAt,
          }) as unknown as GetChatRecordOutput["recordList"][number],
      ),
      total: res.data.total!,
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

  async getHistoryFromDataModel(size = 20) {
    const res = await this.getChatRecords({
      pageSize: size,
      sort: "desc",
      pageNumber: 1,
    });

    const rawMessages = res.recordList.map((x) => ({
      role: x.role,
      content: x.content,
    }));

    return fixMessages(rawMessages);
  }
}
