import { createHash } from 'crypto'
import { IncomingHttpHeaders } from 'http'

export type TMessage = {
  /**
   * 消息类型, immediate: 立即发送,delayed: 延时发送
   */
  type: 'immediate' | 'delayed',
  /**
   * 消息产生时间
   */
  bornTime?: string
  /**
   * 消息发送到客户端的时间
   */
  sentTime?: string
  /**
   * 消息内容
  */
 event: unknown
 /**
  * 消息要被发送到的客户端 ID
  */
 clientID: string
}


export const calculateClientID = function (
  httpHeaders: IncomingHttpHeaders
): string {
  const host = httpHeaders.host
  const ua = httpHeaders['user-agent']
  const clientIP = httpHeaders['x-client-ip']
  const identifier = [host, ua, clientIP].join(':')
  const hashedIdentifier = createHash('md5').update(identifier).digest('base64')
  return hashedIdentifier
}
