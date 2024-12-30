import { TcbEventFunction } from '@cloudbase/functions-typings'
import {
  createKafkaClient,
  KafkaClient,
  calculateClientID,
  TMessage
} from '@local/common'

const kafkaConfig = {
  brokers: [process.env.KAFKA_BROKER] as string[],
  topic: process.env.KAFKA_TOPIC as string
}

let kafkaClient: KafkaClient
const init = async function () {
  // 初始化 kafka 客户端
  kafkaClient = await createKafkaClient({
    clientId: 'client-trigger',
    brokers: kafkaConfig.brokers as string[]
  })
}

;(async () => {
  await init()
})()

export const main: TcbEventFunction = async function (event, context) {
  // 有客户端触发函数，构造消息投递至 Kafka
  const clientID = calculateClientID(context.httpContext!.headers)

  const message: TMessage = {
    clientID: clientID,
    event: event
  }

  try {
    await kafkaClient.sendMessage(kafkaConfig.topic, message)
  } catch (err) {
    console.error('Failed to send message to kafka', err)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'action failed'
    }
  }

  return 'success'
}
