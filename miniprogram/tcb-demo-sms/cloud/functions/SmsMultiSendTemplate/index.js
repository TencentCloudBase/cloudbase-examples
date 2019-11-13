const config = require('./config')
const {
  AppID,
  AppKey,
  TemplateID,
  Params,
  Sign
} = config
const cloud = require('wx-server-sdk')
cloud.init()
const TcbService = require('tcb-service-sdk')
const tcbService = new TcbService({ smsAppID: AppID, smsAppKey: AppKey })

exports.main = async (event, context) => {
  let {
    nationCode = '86',
    phoneNumbers = [],
    templId = TemplateID,
    params = Params,
    sign = Sign,
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
      action: 'SmsMultiSendTemplate',
      data: {
        nationCode,
        phoneNumbers,
        templId,
        params,
        sign,
        extend,
        ext
      }
    })

    return result;
  }
  catch (e) {
    response.code = e.code || 10002
    response.message = e.message
  }

  return response
}