// 云函数入口文件
const config = require('./config')
const {
  AppID,
  AppKey,
} = config
const randomstring = require("randomstring")
const cloud = require('wx-server-sdk')
cloud.init()

const TcbService = require('tcb-service-sdk')
const tcbService = new TcbService({ smsAppID: AppID, smsAppKey: AppKey })

const validTime = 120000 // 验证码有效时间
const gapTime = 60000 // 验证码可发送间隔
const codeLength = 4 // 验证码长度

let db = cloud.database()
let collection = db.collection('verification')

async function sendSMS(type, phoneNumber, code) {
  if (type === 'normal') {
    return await sendNormalSMS(phoneNumber, code)
  }
  else if (type === 'voice') {
    return await sendVoiceSMS(phoneNumber, code)
  }
}

async function sendNormalSMS(phoneNumber, code) {
  return await tcbService.callService({
    service: 'sms',
    action: 'SmsSingleSend',
    data: {
      nationCode: '86',
      phoneNumber,
      msg: `你的验证码为：${code}，请于2分钟内填写。如非本人操作，请忽略本短信。`
    }
  })
}

async function sendVoiceSMS(phoneNumber, code) {
  return await tcbService.callService({
    service: 'sms',
    action: 'CodeVoiceSend',
    data: {
      msgType: 0,
      nationCode: '86',
      phoneNumber,
      msg: code
    }
  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    phoneNumber,
    type // normal 是普通短信，voice 是语音短信
  } = event

  let response = {
    code: 0,
    data: {
      gapTime,
      validTime
    },
    message: 'success'
  }

  let code = randomstring.generate({
    length: codeLength,
    charset: 'numeric'
  })

  let now = Date.now()

  let result = await collection.where({
    _openid: wxContext.OPENID
  }).get()

 
  let smsResult = null

  // 首次发送验证码
  if (!result.data.length) {
    let result = await collection.add({
      data: {
        code,
        validTime,
        gapTime,
        createTime: now,
        _openid: wxContext.OPENID,
        check: null,
      }
    })
    smsResult = await sendSMS(type, phoneNumber, code)
  }
  // 有过往验证码创建记录
  else {
    let data = result.data[0]

    if (now <= data.createTime + data.gapTime) {
      return {
        code: 10001,
        message: `${Math.ceil(data.gapTime / 1000)}秒内不可重复发送验证码`
      }
    }

    await collection.doc(data._id).update({
      data: {
        code,
        createTime: Date.now(),
        check: null,
      }
    })
    smsResult = await sendSMS(type, phoneNumber, code)
  }

  console.log(smsResult)

  if (smsResult.code) {
    response.code = smsResult.code
    response.message = smsResult.message
  }

  return response
}