import {
  BotCore,
  IBot,
  SendMessageInput,
} from "@cloudbase/aiagent-framework";
import { createWeatherAgent } from "./mastra/agents/index.js"
import "dotenv/config"

export class MyBot extends BotCore implements IBot {
  async sendMessage({ msg, history }: SendMessageInput): Promise<void> {
    const res = await createWeatherAgent(this.envId).stream(msg)

    for await (let x of res.textStream) {
      this.sseSender.send({ data: { content: x } })
    }

    this.sseSender.end()

  }
}