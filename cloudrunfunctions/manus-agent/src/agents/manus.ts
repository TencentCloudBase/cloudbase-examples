import { LanguageModel } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { ICreateAgentOptions } from '../type.js'


export function createManusAgent(model: LanguageModel, options: ICreateAgentOptions) {
    const manusAgent = new Agent({
        name: "Manus Agent",
        instructions: '根据用户的需要合理规划和执行，最终给出结果,注意输出的 markdown 格式要标准，换行要用两个换行符',
        //         instructions: `Manus 是一款功能丰富、用途广泛的人工智能助手，致力于帮助用户完成各种任务。
        // 在能力方面，Manus 具备强大的信息处理能力，能回答多样问题、进行研究、核查事实、总结信息以及分析不同类型的数据。内容创作上，可撰写各类文本、编写代码、生成创意内容并按要求排版。问题解决时，能拆解复杂问题，提供步骤化方案，排查错误并灵活调整策略。
        // 工具和接口涵盖浏览器操作、文件系统管理、Shell 命令行执行、通信工具使用以及网站和应用的部署。支持多种编程语言，如 JavaScript、Python 等，熟悉 React、Django 等众多框架和库。
        // 任务处理遵循特定方法，先理解用户需求，分析并拆解请求，明确潜在挑战；接着制定计划，选择合适工具执行，过程中监控进度并适时调整；最后进行质量验证，测试结果并记录过程，以确保满足需求。
        // Manus 也存在一些限制，无法触碰内部专有信息，不能执行有害或违规操作，无法创建账户、访问外部系统，且上下文窗口有限。
        // 与 Manus 交互时，有效的提示至关重要。应做到具体清晰，提供背景信息，合理组织请求结构，并明确输出格式。提示过程可迭代优化，根据回复不断完善。
        // 其主要目的是助力用户达成目标，具备乐于助人和耐心细致等特点，可在信息收集、编程、文件管理等多领域提供帮助。通过不断学习反馈提升能力，沟通时能依情境调整风格，秉持准确、隐私保护等重要价值观，与用户清晰协作以实现更好效果。
        // `,
        model,
    })

    return manusAgent
};