import { ws } from '@cloudbase/functions-typings'

export class WebSocketManager {
  private clientMap = new Map<string, ws.IWebSocket>()

  /**
   * 保存客户端连接，如果客户端 ID 已经存在，则进行覆盖
   * @param clientID
   * @param ws
   */
  addClient(clientID: string, ws: ws.IWebSocket) {
    this.clientMap.set(clientID, ws)
  }

  /**
   * 取出客户端 ID 对应的 Websocket 连接
   * @param clientID
   * @returns
   */
  getClient(clientID: string): ws.IWebSocket | undefined {
    return this.clientMap.get(clientID)
  }

  /**
   * 是否存在指定客户端
   * @param clientID
   * @returns
   */
  hasClient(clientID: string): boolean {
    const ws = this.getClient(clientID)
    return ws !== undefined
  }

  /**
   * 移除客户端 ID 对应的连接
   * @param clientID
   */
  removeClient(clientID: string) {
    this.clientMap.delete(clientID)
  }

  /**
   * 向指定客户端发送消息
   * @param clientID 客户端标识
   * @param message 消息内容
   */
  distributeMessage(clientID: string, message: string) {
    const ws = this.clientMap.get(clientID)
    if (ws && ws.send) {
      ws.send(message)
    }
  }

  /**
   * 关闭所有客户端连接
   *
   */
  close() {
    this.clientMap.forEach((ws) => {
      ws.close(1000, 'Server shutdown. Bye.')
    })
  }
}
