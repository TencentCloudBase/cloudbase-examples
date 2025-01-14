import { TcbEventFunction } from '@cloudbase/functions-typings'

// GET no boyd
export const main: TcbEventFunction = function(event, context) {
  console.log('hello world')
  return 'a'
}
