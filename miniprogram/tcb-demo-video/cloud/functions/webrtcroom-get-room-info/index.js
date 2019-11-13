// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const roomsCollection = db.collection('webrtcRooms')

// 云函数入口函数
exports.main = async (event, context) => {

  let response = {
    code: 0,
    message: 'success',
    data: null
  }

  // 从数据库拉取房间信息
  let result = await roomsCollection
    .where({
      roomID: event.roomID
    })
    .get()

  if (result.data && result.data.length > 0) {
    response.data = result.data[0]
  }

  return response
  
}