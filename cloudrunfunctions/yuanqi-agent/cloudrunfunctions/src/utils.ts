import {
  HttpBasis,
  HttpMethod,
  IntegrationResponse,
  sse,
} from "@cloudbase/functions-typings";
import { SendMessageOutputChunk } from "./type";

const SSE_ENDING_MESSAGE = "[DONE]";

export function sendData(
  sse: Readonly<sse.ISeverSentEvent>,
  data: SendMessageOutputChunk
) {
  sse.send({ data });
}

export function sendEnding(sse: Readonly<sse.ISeverSentEvent>) {
  sse.send({ data: SSE_ENDING_MESSAGE });
  (sse as any).end();
}

export function parse({ httpMethod, url }: HttpBasis): {
  botId: string;
  methodName: string;
  httpMethod: HttpMethod;
} | null {
  const { pathname } = new URL(url);

  const [_, botId, methodName] = pathname.split("/"); // expect pathname to be `/${botId}/${methodName}`

  if (!(botId && methodName)) {
    return null;
  }

  return {
    botId,
    httpMethod,
    methodName,
  };
}

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
