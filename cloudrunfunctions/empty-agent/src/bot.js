const { BotCore } = require("@cloudbase/aiagent-framework");

const ANSWER = "你好，我是一个智能体，但我只会说这一句话。";

function sleep(timeout) {
  return new Promise((res) => setTimeout(res, timeout));
}

/**
 * @typedef {import('@cloudbase/aiagent-framework').IBot} IBot
 *
 * @class
 * @implements {IBot}
 */
class MyBot extends BotCore {
  async sendMessage() {
    for (let i = 0; i < ANSWER.length; i++) {
      await sleep(50);
      this.sseSender.send({ data: { content: ANSWER[i] } });
    }
  }
}

module.exports = {
  MyBot,
};
