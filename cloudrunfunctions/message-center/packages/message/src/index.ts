import { TcbEventFunction } from '@cloudbase/functions-typings'
import {
  calculateClientID,
  KafkaClient,
  RedisClient,
  createKafkaClient,
  createRedisClient,
  TMessage
} from '@local/common'
import { EachMessagePayload } from 'kafkajs'
import { WebSocketManager } from './websocket.js'

const kafkaConfig = {
  brokers: [process.env.KAFKA_BROKER] as string[],
  topic: process.env.KAFKA_TOPIC as string
}

const redisConfig = {
  url: process.env.REDIS_URL as string
}

let redisClient: RedisClient
let kafkaClient: KafkaClient
let wsManager: WebSocketManager
const init = async () => {
  // 初始化 kafka 客户端
  kafkaClient = await createKafkaClient({
    clientId: 'client-trigger',
    brokers: kafkaConfig.brokers
  })
  // 启动 Kafka 消费者
  kafkaClient.startConsuming(kafkaConfig.topic, messageHandler)

  // 初始化 Redis 客户端用于管理连接
  redisClient = await createRedisClient(redisConfig.url)

  // 初始化 websocket 连接管理
  wsManager = new WebSocketManager()
}

;(async () => {
  await init()
})()

/**
 * 解析 Kafka 消息
 * @param payload
 * @returns
 */
const parseKafkaMessage = (
  payload: EachMessagePayload
): TMessage | undefined => {
  try {
    const value = payload.message.value?.toString()
    return value ? (JSON.parse(value) as TMessage) : undefined
  } catch (error) {
    console.error('Failed to parse Kafka message:', error)
    return
  }
}

/**
 * 向 Redis 投递收到的 Kafka 消息
 * @param message
 * @returns
 */
const processMessage = async (message: TMessage) => {
  const { clientID, event } = message

  // 向该客户端对应的 Redis channel 发送从 Kafka 中消费得到的消息数据
  await redisClient.publish(clientID, JSON.stringify(event))
  console.log('Published to Redis channel:', clientID)
}

const messageHandler = async function (
  payload: EachMessagePayload
): Promise<void> {
  const message = parseKafkaMessage(payload)
  if (message) {
    await processMessage(message)
  }
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
