import { GetChatRecordInput, GetChatRecordOutput } from "../type";

interface IGetChatRecordImpl extends GetChatRecordInput {
  botId: string;
}
export async function getChatRecordImpl({
  botId,
  pageNumber,
  pageSize,
  sort,
}: IGetChatRecordImpl): Promise<GetChatRecordOutput> {
  const ret: GetChatRecordOutput = {
    recordList: [],
    total: 0,
  };

  return ret;
}
