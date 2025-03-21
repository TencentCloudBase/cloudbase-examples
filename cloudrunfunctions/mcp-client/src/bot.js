import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { PostClientTransport } from '@cloudbase/mcp';
import { BotCore } from '@cloudbase/aiagent-framework';
import OpenAI from 'openai';

/**
 * @typedef {import('@cloudbase/aiagent-framework').IBot} IBot
 *
 * @class
 * @implements {IBot}
 */
export class MyBot extends BotCore {
  get apiKey() {
    const accessToken = this.context?.extendedContext?.accessToken;
    if (typeof accessToken !== 'string') {
      throw new Error('Invalid accessToken');
    }

    const apiKey = accessToken.replace('Bearer', '').trim();

    return apiKey;
  }

  async sendMessage({ msg }) {
    try {
      console.log('msg****', msg);
      const aiClient = new OpenAI({
        apiKey: this.apiKey,
        baseURL: `https://${this.context.extendedContext.envId}.api.tcloudbasegateway.com/v1/ai/hunyuan-exp/v1`,
      });

      // 当前示例只演示 client 与 server 1:1 通信
      // 初始化 MCP 传输层，配置与本地server通信
      const transport = new PostClientTransport(
        new URL('http://127.0.0.1:30000/messages'),
        {
          requestInit: {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
          },
        }
      );
      // 初始化 MCP 客户端
      const client = new Client(
        {
          name: 'example-client',
          version: '1.0.0',
        },
        {
          capabilities: {
            prompts: {},
            resources: {},
            tools: {},
          },
        }
      );
      // 连接到工具服务器
      await client.connect(transport);
      console.log('connected');
      // 获取可用工具列表
      const response = await client.listTools();
      console.log('response', response);

      const availableTools = [];

      const sendAssistantMsg = (msg) => {
        this.sseSender.send({
          data: {
            content: `\n\n${msg}`,
            role: 'assistant',
            type: 'text',
          },
        });
      };
      // 如果有可用工具，进行工具调用处理
      if (response.tools.length) {
        // 转换工具格式为模型所需格式
        availableTools.push(
          ...response.tools.map((tool) => ({
            type: 'function',
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.inputSchema,
            },
          }))
        );

        const messages = [{ role: 'user', content: msg }];

        let loopFlag = true;
        // 循环处理工具调用
        while (loopFlag) {
          const completion = await aiClient.chat.completions.create({
            model: 'hunyuan-turbo',
            messages: messages,
            // stream: true,
            tools: availableTools,
            tool_choice: 'auto',
          });
          console.log('当前轮次 completion', JSON.stringify(completion));

          // 处理 toolcall 调用分析的响应
          for (let choice of completion.choices) {
            const message = choice.message;
            if (message.content) {
              sendAssistantMsg(message.content);
            }

            if (message.tool_calls) {
              for (let toolCall of message.tool_calls) {
                const toolName = toolCall.function.name;
                const toolArgs = JSON.parse(toolCall.function.arguments);
                console.log('toolName', toolName);
                console.log('toolArgs', toolArgs);
                // 执行工具调用
                const toolResponse = await client.callTool({
                  name: toolName,
                  arguments: toolArgs,
                });
                console.log('toolResponse', toolResponse);
                sendAssistantMsg(
                  `[调用工具 ${toolName} 并传递参数 ${JSON.stringify(
                    toolArgs
                  )}]`
                );

                console.log(toolResponse.content);
                // finalText.push(toolResponse.content);
                sendAssistantMsg(
                  `[调用工具 ${toolName} 结果：${JSON.stringify(
                    toolResponse.content
                  )}`
                );
                // 将工具调用结果添加到对话历史
                messages.push({
                  role: 'assistant',
                  content: '',
                  tool_calls: [toolCall],
                });
                messages.push({
                  role: 'tool',
                  tool_call_id: toolCall.id,
                  content: toolResponse.content,
                });
              }
            } else {
              // 不需要再调工具了，最后总结
              loopFlag = false;
            }
          }
        }
      }
    } catch (e) {
      console.log('error', e);
    }

    this.sseSender.end();
  }
}
