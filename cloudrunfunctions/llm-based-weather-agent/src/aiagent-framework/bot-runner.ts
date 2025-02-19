import { IBot } from "./type";

import { IntegrationResponse } from "@cloudbase/functions-typings";

export function createIntegrationResponse(
  statusCode: number,
  message: string
): IntegrationResponse<{ message: string }> {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      message,
    },
  };
}

export function parseApiName(url: string): string {
  const { pathname } = new URL(url);

  const [_, botId, apiName] = pathname.split("/");

  if (!(botId && apiName)) {
    return null;
  }

  return apiName;
}

export class BotRunner {
  private ROUTE_MAP = [
    { methodName: "send-message", httpMethod: "POST", target: "sendMessage" },
    {
      methodName: "recommend-questions",
      httpMethod: "POST",
      target: "recommendQuestions",
    },
    {
      methodName: "records",
      httpMethod: "GET",
      target: "getChatRecord",
    },
    {
      methodName: "feedback",
      httpMethod: "GET",
      target: "getFeedback",
    },
    {
      methodName: "feedback",
      httpMethod: "POST",
      target: "sendFeedback",
    },
  ];

  static async run(event, context, bot: IBot) {
    return new BotRunner(bot).run(event, context);
  }

  constructor(readonly bot: IBot) {}

  async run(event, context) {
    if (!context.httpContext) {
      return createIntegrationResponse(500, "Invalid HTTP context");
    }

    const apiName = parseApiName(context.httpContext.url);

    const item = this.ROUTE_MAP.find(
      (x) =>
        x.httpMethod === context.httpContext.httpMethod &&
        apiName === x.methodName
    );

    return item
      ? this.bot[item.target](event, context)
      : createIntegrationResponse(
          404,
          "Invalid path" +
            JSON.stringify({
              apiName,
              httpMethod: context.httpContext.httpMethod,
            })
        );
  }
}
