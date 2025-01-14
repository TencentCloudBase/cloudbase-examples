import { createHash } from 'crypto'
import { IncomingHttpHeaders } from 'http'

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
