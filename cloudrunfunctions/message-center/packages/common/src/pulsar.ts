import {
  Client,
  Consumer,
  Producer,
  Message,
  AuthenticationToken
} from 'pulsar-client'
import { TMessage } from './utils'

export class PulsarClient {
  private client: Client
  private producer?: Producer
  private consumer?: Consumer

  /**
   * 构造函数，初始化 Pulsar 客户端
   * @param serviceUrl - Pulsar 服务的连接地址
   */
  constructor(serviceUrl: string, token: string) {
    const auth = new AuthenticationToken({ token: token })
    this.client = new Client({ serviceUrl, authentication: auth })
  }

  /**
   * 创建一个 producer
   * @param topic - 要发送消息的 topic
   */
  async createProducer(topic: string): Promise<void> {
    try {
      this.producer = await this.client.createProducer({
        topic,
        producerName: 'local-pulsar-producer',
        batchingEnabled: false // 发送延时消息需要关闭 batching
      })
      console.log(`Pulsar producer created for topic: ${topic}`)
    } catch (err) {
      console.error('Error creating producer:', err)
    }
  }

  /**
   * 发送延时消息
   * @param message - 要发送的消息内容
   */
  async sendDelayedMessage(message: TMessage, delayMS: number): Promise<void> {
    if (!this.producer) {
      throw new Error(
        'Pulsar producer is not initialized.'
      )
    }
    try {
      await this.producer.send({
        data: Buffer.from(JSON.stringify(message)),
        deliverAfter: delayMS
      })
      console.log(
        `Message sent to: ${this.producer.getTopic()}, will be delivered after ${delayMS}ms`
      )
    } catch (error) {
      throw new Error('Failed to send message:' + error)
    }
  }

  /**
   * 注册并启动一个 consumer
   * @param topic - 要订阅的 topic
   * @param subscription - 订阅名称
   */
  async registerConsumer(
    topic: string,
    subscription: string,
    onMessage: (message: Message) => void
  ): Promise<void> {
    try {
      this.consumer = await this.client.subscribe({
        topic,
        subscription,
        subscriptionType: 'Shared', // 延时消息只能使用 Shared 模式消费
        listener: (msg, consumer) => {
          consumer.acknowledge(msg)
          onMessage(msg)
        }
      })
      console.log(`Pulsar consumer registered for topic: ${topic}`)
    } catch (err) {
      console.error('Error registering consumer:', err)
    }
  }

  /**
   * 关闭 Pulsar 客户端
   */
  async close(): Promise<void> {
    await this.producer?.close()
    await this.consumer?.close()
    await this.client.close()
    console.log('Pulsar client closed')
  }
}

/**
 * 创建 pulsar producer
 * @param config 
 * @returns 
 */
export const createPulsarClientProducer = async (config: {
  serviceUrl: string
  token: string
  topic: string
}) => {
  const pulsarClient = new PulsarClient(config.serviceUrl, config.token)
  await pulsarClient.createProducer(config.topic)
  return pulsarClient
}


/**
 * 注册并启动 pulsar consumer
 * @param config 
 * @returns 
 */
export const registerPulsarClientConsumer = async (config: {
  serviceUrl: string
  token: string
  topic: string
  subscription: string
  onMessage: (message: Message) => void
}) => {
  const pulsarClient = new PulsarClient(config.serviceUrl, config.token)
  await pulsarClient.registerConsumer(
    config.topic,
    config.subscription,
    config.onMessage
  )
  return pulsarClient
}
