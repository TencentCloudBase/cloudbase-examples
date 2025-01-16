import { HttpMethod, TcbEventFunction } from "@cloudbase/functions-typings";
import { createIntegrationResponse, parse } from "./utils";
import { sendMessage } from "./sendMessage";
import { getRecommendQuestions } from "./recommendQuestions";
import { getChatRecord } from "./getChatRecord";
import { getFeedback } from "./getFeedback";
import { sendFeedback } from "./sendFeedback";

const AGENT_ROUTES: Array<{
  methodName: string;
  httpMethod: HttpMethod;
  target: TcbEventFunction;
}> = [
  { methodName: "send-message", httpMethod: "POST", target: sendMessage },
  {
    methodName: "recommend-questions",
    httpMethod: "POST",
    target: getRecommendQuestions,
  },
  {
    methodName: "records",
    httpMethod: "GET",
    target: getChatRecord,
  },
  {
    methodName: "feedback",
    httpMethod: "GET",
    target: getFeedback,
  },
  {
    methodName: "feedback",
    httpMethod: "POST",
    target: sendFeedback,
  },
];

export const main: TcbEventFunction<unknown> = function (event, context) {
  if (!context.httpContext)
    return createIntegrationResponse(500, "Invalid HTTP context");

  const parseResult = parse(context.httpContext);
  if (!parseResult) return createIntegrationResponse(404, "Invalid path");

  const { httpMethod, methodName } = parseResult;
  const route = AGENT_ROUTES.find(
    (x) => x.methodName === methodName && x.httpMethod === httpMethod
  );

  if (route) {
    return route.target(event, context);
  } else {
    return createIntegrationResponse(404, "Invalid path");
  }
};
