import { IntegrationResponse, TcbEventFunction, TcbExtendedContext, ContextInjected, HttpMethod, HttpBasis } from '@cloudbase/functions-typings'

export type ISendMessageFunc = TcbEventFunction<SendMessageInput, Promise<string | IntegrationResponse<{ message: string }>>>

export abstract class IbotFuncs {
  abstract sendMessageFunc: ISendMessageFunc
}

function parseBotId({ url }: HttpBasis): string {
  const { pathname } = new URL(url)

  const [_, botId, methodName] = pathname.split('/') // expect pathname to be `/${botId}/${methodName}`

  if (!(botId && methodName)) {
    return ''
  }

  return botId
}

export abstract class IBot {
  readonly botId: string
  readonly sseSender: SSESender
  constructor(readonly context: ContextInjected<TcbExtendedContext>, readonly envId: string) {

    const botId = parseBotId(context.httpContext)
    if (botId === '') {
      throw new Error('Invalid botId')
    }
    this.botId = botId
    this.sseSender = new SSESender(context)
  }

  abstract sendMessage(input: SendMessageInput): Promise<void>
  abstract getChatRecord?(input: GetChatRecordInput): Promise<GetChatRecordOutput>
  // abstract recommendQuestions?(input: GetRecommendQuestionsInput): Promise<GetRecommendQuestionsOutputChunk>
  abstract recommendQuestions?(input: GetRecommendQuestionsInput): Promise<void>

  abstract sendFeedback?(input: SendFeedbackInput): Promise<SendFeedbackOutput>
  abstract getFeedback?(input: GetFeedbackInput): Promise<GetFeedbackOutput>
}

export class SSESender {
  constructor(readonly context: ContextInjected<TcbExtendedContext>) { }

  send(data: any) {
    this.context.sse?.().send({data})
  }
  end() { 
    this.context.sse?.().end({ data: '[DONE]' })
  }
}

/**
 * GET /:botId/send-message 接口入参
 */
export interface SendMessageInput {
  msg: string
  history?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

/**
 * GET /:botId/send-message 接口返回的 SSE 事件的 data 类型
 */
export interface SendMessageOutputChunk {
  created?: number
  record_id?: string
  model?: string
  version?: string
  role?: string
  content?: string
  finish_reason?: string
}

/**
 * POST /:botId/feedback 接口入参
 */
export interface SendFeedbackInput {
  recordId: string
  type: string
  comment: string
  rating: number
  tags: string[]
  input: string
  aiAnswer: string
}

/**
 * POST /:botId/feedback 接口出参
 */
export interface SendFeedbackOutput {
  status: 'success'
}

/**
 * GET /:botId/feedback 接口入参
 */
export interface GetFeedbackInput {
  type: string
  sender: string
  senderFilter: string
  minRating: number
  maxRating: number
  from: number
  to: number
  pageSize: number
  pageNumber: number
}

/**
 * GET /:botId/feedback 接口出参
 */
export interface GetFeedbackOutput {
  feedbackList: Array<{
    type: string
    botId: string
    sender: string
    comment: string
    rating: number
    tags: string[]
    input: string
    aiAnswer: string
    createTime: string
  }>
  total: number
}

/**
 * GET /:botId/records 接口入参
 */
export interface GetChatRecordInput {
  sort: string
  pageSize: number
  pageNumber: number
}

/**
 * GET /:botId/records 接口出参
 */
export interface GetChatRecordOutput {
  recordList: Array<{
    botId: string
    recordId: string
    role: string
    content: string
    conversation: string
    type: string
    image: string
    triggerSrc: string
    replyTo: string
    createTime: string
  }>
  total: number
}

/**
 * GET /:botId/records 接口入参
 */
export interface GetRecommendQuestionsInput {
  name: string
  introduction: string
  agentSetting: string
  msg: string
  history: Array<{
    role: string
    content: string
  }>
}

/**
 * GET /:botId/records 接口返回的 SSE 事件的 data 类型
 */
export interface GetRecommendQuestionsOutputChunk
  extends SendMessageOutputChunk {}

/** 发送 SSE 数据 */
export interface SendSSEData<T> {
  (data: T): void
}

/** 发送表示着 SSE 结束的消息 */
export interface SendSSEEnding {
  (): void
}
