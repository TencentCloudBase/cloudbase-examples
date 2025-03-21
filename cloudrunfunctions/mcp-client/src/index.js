import { BotRunner } from '@cloudbase/aiagent-framework';
import { MyBot } from './bot.js';

/**
 * 类型完整定义请参考：https://docs.cloudbase.net/cbrf/how-to-writing-functions-code#%E5%AE%8C%E6%95%B4%E7%A4%BA%E4%BE%8B
 * "{demo: string}"" 为 event 参数的示例类型声明，请根据实际情况进行修改
 * 需要 `pnpm install` 安装依赖后类型提示才会生效
 *
 * @type {import('@cloudbase/functions-typings').TcbEventFunction<unknown>}
 */
export const main = function (event, context) {
  return BotRunner.run(event, context, new MyBot(context));
};
