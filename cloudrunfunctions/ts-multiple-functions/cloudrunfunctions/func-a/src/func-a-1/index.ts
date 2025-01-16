import { TcbEventFunction } from '@cloudbase/functions-typings'

// GET no boyd
export const main: TcbEventFunction = function(event, context) {
  console.log('hello a-1')
  return 'a-1'
}
 