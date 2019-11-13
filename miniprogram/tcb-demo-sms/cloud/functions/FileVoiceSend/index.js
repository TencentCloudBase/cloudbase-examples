const config = require('./config')
const {
  AppID,
  AppKey,
  Fid,
} = config
const cloud = require('wx-server-sdk')
cloud.init()
const {
  SmsClient
} = require('sms-node-sdk');
const TcbService = require('tcb-service-sdk')
const tcbService = new TcbService({ smsAppID: AppID, smsAppKey: AppKey })

exports.main = async (event, context) => {
  let {
    nationCode = '86',
    phoneNumber = '',
    fid = Fid,
    playtimes = 2,
    ext = ''
  } = event

  const wxContext = cloud.getWXContext()

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
      action: 'FileVoiceSend',
      data: {
        nationCode,
        phoneNumber,
        fid,
        playtimes,
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