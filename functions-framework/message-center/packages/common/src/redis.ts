import { createClient, RedisClientType } from 'redis'

export class RedisClient {
  private redisClient: RedisClientType

  constructor(url: string) {
    // 创建 Redis 客户端
    this.redisClient = createClient({ url })
  }

  /**
   * 初始化 Redis 客户端
   * @param url Redis 连接地址
   */
  public async init(): Promise<void> {
    // 监听错误事件
    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    // 连接 Redis
    await this.redisClient.connect()
    console.log('Redis client connected')
  }

  /**
   * 发布消息到指定频道
   * @param channel 频道名称
   * @param message 消息内容
   */
  public async publish(channel: string, message: string): Promise<void> {
    if (!this.redisClient) {
      throw new Error('Redis client is not initialized')
    }

    try {
      await this.redisClient.publish(channel, message)
      console.log(`Message published to channel "${channel}": ${message}`)
    } catch (err) {
      console.error('Failed to publish message:', err)
    }
  }

  /**
   * 订阅指定频道并处理消息
   * @param channel 频道名称
   * @param messageHandler 消息处理函数
   */
  public async subscribe(
    channel: string,
    messageHandler: (message: string) => void
  ): Promise<void> {
    if (!this.redisClient) {
      throw new Error('Redis client is not initialized')
    }

    // 创建订阅客户端（独立于普通客户端）
    const subscriber = this.redisClient.duplicate()

    await subscriber.connect()
    await subscriber.subscribe(channel, (message) => {
      console.log(`Message received on channel "${channel}": ${message}`)
      messageHandler(message)
    })

    console.log(`Subscribed to channel "${channel}"`)
  }

  /**
   * 关闭 Redis 客户端连接
   */
  public async close(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.disconnect()
      console.log('Redis client disconnected')
    }
  }
}

/**
 * 初始化 Redis 客户端
 * @param url 链接地址，格式 `redis[s]://[[username][:password]@][host][:port][/db-number]`
 * @returns
 */
export const createRedisClient = async (url: string) => {
  const redisClient = new RedisClient(url)
  await redisClient.init()
  return redisClient
}
