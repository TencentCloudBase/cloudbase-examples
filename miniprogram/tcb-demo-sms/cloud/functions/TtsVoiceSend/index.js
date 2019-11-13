const config = require('./config')
const {
  AppID,
  AppKey,
  TemplateID,
  Params
} = config
const cloud = require('wx-server-sdk')
cloud.init()
const TcbService = require('tcb-service-sdk')
const tcbService = new TcbService({ smsAppID: AppID, smsAppKey: AppKey })

exports.main = async (event, context) => {
  let {
    nationCode = '86',
    phoneNumber = '',
    templId = TemplateID,
    params = Params,
    playtimes = 2,
    ext = ''
  } = event

  let response = {
    code: 0,
    data: {},
    message: 'success'
  }

  if (!phoneNumber) {
    response.code = 10001
    response.message = '电话号码不能为空'
    return response
  }

  try {
    let result = await tcbService.callService({
      service: 'sms',
      action: 'TtsVoiceSend',
      data: {
        nationCode,
        phoneNumber,
        templId,
        params,
        playtimes,
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