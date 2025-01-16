import {
  IntegrationResponse,
  TcbEventFunction,
} from "@cloudbase/functions-typings";
import { createIntegrationResponse, parse } from "../utils";
import { GetFeedbackInput, GetFeedbackOutput } from "../type";
import { getFeedbackImpl } from "./impl";

export const getFeedback: TcbEventFunction<
  GetFeedbackInput,
  Promise<GetFeedbackOutput | IntegrationResponse<{ message: string }>>
> = async function (event, context) {
  const parseRes = parse(context.httpContext);

  if (!parseRes) {
    return createIntegrationResponse(400, `Cannot parse from HTTP context`);
  }

  const { botId } = parseRes;

  return getFeedbackImpl({
    ...event,
    botId,
  });
};
