const { IBot } = require("@cloudbase/aiagent-framework");

const ANSWER = "你好，我是一个智能体，但我只会说这一句话。";

/**
 * @typedef {import('@cloudbase/aiagent-framework').IAbstractBot} IAbstractBot
 *
 * @class
 * @implements {IAbstractBot}
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
