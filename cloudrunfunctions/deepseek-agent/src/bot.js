const { BotCore } = require("@cloudbase/aiagent-framework");
const OpenAI = require("openai");

/**
 * @typedef {import('@cloudbase/aiagent-framework').IBot} IBot
 *
 * @class
 * @implements {IBot}
 */
class MyBot extends BotCore {
  get apiKey() {
    const accessToken = this.context?.extendedContext?.accessToken;
    if (typeof accessToken !== "string") {
      throw new Error("Invalid accessToken");
    }

    const apiKey = accessToken.replace("Bearer", "").trim();

    return apiKey;
  }

  async sendMessage({ msg }) {
    const client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: `https://${this.context.extendedContext.envId}.api.tcloudbasegateway.com/v1/ai/deepseek/v1`,
    });

    const stream = await client.chat.completions.create({
      model: "deepseek-r1",
      messages: [{ role: "user", content: msg }],
      stream: true,
    });

    for await (const chunk of stream) {
      this.sseSender.send({
        data: {
          ...chunk,
          content: chunk?.choices?.[0]?.delta?.content || "",
          reasoning_content:
            chunk?.choices?.[0]?.delta?.reasoning_content || "",
        },
      });
    }

    this.sseSender.end();
  }
}

module.exports = {
  MyBot,
};
