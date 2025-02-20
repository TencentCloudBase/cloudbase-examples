const { IBot, IAbstractBot } = require("@cloudbase/aiagent-framework");

const { getCloudbaseAi } = require("./cloudbase-ai");

/**
 * @typedef {import('@cloudbase/aiagent-framework').IAbstractBot} IAbstractBot
 *
 * @class
 * @implements {IAbstractBot}
 */
class MyBot extends IBot {
  async sendMessage({ msg }) {
    const ai = await getCloudbaseAi(this.envId);

    const model = ai.createModel("deepseek");

    const res = await model.streamText({
      model: "deepseek-r1",
      messages: [
        {
          role: "user",
          content: msg,
        },
      ],
    });

    for await (const data of res.dataStream) {
      this.sseSender.send({
        data: {
          ...data,
          content: data?.choices?.[0]?.delta?.content || "",
          reasoning_content: data?.choices?.[0]?.delta?.reasoning_content || "",
        },
      });
    }

    this.sseSender.end();
  }
}

module.exports = {
  MyBot,
};
