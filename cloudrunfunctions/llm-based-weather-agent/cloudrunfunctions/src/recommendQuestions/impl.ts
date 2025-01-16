import {
  SendSSEData,
  SendSSEEnding,
  GetRecommendQuestionsInput,
  GetRecommendQuestionsOutputChunk,
} from "../type";
import { getCloudbaseAi } from "../utils";

interface IGetRecommendQuestionsImpl extends GetRecommendQuestionsInput {
  sendSSEData: SendSSEData<GetRecommendQuestionsOutputChunk>;
  sendSSEEnding: SendSSEEnding;
  botId: string;
  envId: string;
}
export async function getRecommendQuestionsImpl({
  envId,
  botId,
  sendSSEData,
  sendSSEEnding,
}: IGetRecommendQuestionsImpl) {
  const ai = await getCloudbaseAi(envId);

  const model = ai.createModel("hunyuan-exp");
  const res = await model.streamText({
    model: "hunyuan-turbo",
    messages: [
      {
        role: "system",
        content:
          "你是一个可以处理询问天气的机器人。用户可能会问你有关天气的问题，你可以调用工具函数进行查询。",
      },
      {
        role: "user",
        content: "你会推荐我问你什么问题？举三个例子。",
      },
    ],
  });
  for await (const chunk of res.dataStream) {
    sendSSEData({
      content: chunk?.choices?.[0]?.delta?.content ?? "",
      model: "hunyuan-turbo",
      finish_reason: chunk?.choices?.[0]?.finish_reason ?? "",
    });
  }

  sendSSEEnding();
}
