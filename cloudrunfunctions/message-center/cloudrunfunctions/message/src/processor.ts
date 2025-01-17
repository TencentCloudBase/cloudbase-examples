import { TMessage } from '@local/common'
import { EachMessagePayload } from 'kafkajs'
import { Message } from 'pulsar-client'

interface IProcessor<T> {
  process: (rawMessage: T) => Promise<void>
}

abstract class Processor<T> implements IProcessor<T> {
  private handler: (message: TMessage) => Promise<void>

  constructor(handler: (message: TMessage) => Promise<void>) {
    this.handler = handler
  }
  protected abstract parseMessage(rawMessage: T): TMessage | undefined


  /**
   * 处理消息
   * @param rawMessage 
   */
  async process(rawMessage: T): Promise<void> {
    try {
      const parsedMessage = this.parseMessage(rawMessage)
      if (parsedMessage) {
        await this.handler(parsedMessage)
      }
    } catch (error) {
      console.error('Failed to process message:', error)
    }
  }
}

/**
 * Kafka 消息处理
 */
export class KafkaProcessor extends Processor<EachMessagePayload> {
  protected parseMessage(payload: EachMessagePayload): TMessage | undefined {
    try {
      const value = payload.message.value?.toString()
      return value ? (JSON.parse(value) as TMessage) : undefined
    } catch (error) {
      console.error('Failed to parse Kafka message:', error)
      return
    }
  }
}

/**
 * Pulsar 消息处理
 */
export class PulsarProcessor extends Processor<Message> {
  protected parseMessage(message: Message): TMessage | undefined {
    try {
      const value = message.getData().toString()
      return value ? (JSON.parse(value) as TMessage) : undefined
    } catch (error) {
      console.error('Failed to parse Pulsar message:', error)
      return
    }
  }
}
