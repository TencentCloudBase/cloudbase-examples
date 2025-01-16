import {
  SendSSEData,
  SendSSEEnding,
  SendMessageInput,
  SendMessageOutputChunk,
} from "../type";
import { getCloudbaseAi } from "../utils";

const WEATHERS = [
  "晴空万里",
  "乌云密布",
  "狂风暴雨",
  "风和日丽",
  "电闪雷鸣",
  "细雨绵绵",
  "烈日炎炎",
  "雪花飘飘",
  "寒风凛冽",
  "云淡风轻",
];

const getRandomWeather = () => {
  const index = Math.floor(Math.random() * WEATHERS.length);
  return WEATHERS[index];
};

interface ISendMessageImpl extends SendMessageInput {
  sendSSEData: SendSSEData<SendMessageOutputChunk>;
  sendSSEEnding: SendSSEEnding;
  botId: string;
  envId: string;
}
export async function sendMessageImpl({
  envId,
  botId,
  msg,
  history,
  sendSSEData,
  sendSSEEnding,
}: ISendMessageImpl) {
  const ai = await getCloudbaseAi(envId);

  // 1. 定义获取天气的工具，详见 FunctionTool 类型
  const getWeatherTool = {
    name: "get_weather",
    description:
      "返回某个城市的天气信息。调用示例：get_weather({city: '北京'})",
    fn: ({ city }) => `${city}的天气是：${getRandomWeather()}！！！`, // 在这定义工具执行的内容
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "要查询的城市",
        },
      },
      required: ["city"],
    },
  };

  // 2. 注册我们刚定义好的工具
  ai.registerFunctionTool(getWeatherTool);

  const model = ai.createModel("hunyuan-exp");

  const res = await model.streamText({
    model: "hunyuan-turbo",
    messages: [
      {
        role: "system",
        content:
          "你是一个可以处理询问天气的机器人。用户可能会问你有关天气的问题，你可以调用工具函数进行查询。",
      },
      ...((history as any) ?? []),
      {
        role: "user",
        content: msg,
      },
    ],
    tools: [getWeatherTool],
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
