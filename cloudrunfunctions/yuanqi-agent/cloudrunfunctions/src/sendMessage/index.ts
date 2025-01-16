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
import { SendMessageInput } from "../type";
import { sendMessageImpl } from "./impl";

export const sendMessage: TcbEventFunction<
  SendMessageInput,
  Promise<string | IntegrationResponse<{ message: string }>>
> = async function (event, context) {
  const { msg, history } = event;
  const parseRes = parse(context.httpContext);

  if (!parseRes) {
    return createIntegrationResponse(400, `Cannot parse from HTTP context`);
  }

  const { botId } = parseRes;

  const sse = context.sse?.();

  if (sse && !sse.closed) {
    sse.on("close", () => {});

    try {
      await sendMessageImpl({
        botId,
        msg,
        history,
        sendSSEData: (data) => sse && !sse.closed && sendData(sse, data),
        sendSSEEnding: () => sse && !sse.closed && sendEnding(sse),
      });
    } catch (e) {
      return createIntegrationResponse(
        400,
        `Send message to Agent failed, detail: ${e}`
      );
    }
  }
  return "";
};
