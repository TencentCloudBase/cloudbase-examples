import { BotRunner } from "@cloudbase/aiagent-framework";
import { TcbEventFunction } from "@cloudbase/functions-typings";
import { MyBot } from "./bot.js";
import { filterLog } from "./util.js";

filterLog();

export const main: TcbEventFunction<unknown> = function (event, context) {
  return BotRunner.run(event, context, new MyBot(context));
};
