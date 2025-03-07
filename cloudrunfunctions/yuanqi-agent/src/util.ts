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

export function messageToYuanQiMessage(message: Message): YuanQiMessage {
  return {
    role: message.role,
    content: [{ type: "text", text: message.content }],
  };
}
