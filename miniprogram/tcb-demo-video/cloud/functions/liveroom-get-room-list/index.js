// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const roomsCollection = db.collection('liveRooms')

// 云函数入口函数
exports.main = async (event, context) => {
  let response = {
    code: 0,
    message: 'success'
  }

  // 从数据库拉取房间列表
  let { data } = await roomsCollection
    .skip(event.skip || 0)
    .limit(event.limit || 10)
    .get()

  response.data = data

  return response
}