const { IBot } = require("@cloudbase/aiagent-framework");

const ANSWER = "你好，我是一个智能体，但我只会说这一句话。";

/**
 * @typedef {import('@cloudbase/aiagent-framework').IAbstractBot} IAbstractBot
 *
 * @class
 * @implements {IAbstractBot}
 */

/**
 * 类型完整定义请参考：https://docs.cloudbase.net/cbrf/how-to-writing-functions-code#%E5%AE%8C%E6%95%B4%E7%A4%BA%E4%BE%8B
 * "{demo: string}"" 为 event 参数的示例类型声明，请根据实际情况进行修改
 * 需要 `pnpm install` 安装依赖后类型提示才会生效
 *
 * @type {import('@cloudbase/functions-typings').IAbstractBot}
 */
class MyBot extends IBot {
  async sendMessage() {
    return new Promise((res) => {
      // 创建个字符数组
      const charArr = ANSWER.split("");

      const interval = setInterval(() => {
        // 定时循环从数组中去一个字符
        const char = charArr.shift();

        if (typeof char === "string") {
          // 有字符时，发送 SSE 消息给客户端
          this.sseSender.send({ data: { content: char } });
        } else {
          // 字符用光后，结束定时循环
          clearInterval(interval);
          // 结束 SSE
          this.sseSender.end();
          res();
        }
      }, 50);
    });
  }
}

module.exports = {
  MyBot,
};
