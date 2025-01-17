import { TcbEventFunction } from '@cloudbase/functions-typings'
import {
  calculateClientID,
  KafkaClient,
  RedisClient,
  createKafkaClient,
  createRedisClient,
  TMessage,
  PulsarClient,
  registerPulsarClientConsumer
} from '@local/common'
import { WebSocketManager } from './websocket.js'
import { KafkaProcessor, PulsarProcessor } from './processor.js'

const kafkaConfig = {
  brokers: [process.env.KAFKA_BROKER] as string[],
  topic: process.env.KAFKA_TOPIC as string
}

const redisConfig = {
  url: process.env.REDIS_URL as string
}

const pulsarConfig = {
  serviceUrl: process.env.PULSAR_SERVICE_URL as string,
  token: process.env.PULSAR_TOKEN as string,
  topic: process.env.PULSAR_TOPIC as string,
  subscription: process.env.PULSAR_SUBSCRIPTION as string
}

let redisClient: RedisClient
let kafkaClient: KafkaClient
let pulsarConsumer: PulsarClient
let wsManager: WebSocketManager
const init = async () => {
  // 初始化 kafka 客户端
  kafkaClient = await createKafkaClient({
    clientId: 'client-trigger',
    brokers: kafkaConfig.brokers
  })

  // 初始化并启动 Kafka 消费者
  const kafkaProcessor = new KafkaProcessor(publishToClient)
  kafkaClient.startConsuming(kafkaConfig.topic, (payload) =>
    kafkaProcessor.process(payload)
  )

  // 初始化并启动 pulsar 消费者
  const pulsarProcessor = new PulsarProcessor(publishToClient)
  pulsarConsumer = await registerPulsarClientConsumer({
    ...pulsarConfig,
    onMessage: (msg) => pulsarProcessor.process(msg)
  })

  // 初始化 Redis 客户端用于管理连接
  redisClient = await createRedisClient(redisConfig.url)

  // 初始化 websocket 连接管理
  wsManager = new WebSocketManager()
}

;(async () => {
  await init()
})()

async function publishToClient(message: TMessage): Promise<void> {
  const { clientID, ...rest } = message
  rest.sentTime = new Date().toISOString()
  // 向该客户端对应的 Redis channel 发送从 Kafka 中消费得到的消息数据
  await redisClient.publish(clientID, JSON.stringify(rest))
  console.log('Published to Redis channel:', clientID)
}

export const main: TcbEventFunction = async function (event, context) {
  if (context.ws) {
    // 有客户端连接加入时，保存客户端与连接的映射，便于之后向客户端推送消息
    const clientID = calculateClientID(context.httpContext!.headers)
    wsManager.addClient(clientID, context.ws)

    context.ws.on('message', (msg: any) => {
      console.log('WebSocket message from client:', msg)
    })

    context.ws.on('close', () => {
      wsManager.removeClient(clientID)
    })
  }
}

main.handleUpgrade = async function (upgradeContext) {
  const clientID = calculateClientID(upgradeContext.httpContext!.headers)

  // 将新加入的客户端加入订阅列表
  await redisClient.subscribe(clientID, (message) => {
    // 从 Redis 收到消息时，向客户端推送
    wsManager.distributeMessage(clientID, message)
  })

  return { allowWebSocket: true }
}
;['beforeExit', 'SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, async () => {
    try {
      wsManager.close()
      await kafkaClient.close()
      await pulsarConsumer.close()
      await redisClient.close()
      console.log('Shutting down... Cleaned up resources.')
    } catch (error) {
      console.error('Failed to close resources:', error)
    }
  })
})
