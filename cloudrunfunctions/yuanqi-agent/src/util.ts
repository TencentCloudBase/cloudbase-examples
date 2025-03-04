import { z } from "zod";

export const messageSchema = z.object({
  role: z.union([z.literal("user"), z.literal("assistant")]),
  content: z.string().nonempty(),
});

export const yuanQiTextContentSchema = z.object({
  type: z.literal("text"),
  text: z.string().nonempty(),
});

export const yuanQiFileContentSchema = z.object({
  type: z.literal("file_url"),
  file_url: z.object({
    type: z.string().nonempty(),
    url: z.string().nonempty(),
  }),
});

export const yuanQiMessageSchema = z.object({
  role: z.union([z.literal("user"), z.literal("assistant")]),
  content: z.array(z.union([yuanQiTextContentSchema, yuanQiFileContentSchema])),
});

type Message = z.infer<typeof messageSchema>;
export type YuanQiMessage = z.infer<typeof yuanQiMessageSchema>;

function messageToYuanQiMessage(message: Message): YuanQiMessage {
  return {
    role: message.role,
    content: [{ type: "text", text: message.content }],
  };
}

/**
 * 转换为元器的 message，并保证以 user 开头，并且 user 和 assistant 交替出现
 */
export function fixMessages(messages?: Array<unknown>) {
  if (!messages) {
    return [];
  }

  return messages
    .map(fixMessage)
    .filter((x) => x !== null)
    .reduce<Array<YuanQiMessage>>((acc, cur) => {
      const isUser = acc.length % 2 === 0;
      
      isUser && cur.role === "user" && acc.push(cur);
      !isUser && cur.role === "assistant" && acc.push(cur);

      return acc;
    }, []);
}

export function fixMessage(message: unknown): YuanQiMessage | null {
  try {
    return yuanQiMessageSchema.parse(message);
  } catch (e) {}

  try {
    return messageToYuanQiMessage(messageSchema.parse(message));
  } catch (e) {}

  return null;
}
