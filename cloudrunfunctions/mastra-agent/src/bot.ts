import {
  BotCore,
  IBot,
  SendMessageInput,
} from "@cloudbase/aiagent-framework";
import { createDualLangPoetAgent } from "./agent.js"
import "dotenv/config"
import { createOpenAI } from "@ai-sdk/openai";

export class MyBot extends BotCore implements IBot {
  async sendMessage({ msg, history }: SendMessageInput): Promise<void> {
    const openai = createOpenAI({
      baseURL: `https://${this.context.extendedContext.envId}.api.tcloudbasegateway.com/v1/ai/hunyuan-exp/v1`,
      apiKey: this.apiKey,

    })

    const res = await createDualLangPoetAgent(openai("hunyuan-turbo") as any).stream(msg)


    for await (let x of res.textStream) {
      this.sseSender.send({ data: { content: x } })
    }

    this.sseSender.end()

  }

  get apiKey() {
    const accessToken = this.context?.extendedContext?.accessToken
    if (typeof accessToken !== "string") {
      throw new Error("Invalid accessToken")
    }

    const apiKey = accessToken.replace("Bearer", "").trim()

    return apiKey
  }
}