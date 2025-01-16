import {
  HttpBasis,
  HttpMethod,
  IntegrationResponse,
  sse,
} from "@cloudbase/functions-typings";
import { SendMessageOutputChunk } from "./type";
import _cloudbase = require("@cloudbase/js-sdk");
import _adapter = require("@cloudbase/adapter-node");

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

export async function getCloudbaseAi(envId: string) {
  const cloudbase =
    _cloudbase as unknown as typeof import("@cloudbase/js-sdk").default;
  const adapter =
    _adapter as unknown as typeof import("@cloudbase/adapter-node").default;

  let ai: import("@cloudbase/js-sdk/ai").AI;
  if (!ai) {
    const { sessionStorage } = adapter.genAdapter();
    cloudbase.useAdapters(adapter);

    const app = cloudbase.init({
      env: envId,
    });

    /**
     * auth 初始化的时候要传入storage 和 captchaOptions.openURIWithCallback
     * 否则会用默认的，依赖于平台，在 nodejs 环境报错
     */
    const auth = app.auth({
      storage: sessionStorage,
      captchaOptions: {
        openURIWithCallback: (...props: any) =>
          console.log("open uri with callback", ...props),
      },
    } as any);

    await auth.signInAnonymously();

    ai = await (app as any).ai();
  }

  return ai;
}
