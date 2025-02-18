import { TcbEventFunction } from '@cloudbase/functions-typings'
import { MyBot } from './bot'
import { BotRunner } from './aiagent-framework/bot-runner'

export const main: TcbEventFunction<unknown> = function (event, context) {
  return BotRunner.run(event, context, new MyBot(context, context.extendedContext.envId))
}
