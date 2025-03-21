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

import { getCloudbaseAi } from "./cloudbase-ai";
const OpenAI = require("openai")

const WEATHERS = [
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

const getRandomWeather = (city: string) => {
  if (city === '北京') {
    return '晴空万里'
  }
  const index = Math.floor(Math.random() * WEATHERS.length);
  return WEATHERS[index];
};

export class MyBot extends BotCore implements IBot {
  async sendMessage({ msg, history }: SendMessageInput): Promise<void> {
    const client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: 'https://luke-agent-dev-7g1nc8tqc2ab76af.api.tcloudbasegateway.com/v1/ai/hunyuan-exp/v1',
    });
    console.log('*****msg****', msg);

    const tools = [{
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "返回某个城市的天气信息。调用示例：get_weather({city: '北京'})",
        "parameters": {
          "type": "object",
          "properties": {
            "city": {
              "type": "string",
              "description": "要查询的城市"
            }
          },
          "required": [
            "city"
          ],
          "additionalProperties": false
        },
        "strict": true
      }
    }]

    const messages: any = [
      { role: "user", content: msg }
    ]
    // 1. 将消息和工具定义发送给 AI
    const completion = await client.chat.completions.create({
      model: "hunyuan-turbo",
      messages,
      tools,
      temperature: 0.3,
      // stream: true,
    })

    console.log('completion', JSON.stringify(completion.choices[0].message));
    if (completion.choices[0].message.content) {
      // 回一次包给客户端
      this.sseSender.send({
        data: {
          content: `\n\n${completion.choices[0].message.content ?? ""}\n\n`,
          model: "hunyuan-turbo",
          finish_reason: "",
          role: 'assistant',
          type: 'text',
        },
      });
    }
    if (completion.choices[0].message.tool_calls) {
      const toolCall = completion.choices[0].message.tool_calls[0]
      console.log('toolCall', toolCall);
      const args = JSON.parse(toolCall.function.arguments)
      // 2. 开发者自定义获取天气结果逻辑
      let result = toolCall.function.name === 'get_weather' ? getRandomWeather(args.city) : ''
      console.log('result', result);

      // 3. 将结果合并到messags中
      messages.push(completion.choices[0].message)
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result.toString()
      });
    }

    // 将最终的消息数组发给AI进行总结
    const completion2 = await client.chat.completions.create({
      model: "hunyuan-turbo",
      messages,
      tools,
      store: true,
      stream: true
    });


    for await (const chunk of completion2) {
      console.log('chunk', JSON.stringify(chunk?.choices?.[0]));
      this.sseSender.send({
        data: {
          content: chunk?.choices?.[0]?.delta?.content ?? "",
          model: "hunyuan-turbo",
          finish_reason: chunk?.choices?.[0]?.finish_reason ?? "",
          role: 'assistant',
          type: 'text',
        },
      });
    }

    this.sseSender.end();
  }

  async getChatRecords(input: GetChatRecordInput): Promise<GetChatRecordOutput> {
    const ret: GetChatRecordOutput = {
      recordList: [],
      total: 0,
    };
    return ret;
  }

  async getRecommendQuestions(input: GetRecommendQuestionsInput): Promise<void> {
    const ai = await getCloudbaseAi(this.context.extendedContext?.envId!);

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
      this.sseSender.send({
        data: {
          content: chunk?.choices?.[0]?.delta?.content ?? "",
          model: "hunyuan-turbo",
          finish_reason: chunk?.choices?.[0]?.finish_reason ?? "",
        }
      });
    }
    this.sseSender.end();
  }

  async sendFeedback?(input: SendFeedbackInput): Promise<SendFeedbackOutput> {
    return { status: "success" };
  }

  async getFeedback?(input: GetFeedbackInput): Promise<GetFeedbackOutput> {
    const ret: GetFeedbackOutput = {
      feedbackList: [],
      total: 0,
    };

    return ret;
  }

  // 从上下文中获取云开发 accessToken
  get apiKey() {
    const accessToken = this.context?.extendedContext?.accessToken;
    if (typeof accessToken !== "string") {
      throw new Error("Invalid accessToken");
    }

    return accessToken.replace("Bearer", "").trim();
  }
}
