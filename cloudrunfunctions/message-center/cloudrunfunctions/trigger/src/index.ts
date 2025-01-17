import { TcbEventFunction } from '@cloudbase/functions-typings'
import {
  createKafkaClient,
  KafkaClient,
  calculateClientID,
  createPulsarClientProducer,
  PulsarClient
} from '@local/common'

const kafkaConfig = {
  brokers: [process.env.KAFKA_BROKER] as string[],
  topic: process.env.KAFKA_TOPIC as string
}

const pulsarConfig = {
  serviceUrl: process.env.PULSAR_SERVICE_URL as string,
  topic: process.env.PULSAR_TOPIC as string,
  token: process.env.PULSAR_TOKEN as string
}

let kafkaClient: KafkaClient
let pulsarProducer: PulsarClient
const init = async function () {
  // 初始化 kafka 客户端
  kafkaClient = await createKafkaClient({
    clientId: 'client-trigger',
    brokers: kafkaConfig.brokers as string[]
  })
  // 初始化 pulsar 客户端
  pulsarProducer = await createPulsarClientProducer(pulsarConfig)
}

;(async () => {
  await init()
})()

export const main: TcbEventFunction = async function (event, context) {
  // 有客户端触发函数，构造消息投递至 Kafka
  const clientID = calculateClientID(context.httpContext!.headers)

  const data = {
    clientID: clientID,
    event: event,
    bornTime: new Date().toISOString()
  }

  try {
    await kafkaClient.sendMessage(kafkaConfig.topic, {
      ...data,
      type: 'immediate'
    })
    await pulsarProducer.sendDelayedMessage({ ...data, type: 'delayed' }, 3000)
  } catch (err) {
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
