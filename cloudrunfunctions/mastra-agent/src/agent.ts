import { createOpenAI } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

/**
 * 散文 -> 诗歌 Agent
 */
function createProseToPoemAgent(envId: string) {
  const openai = createOpenAI({
    baseURL: `https://${envId}.api.tcloudbasegateway.com/v1/ai/hunyuan-exp/v1`,
  })

  const proseToPoemAgent = new Agent({
    name: 'Prose To Poem Agent',
    instructions: `
        你会散文翻译成符合古代诗歌风格的作品。请使用简洁、凝练的语言，遵循五言或七言绝句、律诗的格式，适当运用对仗、押韵等技巧，保留原文的意境和情感，同时融入古典诗歌的韵味。

        **示例输入：**​
        “清晨的阳光洒在湖面上，微风拂过，水波粼粼，几只白鹭掠过水面，留下一片宁静。”

        **示例输出：**​
        晨光映湖碧，
        微风起涟漪。
        白鹭掠波去，
        静水自成诗。

        **要求：**​

        保留原文的意境和情感。
        语言凝练，符合五言或七言诗的格式。
        适当运用对仗、押韵等古典诗歌技巧。
        确保译文具有古典诗歌的韵味。
  `,
    model: openai('hunyuan-turbo') as any,
  });

  return proseToPoemAgent
}

/**
 * 中文诗 -> 英文诗 Agent
 */
function createPoemTranslationAgent(envId: string) {
  const openai = createOpenAI({
    baseURL: `https://${envId}.api.tcloudbasegateway.com/v1/ai/hunyuan-exp/v1`,
  })

  const poemTranslationAgent = new Agent({
    name: 'Poem Translation Agent',
    instructions: `
      你会将中文古代诗歌翻译为英文。请保留原诗的意境、情感和韵律，尽量使用简洁、优美的语言，同时确保译文符合英文的表达习惯。可以适当调整句式，但需忠实于原诗的核心思想。

      **示例输入：**​
      “床前明月光，疑是地上霜。举头望明月，低头思故乡。”

      **示例输出：**​
      Before my bed, the moonlight gleams,
      Like frost upon the earth it seems.
      I raise my head to gaze at the moon,
      Then bow, and thoughts of home resume.
 
      **要求：**​
      保留原诗的意境和情感。
      语言简洁优美，符合英文表达习惯。
      尽量保留原诗的韵律或节奏感。
      确保译文忠实于原诗的核心思想。 
    `,
    model: openai('hunyuan-turbo') as any,
  });

  return poemTranslationAgent
}

/**
 * 内部调用 ProseToPoemAgent 的工具
 */
function createProseToPoemTool(envId: string) {
  const proseToPoemAgent = createProseToPoemAgent(envId)

  const tool = createTool({
    id: "Prose To Poem Tool",
    description: "将现代散文重写为诗歌的工具",
    inputSchema: z.object({
      prose: z.string().describe("将要被重写的散文输入"),
    }),
    outputSchema: z.object({
      poem: z.string().describe("重写后的诗歌"),
    }),
    execute: async ({ context }) => {
      const { text } = await proseToPoemAgent.generate(context.prose)
      return { poem: text }
    }
  })

  return tool
}

/**
 * 内部调用 PoemTranslationAgent 的工具
 */
function createPoemTranslationTool(envId: string) {
  const poemTranslationAgent = createPoemTranslationAgent(envId)

  const tool = createTool({
    id: "Poem Translation Tool",
    description: "将中文诗歌翻译为英文的工具",
    inputSchema: z.object({
      poem: z.string().describe("将要被翻译的中文诗歌输入"),
    }),
    outputSchema: z.object({
      translation: z.string().describe("翻译后的英文诗歌"),
    }),
    execute: async ({ context }) => {
      const { text } = await poemTranslationAgent.generate(context.poem)
      return { translation: text }
    }
  })

  return tool
}

/**
 * 双语诗歌创作 Agent
 */
export function createDualLangPoetAgent(envId: string) {
  const openai = createOpenAI({
    baseURL: `https://${envId}.api.tcloudbasegateway.com/v1/ai/hunyuan-exp/v1`,
  })

  const dualLangPoetAgent = new Agent({
    name: 'Dual Lang Poet Agent Weather',
    instructions: `
        你是一个只会写现代散文的作家，你对诗歌、翻译一窍不通，但是你的工作是根据用户写的主题来写双语诗歌。除了你自己的现代散文写作能力外，你可以借助其他工具来帮你完成工作。
        
        当主题不明确时，你可以跟用户确认主题。
        当主题明确时，尽管是一句简短的话，你也要开始工作，把这个主题写成现代散文，并按需使用工具完成剩余的工作。
        当用户的输入和你的工作无关时，不要回答他的问题，重复确认用户意图，并且介绍你的工作范围。

        你可以使用以下工具来完成你的工作：
        - proseToPoemTool: 使用这个工具来将散文重写为诗歌形式
        - poemTranslationTool: 使用这个工具来将中文诗歌翻译为英文诗歌
  `,
    model: openai('hunyuan-turbo') as any,
    tools: {
      proseToPoemTool: createProseToPoemTool(envId),
      poemTranslationTool: createPoemTranslationTool(envId)
    },
  });

  return dualLangPoetAgent
}
