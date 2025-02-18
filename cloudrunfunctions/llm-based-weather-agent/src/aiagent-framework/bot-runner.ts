import { IBot } from './type'

import { IntegrationResponse } from '@cloudbase/functions-typings'

export function createIntegrationResponse(
  statusCode: number,
  message: string
): IntegrationResponse<{ message: string }> {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      message,
    },
  }
}

export function parseApiName(url: string): string {
  const { pathname } = new URL(url);

  const [_, botId, apiName] = pathname.split('/')

  if (!(botId && apiName)) {
    return null;
  }

  return apiName;
}

export class BotRunner {
  static async run(event, context, bot: IBot) {
    return (new BotRunner(bot)).run(event, context)
  }

  constructor(readonly bot: IBot) {}

  async run(event, context) {
    if (!context.httpContext) {
      return createIntegrationResponse(500, 'Invalid HTTP context')
    }

    const apiName = parseApiName(context.httpContext.url)
    if (context.httpContext.httpMethod === 'POST' && apiName === 'send-message') {
      return this.sendMessageFunc(event, context)
    }

    return createIntegrationResponse(404, 'Invalid path')
  }

  private async sendMessageFunc (event, context) {
   const { msg, history = [] } = event
   if (typeof context.extendedContext?.envId !== 'string') {
     return createIntegrationResponse(400, 'invalid envId')
   }

   try {
     await this.bot.sendMessage({msg, history})
   } catch (e) {
     return createIntegrationResponse(
       400,
       `Send message to Agent failed, detail: ${e}`
     )
   }
   return ''
  }
}
