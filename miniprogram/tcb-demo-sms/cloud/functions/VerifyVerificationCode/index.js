// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

let db = cloud.database()
let collection = db.collection('verification')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let response = {
    code: 0,
    message: 'success'
  }

  let {
    code
  } = event

  let result = await collection.where({
    _openid: wxContext.OPENID
  }).get()

  if (!result.data.length) {
    response.code = 10001
    response.message = '验证失败'
    return response
  }

  let data = result.data[0]
  let now = Date.now()

  if (data.code !== code || now > data.createTime + data.validTime) {
    await collection.doc(data._id).update({
      data: {
        check: false
      }
    })
    response.code = 10002
    response.message = '验证失败'
  }
  else {
    await collection.doc(data._id).update({
      data: {
        check: true
      }
    })
  }

  return response
}