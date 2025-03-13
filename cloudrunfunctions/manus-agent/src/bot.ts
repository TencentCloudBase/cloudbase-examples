import {
  BotCore,
  IBot,
  SendMessageInput,
} from "@cloudbase/aiagent-framework";
import { createDualLangPoetAgent, createManusAgent, createPrimaryAgent } from "./agents/index.js"
import { createOpenAI } from "@ai-sdk/openai";
import { TCB_ENV_ID, TCB_ACCESS_TOKEN } from './const.js'
import { customFetch, normalizeToolCall } from './utils.js'
import { McpManager } from './mcp/mcp-manager.js'
import { getMcpByAgent } from './mcp/mcp-config.js'


export class MyBot extends BotCore implements IBot {
  async sendMessage({ msg }: SendMessageInput): Promise<void> {
    const historyMessages = (await this.getHistoryMessages({
      size: 10,
    }))
    const { updateBotRecord } = await this.createRecordPair({ userContent: msg })
    const config = {
      baseUrl: process.env.LLM_BASE_URL as string || `https://${TCB_ENV_ID || this.context.extendedContext.envId}.api.tcloudbasegateway.com/v1/ai/hunyuan-exp/v1`,
      apiKey: process.env.LLM_API_KEY as string || this.apiKey,
      modelName: process.env.LLM_MODEL_NAME as string || 'hunyuan-turbos-latest'
    }
    console.log('LLM_CONFIG', config)
    try {
      const openai = createOpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        fetch: customFetch
      })

      const agent = createPrimaryAgent(openai(config.modelName), {
        tcb: this.tcb
      })

      const mcpConfigs = await getMcpByAgent(agent.name, {
        userId: this.context.extendedContext.userId
      })

      const mcpManager = McpManager.getInstance(this.context.extendedContext?.userId || 'test-user', mcpConfigs)
      const toolsets = await mcpManager.getTools()

      console.log('TOOLSETS', toolsets)

      const res = await agent.stream([...historyMessages, {
        role: 'user',
        content: msg
      }], { toolsets })

      let dataPart
      let aiResHistory = []
      let content = ''
      let stepContent = ''
      for await (const part of res.fullStream) {
        console.log('FULL_STREAM', part.type, part)
        dataPart = null
        switch (part.type) {
          case "error":
            dataPart = {
              finish_reason: 'error',
              error: {
                "name": 'LLMError',
                "message": part.error
              }
            }
            aiResHistory.push(dataPart)
            break;
          case "step-start":
            stepContent = ''
            dataPart = null
            break;
          case "step-finish":
            if (part.finishReason === 'stop') {
              content = stepContent
            }

            aiResHistory.push({
              content: '\n' + stepContent,
              type: 'text',
              cat: 'step-finish'
            })
            break;
          case "text-delta":
            stepContent += part.textDelta
            dataPart = {
              content: part.textDelta.replace(/\n/g, '\n\n'),
              type: 'text'
            }
            break;
          case "tool-call":
            dataPart = { tool_call: normalizeToolCall(part), type: 'tool-call', content: '' }
            aiResHistory.push(dataPart)
            break;
          case 'reasoning':
            dataPart = { content: part.textDelta, type: 'reasoning' }
            aiResHistory.push(dataPart)
            break;
          case 'tool-result':
            console.info(`\n-> Tool result:\n`, part);
            dataPart = { ...part, content: '' }
            aiResHistory.push(dataPart)
            break;

          default:
            dataPart = null
            break;
        }


        if (dataPart) {
          console.log('SSE_SEND', JSON.stringify(dataPart))
          this.sseSender.send({ data: dataPart as any })
        }
      }

      console.log("LLM_END", content, aiResHistory)
      this.sseSender.end()
      await updateBotRecord({
        content,
        origin_msg: JSON.stringify({
          aiResHistory
        })
      })
    } catch (e) {
      console.log('SEND_MESSAGE_ERROR', e)
      if (this.sseSender.status === 'started') {
        this.sseSender.send((e as Error).message)
      } else if (this.sseSender.status === 'initial') {
        throw e
      }
    }
  }

  get apiKey() {
    const accessToken = this.context?.extendedContext?.accessToken || TCB_ACCESS_TOKEN
    if (typeof accessToken !== "string") {
      throw new Error("Invalid accessToken")
    }

    const apiKey = accessToken.replace("Bearer", "").trim()


    return TCB_ACCESS_TOKEN || apiKey
  }
}