import { TcbEventFunction } from '@cloudbase/functions-typings'

// GET no boyd
export const main: TcbEventFunction = function(event, context) {
  console.log('hello a-2')
  return 'a-2'
}
 