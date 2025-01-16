import { SendFeedbackOutput, SendFeedbackInput } from "../type";

interface ISendFeedbackImpl extends SendFeedbackInput {
  botId: string;
}
export async function sendFeedbackImpl({
  botId,
  type,
  aiAnswer,
  comment,
  input,
  rating,
  recordId,
  tags,
}: ISendFeedbackImpl): Promise<SendFeedbackOutput> {
  return { status: "success" };
}
