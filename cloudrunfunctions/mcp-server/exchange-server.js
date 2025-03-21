import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'demo-sse',
  version: '1.0.0',
});

// server.tool(
//   'exchange',
//   '人民币汇率换算',
//   { rmb: z.number() },
//   async ({ rmb }) => {
//     // 使用固定汇率进行演示，实际应该调用汇率API
//     const usdRate = 0.14; // 1人民币约等于0.14美元
//     const hkdRate = 1.09; // 1人民币约等于1.09港币

//     const usd = (rmb * usdRate).toFixed(2);
//     const hkd = (rmb * hkdRate).toFixed(2);

//     return {
//       content: [
//         {
//           type: 'text',
//           text: `${rmb}人民币等于:\n${usd}美元\n${hkd}港币`,
//         },
//       ],
//     };
//   }
// );

server.tool(
  'calculate-bmi',
  '计算 BMI 指数', // 添加工具描述
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

const app = express();

// 添加中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  // 直接在中间件中处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 添加心跳机制函数
function setupHeartbeat(res) {
  const heartbeat = setInterval(() => {
    if (res.writableEnded) {
      clearInterval(heartbeat);
      return;
    }
    res.write('event: heartbeat\ndata: ping\n\n');
  }, 15000); // 每15秒发送一次心跳

  res.on('close', () => {
    clearInterval(heartbeat);
  });

  return heartbeat;
}

// const sessions: Record<string, { transport: SSEServerTransport; response: express.Response }> = {}
const sessions = {};
app.get('/sse', async (req, res) => {
  setupHeartbeat(res);
  // 在发送任何数据之前设置响应头
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // 禁用 Nginx 缓冲
  });
  const transport = new SSEServerTransport('/messages', res);
  const sessionId = Date.now().toString();
  sessions[sessionId] = { transport, response: res };

  // 监听连接关闭
  res.on('close', () => {
    console.log(`Client disconnected: ${sessionId}`);
    delete sessions[sessionId];
  });

  try {
    await server.connect(transport);
    console.log(`New SSE connection established: ${sessionId}`);
  } catch (error) {
    console.error('SSE connection error:', error);
    delete sessions[sessionId];
    res.end();
  }
});

app.post('/messages', async (req, res) => {
  // Note: to support multiple simultaneous connections, these messages will
  // need to be routed to a specific matching transport. (This logic isn't
  // implemented here, for simplicity.)
  await transport.handlePostMessage(req, res);
});

const port = 3001;
const host = '0.0.0.0';

// 添加服务器状态监控
let isServerReady = false;

// 优化服务器启动
const startServer = async () => {
  try {
    await new Promise((resolve, reject) => {
      const serverInstance = app.listen(port, host, () => {
        console.log(`Server started on http://${host}:${port}`);
        isServerReady = true;
        resolve();
      });

      serverInstance.on('error', (error) => {
        console.error('Server failed to start:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
