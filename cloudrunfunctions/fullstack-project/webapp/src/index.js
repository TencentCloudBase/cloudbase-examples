
import cloudbase from '@cloudbase/js-sdk'

const tcbapp = cloudbase.init({
  env: 'abc-9g9ta2m2dfd82dcd',
  clientId: 'AOJ8yAABa1RmC3BKbrg'
})

const auth = tcbapp.auth()

await auth.signInAnonymously()

// 调用 cloudbaserunfunctions/helloworld 函数
const result1 = await tcbapp.callFunction({
  name: 'helloworld',
  type: 'cloudrun'
})

console.log('result1:', result1)

// 调用 cloudbaserunfunctions/echo 函数
const result2 = await tcbapp.callFunction({
  name: 'echo',
  type: 'cloudrun',
  method: "POST",
  data: {
    name: 'world'
  }
})

console.log('result2:', result2)

// 调用 cloudbaserunfunctions/call-other-fn 函数
const result3 = await tcbapp.callFunction({
  name: 'call-other-fn',
  type: 'cloudrun',
  method: "POST",
  data: {
    otherFuncName: 'echo'
  }
})

console.log('result3:', result3)
