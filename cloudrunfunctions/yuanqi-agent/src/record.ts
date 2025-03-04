import * as crypto from "crypto";
import { YuanQiMessage } from "./util";
import * as cloudbase from "@cloudbase/node-sdk";
import { getChatRecordDataModel } from "./model";

const BOT_TYPE = "text";
const TRIGGER_SRC = "TCB";

interface ChatHistory {
  /** 异步回复内容（富文本） */
  async_reply?: string;
  /** 是否异步回复 */
  need_async_reply?: boolean;
  /** 请求 id */
  trace_id?: string;
  /** 回复的消息id */
  reply?: string;
  /** 被回复的消息id */
  reply_to?: string;
  /** 原始消息内容（多行文本） */
  origin_msg?: string;
  /** 来源 */
  trigger_src?: string;
  /** 会话 */
  conversation?: string;
  /** 发送者 */
  sender?: string;
  /** 推荐问题 */
  recommend_questions?: string[];
  /** 图片地址 */
  image?: string;
  /** 内容（富文本） */
  content?: string;
  /** 消息类型 */
  type?: string;
  /** 角色 */
  role?: string;
  /** 对话记录ID（唯一） */
  record_id?: string;
  /** 智能体ID */
  bot_id?: string;
}

interface ICreateNewChat {
  userId: string;
  botId: string;
  ctxId: string;
  envId: string;
  messages: Array<YuanQiMessage>;
}
export async function createNewChat(props: ICreateNewChat) {
  const { envId, ...rest } = props;
  const app = cloudbase.init({ env: envId });
  const models = app.models;

  const { msgData, replyMsgData } = createRecords(rest);

  const res = await getChatRecordDataModel(envId).createMany({
    data: [msgData, replyMsgData],
  });
  console.log("Save chat records successfully!", res);

  return replyMsgData.record_id!;
}

function createRecords({
  userId,
  botId,
  ctxId,
  messages,
}: Omit<ICreateNewChat, "envId">) {
  const recordId = genRecordId();
  const replyRecordId = genRecordId();

  const msgData: ChatHistory = {
    role: "user",
    record_id: recordId,
    sender: userId,
    type: BOT_TYPE,
    content:
      messages[messages.length - 1].content.find((x) => x.type === "text")
        ?.text ?? "",
    origin_msg: JSON.stringify(messages),
    trigger_src: TRIGGER_SRC,
    bot_id: botId,
    recommend_questions: [],
    conversation: userId,
    reply: replyRecordId,
    trace_id: ctxId,
    async_reply: "",
    image: "",
  };

  const replyMsgData: ChatHistory = {
    role: "assistant",
    record_id: replyRecordId,
    sender: userId,
    type: BOT_TYPE,
    content: "",
    origin_msg: JSON.stringify({}),
    trigger_src: TRIGGER_SRC,
    bot_id: botId,
    conversation: userId,
    trace_id: ctxId,
    async_reply: "",
    recommend_questions: [],
    image: "",
    need_async_reply: false,
  };

  return {
    msgData,
    replyMsgData,
  };
}

export async function updateReplyMsgContent(
  envId: string,
  content: string,
  recordId: string,
) {
  const app = cloudbase.init({ env: envId });
  const models = app.models;

  const res = await getChatRecordDataModel(envId).update({
    data: {
      content,
    },
    filter: {
      where: {
        record_id: {
          $eq: recordId,
        },
      },
    },
  });
  console.log("Update chat records successfully!", res);
}

export function genRecordId() {
  return "record-" + genRandomStr(8);
}

/**
 * 生成随机字符串
 */
export function genRandomStr(length: number): string {
  // 生成随机的字节数组
  const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
  // 将字节数组转换为十六进制字符串
  const hexString = randomBytes.toString("hex").slice(0, length);
  return hexString;
}
