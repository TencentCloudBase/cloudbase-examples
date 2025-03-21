import { MCPPostServerRunner } from '@cloudbase/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export const server = new McpServer({
  name: 'hello-world',
  version: '1.0.0',
});

// Add an addition tool
// server.tool('get user name', '', async () => ({
//   content: [{ type: 'text', text: 'Joe Zeng' }],
// }));

server.tool(
  'calculate-bmi',
  '计算 BMI 指数',
  {
    weightKg: z.number(),
    heightM: z.number(),
  },
  async ({ weightKg, heightM }) => ({
    content: [
      {
        type: 'text',
        text: String(weightKg / (heightM * heightM)),
      },
    ],
  })
);

server.tool(
  'add',
  '计算两数的和',
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({ content: [{ type: 'text', text: String(a + b) }] })
);

server.tool(
  'sub',
  '计算两数相减的差',
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({ content: [{ type: 'text', text: String(a - b) }] })
);

server.tool(
  'multi',
  '计算两数相乘的积',
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({ content: [{ type: 'text', text: String(a * b) }] })
);

server.tool(
  'division',
  '计算两数相除的商',
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({ content: [{ type: 'text', text: String(a / b) }] })
);

export const main = async function (event, context) {
  return MCPPostServerRunner.run(event, context, server);
};
