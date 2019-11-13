// 云函数入口文件
const config = require('./config')
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const roomsCollection = db.collection('liveRooms')
const { createRoom } = require('./create')

// 云函数入口函数 
/**
 * 创建房间 返回privateMapKey 并启动webrtc-room 组件进入房间
 * @param event.roomName 房间名称
 * @description roomID 可以随机生成
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    userID = '',
    roomID = '',
    roomName = '',
  } = event
  userID = userID || wxContext.OPENID

  let response = {
    data: {}
  }

  // 传入房间名，则创建新房间
  if (roomName) {
    let createRoomData = await createRoom(cloud, {
      userID,
      roomName
    })

    response.data.roomInfo = createRoomData
    response.message = 'create success'
  }
  else if (roomID) {
    if (roomID && !/^[0-9]{1,11}$/.test(roomID)) {
      response.code = '10002'
      response.message = 'roomID数值必须是整数'
      return response
    }

    // 查询房间是否存在
    let roomData = await roomsCollection.where({
      roomID
    }).get()

    // 如果存在，则将房间数据存起来
    if (roomData.data.length) {
      roomData.info = roomData.data[0]
    }

    // 房间存在，则不创建，直接进入房间
    if (roomData.info) {
      // enter 进入房间，增加房间成员
      let roomInfo = roomData.info

      if (roomInfo.members.length < config.maxMembers) {
        if (roomInfo.members.indexOf(userID) == -1) {
          roomInfo.members.push(userID)
        }
        await roomsCollection.doc(roomInfo._id).update({
          data: {
            members: roomInfo.members
          }
        })
        response.data.roomInfo = roomInfo
        response.message = 'enter success'
      } else {
        // 房间已满 5001
        response.code = '10005'
        response.message = '超出房间人数上限'
        return response
      }
    }
    else {
      let createRoomData = await createRoom(cloud, {
        userID,
        roomID
      })
      response.data.roomInfo = createRoomData
      response.message = 'create success'
    }
  }

  response.data.roomInfo.userID = userID

  return response
}