// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const liveRoomsCollection = db.collection('liveRooms')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let response = {
    code: 0,
    message: 'success',
    data: {}
  }

  // 从数据库拉取房间信息
  let result = await liveRoomsCollection
    .where({
      roomID: event.roomID
    })
    .get()

  if (result.data && result.data.length > 0) {
    response.data = result.data[0]
  }

  if (response.data.creator === wxContext.OPENID) {
    response.data.isCreator = true
  }
  else {
    response.data.isCreator = false
  }

  return response
}