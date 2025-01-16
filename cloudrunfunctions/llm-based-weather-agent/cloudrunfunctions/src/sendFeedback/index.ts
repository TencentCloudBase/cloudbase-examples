import {
  IntegrationResponse,
  TcbEventFunction,
} from "@cloudbase/functions-typings";
import { createIntegrationResponse, parse } from "../utils";
import { SendFeedbackInput, SendFeedbackOutput } from "../type";
import { sendFeedbackImpl } from "./impl";

export const sendFeedback: TcbEventFunction<
  SendFeedbackInput,
  Promise<SendFeedbackOutput | IntegrationResponse<{ message: string }>>
> = async function (event, context) {
  const parseRes = parse(context.httpContext);

  if (!parseRes) {
    return createIntegrationResponse(400, `Cannot parse from HTTP context`);
  }

  const { botId } = parseRes;

  return sendFeedbackImpl({
    ...event,
    botId,
  });
};
