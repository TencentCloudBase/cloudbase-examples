const { BotCore } = require('@cloudbase/aiagent-framework');
const OpenAI = require('openai');

/**
 * @typedef {import('@cloudbase/aiagent-framework').IBot} IBot
 *
 * @class
 * @implements {IBot}
 */
class MyBot extends BotCore {
  /**
   * 获取 API 密钥
   * @returns {string} 处理后的 API 密钥
   * @throws {Error} 当 accessToken 无效时抛出错误
   */
  get apiKey() {
    const accessToken = this.context?.extendedContext?.accessToken;
    if (typeof accessToken !== 'string') {
      throw new Error('Invalid accessToken');
    }

    const apiKey = accessToken.replace('Bearer', '').trim();

    return apiKey;
  }

  /**
   * 发送消息到 Deepseek AI 并处理流式响应
   * @param {Object} params - 消息参数
   * @param {string} params.msg - 用户发送的消息内容
   */
  async sendMessage({ msg }) {
    const client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: `https://${this.context.extendedContext.envId}.api.tcloudbasegateway.com/v1/ai/deepseek/v1`,
    });
    // 创建流式聊天完成请求
    const stream = await client.chat.completions.create({
      model: 'deepseek-r1',
      messages: [{ role: 'user', content: msg }],
      stream: true,
    });
    // 处理流式响应数据
    for await (const chunk of stream) {
      this.sseSender.send({
        data: {
          ...chunk,
          content: chunk?.choices?.[0]?.delta?.content || '',
          reasoning_content:
            chunk?.choices?.[0]?.delta?.reasoning_content || '',
          role: 'assistant',
          type: 'text',
        },
      });
    }

    this.sseSender.end();
  }
}

module.exports = {
  MyBot,
};
