import OpenAI from "openai";
import {
  SendSSEData,
  SendSSEEnding,
  YuanQiAgentInput,
  GetRecommendQuestionsInput,
  GetRecommendQuestionsOutputChunk,
} from "../type";
import { YUAN_QI_API_KEY } from "../consts";

interface IGetRecommendQuestionsImpl extends GetRecommendQuestionsInput {
  sendSSEData: SendSSEData<GetRecommendQuestionsOutputChunk>;
  sendSSEEnding: SendSSEEnding;
  botId: string;
}
export async function getRecommendQuestionsImpl({
  botId,
  sendSSEData,
  sendSSEEnding,
}: IGetRecommendQuestionsImpl) {
  const yuanQiInput: YuanQiAgentInput = {
    assistant_id: botId,
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
