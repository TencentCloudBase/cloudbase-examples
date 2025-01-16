import {
  IntegrationResponse,
  TcbEventFunction,
} from "@cloudbase/functions-typings";
import {
  createIntegrationResponse,
  parse,
  sendData,
  sendEnding,
} from "../utils";
import { GetRecommendQuestionsInput } from "../type";
import { getRecommendQuestionsImpl } from "./impl";

export const getRecommendQuestions: TcbEventFunction<
  GetRecommendQuestionsInput,
  Promise<string | IntegrationResponse<{ message: string }>>
> = async function (event, context) {
  const parseRes = parse(context.httpContext);

  if (!parseRes) {
    return createIntegrationResponse(400, `Cannot parse from HTTP context`);
  }

  const { botId } = parseRes;

  const sse = context.sse?.();

  if (sse && !sse.closed) {
    sse.on("close", () => {});

    try {
      await getRecommendQuestionsImpl({
        ...event,
        botId,
        sendSSEData: (data) => sse && !sse.closed && sendData(sse, data),
        sendSSEEnding: () => sse && !sse.closed && sendEnding(sse),
      });
    } catch (e) {
      return createIntegrationResponse(
        400,
        `Get recommend questions from agent failed, detail: ${e}`
      );
    }
  }
  return "";
};
