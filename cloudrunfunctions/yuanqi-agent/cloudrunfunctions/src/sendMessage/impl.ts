import OpenAI from "openai";
import {
  SendSSEData,
  SendSSEEnding,
  SendMessageInput,
  YuanQiAgentInput,
  SendMessageOutputChunk,
} from "../type";
import { YUAN_QI_API_KEY } from "../consts";

interface ISendMessageImpl extends SendMessageInput {
  sendSSEData: SendSSEData<SendMessageOutputChunk>;
  sendSSEEnding: SendSSEEnding;
  botId: string;
}
export async function sendMessageImpl({
  botId,
  msg,
  history,
  sendSSEData,
  sendSSEEnding,
}: ISendMessageImpl) {
  const yuanQiInput: YuanQiAgentInput = {
    assistant_id: botId,
    messages: [
      ...(history?.map((x) => ({
        role: x.role,
        content: [{ type: "text", text: x.content }],
      })) ?? []),
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
    apiKey: YUAN_QI_API_KEY,
    baseURL: "https://yuanqi.tencent.com/openapi/v1/agent/",
    defaultHeaders: {
      "X-Source": "openapi",
    },
  });

  const chatCompletion = await client.chat.completions.create(
    { stream: true, messages: [], model: "" },
    {
      body: yuanQiInput,
    }
  );
  for await (const chunk of chatCompletion) {
    sendSSEData({
      role: chunk.choices[0].delta?.role,
      content: chunk.choices[0]?.delta?.content || "",
      finish_reason: chunk.choices[0]?.finish_reason,
      created: chunk.created,
      model: chunk.model,
    });
  }

  sendSSEEnding();
}
