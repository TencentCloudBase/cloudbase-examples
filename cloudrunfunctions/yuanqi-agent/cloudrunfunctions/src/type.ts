/**
 * GET /:botId/send-message 接口入参
 */
export interface SendMessageInput {
  msg: string;
  history?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

/**
 * GET /:botId/send-message 接口返回的 SSE 事件的 data 类型
 */
export interface SendMessageOutputChunk {
  created?: number;
  record_id?: string;
  model?: string;
  version?: string;
  role?: string;
  content?: string;
  finish_reason?: string;
}

/**
 * POST /:botId/feedback 接口入参
 */
export interface SendFeedbackInput {
  recordId: string;
  type: string;
  comment: string;
  rating: number;
  tags: string[];
  input: string;
  aiAnswer: string;
}

/**
 * POST /:botId/feedback 接口出参
 */
export interface SendFeedbackOutput {
  status: "success";
}

/**
 * GET /:botId/feedback 接口入参
 */
export interface GetFeedbackInput {
  type: string;
  sender: string;
  senderFilter: string;
  minRating: number;
  maxRating: number;
  from: number;
  to: number;
  pageSize: number;
  pageNumber: number;
}

/**
 * GET /:botId/feedback 接口出参
 */
export interface GetFeedbackOutput {
  feedbackList: Array<{
    type: string;
    botId: string;
    sender: string;
    comment: string;
    rating: number;
    tags: string[];
    input: string;
    aiAnswer: string;
    createTime: string;
  }>;
  total: number;
}

/**
 * GET /:botId/records 接口入参
 */
export interface GetChatRecordInput {
  sort: string;
  pageSize: number;
  pageNumber: number;
}

/**
 * GET /:botId/records 接口出参
 */
export interface GetChatRecordOutput {
  recordList: Array<{
    botId: string;
    recordId: string;
    role: string;
    content: string;
    conversation: string;
    type: string;
    image: string;
    triggerSrc: string;
    replyTo: string;
    createTime: string;
  }>;
  total: number;
}

/**
 * GET /:botId/records 接口入参
 */
export interface GetRecommendQuestionsInput {
  name: string;
  introduction: string;
  agentSetting: string;
  msg: string;
  history: Array<{
    role: string;
    content: string;
  }>;
}

/**
 * GET /:botId/records 接口返回的 SSE 事件的 data 类型
 */
export interface GetRecommendQuestionsOutputChunk
  extends SendMessageOutputChunk {}

/** 发送 SSE 数据 */
export interface SendSSEData<T> {
  (data: T): void;
}

/** 发送表示着 SSE 结束的消息 */
export interface SendSSEEnding {
  (): void;
}

/**
 * 元器接口入参，参考 https://docs.qq.com/aio/p/scxmsn78nzsuj64?p=unUU8C3HBocfQSOGAh2BYuC
 */
export interface YuanQiAgentInput {
  assistant_id: string;
  user_id?: string;
  stream?: boolean;
  messages: Array<{
    role: "user" | "assistant";
    content: Array<{
      type?: string;
      text?: string;
      file_url?: { type?: string; url?: string };
    }>;
  }>;
}
