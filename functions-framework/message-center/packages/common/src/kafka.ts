import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs'

export type TMessage = {
  clientID: string
  event: unknown
}

export class KafkaClient {
  private kafka: Kafka
  private producer: Producer
  private consumer: Consumer

  // 初始化 Kafka 客户端，连接 Kafka 集群
  constructor(kafkaConfig: { brokers: string[]; clientId: string }) {
    this.kafka = new Kafka(kafkaConfig)
    this.producer = this.kafka.producer()
    this.consumer = this.kafka.consumer({ groupId: kafkaConfig.clientId })
  }

  public async init(): Promise<void> {
    await this.producer.connect()
    await this.consumer.connect()
  }

  // 发送消息到 Kafka topic
  public async sendMessage(topic: string, message: TMessage) {
    if (!this.producer) {
      throw new Error('Kafka producer is not initialized')
    }

    try {
      const metadata = await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
      })
      for (const m of metadata) {
        console.log(
          `Message delivered to ${m.topicName} (${m.partition}) at ${m.logAppendTime}`
        )
      }
    } catch (error) {
      throw Error('Failed to send message:' + error)
    }
  }

  // 启动消费消息
  public async startConsuming(
    topic: string,
    eachMessageHandler: (payload: EachMessagePayload) => Promise<void>
  ) {
    if (!this.consumer) {
      throw new Error('Kafka consumer is not initialized')
    }

    // 启动消费者，监听指定的 topic
    await this.consumer.subscribe({ topic, fromBeginning: true })

    await this.consumer.run({
      autoCommitThreshold: 1,
      eachMessage: eachMessageHandler
    })

    console.log(`Start consuming messages from topic "${topic}"...`)
  }

  // 关闭 Kafka 客户端连接
  public async close() {
    if (this.producer) {
      await this.producer.disconnect()
      console.log('Kafka producer disconnected')
    }

    if (this.consumer) {
      await this.consumer.disconnect()
      console.log('Kafka consumer disconnected')
    }

    if (this.kafka) {
      console.log('Kafka client disconnected')
    }
  }
}

export const createKafkaClient = async (config: {
  brokers: string[]
  clientId: string
}) => {
  const kafkaClient = new KafkaClient({
    clientId: config.clientId,
    brokers: config.brokers
  })
  await kafkaClient.init()
  return kafkaClient
}
