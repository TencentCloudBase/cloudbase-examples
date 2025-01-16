import {
  IntegrationResponse,
  TcbEventFunction,
} from "@cloudbase/functions-typings";
import { createIntegrationResponse, parse } from "../utils";
import { GetChatRecordInput, GetChatRecordOutput } from "../type";
import { getChatRecordImpl } from "./impl";

export const getChatRecord: TcbEventFunction<
  GetChatRecordInput,
  Promise<GetChatRecordOutput | IntegrationResponse<{ message: string }>>
> = async function (event, context) {
  const parseRes = parse(context.httpContext);

  if (!parseRes) {
    return createIntegrationResponse(400, `Cannot parse from HTTP context`);
  }

  const { botId } = parseRes;

  return getChatRecordImpl({
    ...event,
    botId,
  });
};
