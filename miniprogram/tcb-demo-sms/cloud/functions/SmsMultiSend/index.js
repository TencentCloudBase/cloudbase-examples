const config = require('./config')
const {
  AppID,
  AppKey,
  Msg
} = config
const cloud = require('wx-server-sdk')
cloud.init()
const TcbService = require('tcb-service-sdk')
const tcbService = new TcbService({ smsAppID: AppID, smsAppKey: AppKey })

exports.main = async (event, context) => {
  let {
    msgType = 0,
    nationCode = '86',
    phoneNumbers = [],
    msg = Msg,
    extend = '',
    ext = ''
  } = event

  const wxContext = cloud.getWXContext()

  let response = {
    code: 0,
    data: {},
    message: 'success'
  }

  if (!phoneNumbers.length) {
    response.code = 10001
    response.message = '电话号码不能为空'
    return response
  }

  try {
    let result = await tcbService.callService({
      service: 'sms',
      action: 'SmsMultiSend',
      data: {
        msgType,
        nationCode,
        phoneNumbers,
        msg,
        extend,
        ext
      }
    })

    return result
  }
  catch (e) {
    response.code = e.code || 10002
    response.message = e.message
  }

  return response
}