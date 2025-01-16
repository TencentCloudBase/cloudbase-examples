import { GetFeedbackInput, GetFeedbackOutput } from "../type";

interface IGetFeedbackImpl extends GetFeedbackInput {
  botId: string;
}
export async function getFeedbackImpl({
  botId,
  from,
  maxRating,
  minRating,
  pageNumber,
  pageSize,
  sender,
  senderFilter,
  to,
  type,
}: IGetFeedbackImpl): Promise<GetFeedbackOutput> {
  const ret: GetFeedbackOutput = {
    feedbackList: [],
    total: 0,
  };

  return ret;
}
