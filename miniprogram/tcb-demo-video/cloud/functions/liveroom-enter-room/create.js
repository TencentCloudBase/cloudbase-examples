
const uuid = require('./libs/uuid')
const md5 = require('md5')
const randomstring = require("randomstring")
const {
  getPushUrl,
  getPlayUrl
} = require('./libs/getUrl')
const config = require('./config')

// 随机生成 roomID
function generateRoomID() {
  return uuid(8, 10);
}
// 需检查该 roomid 是否存在
async function isRoomExist(roomsCollection, roomID) {
  let { data } = await roomsCollection.where({
    roomID: roomID
  }).get()

  return data.length > 0 ? true : false
}

async function createRoom(cloud, { userID, roomID = '', roomName = '' }) {
  cloud.init()
  const db = cloud.database()
  const roomsCollection = db.collection('liveRooms')

  let roomInfo = {
    creator: userID,
    roomID: roomID || generateRoomID(),
    roomName: roomName,
    members: [],
    createTime: new Date()
  }

  // 循环检查数据，避免 generateRoomID 生成重复的roomID
  while (await isRoomExist(roomsCollection, roomInfo.roomID)) {
    roomInfo.roomID = generateRoomID()
  }

  if (!roomInfo.roomName) {
    roomInfo.roomName = `房间 ${roomInfo.roomID}`
  }

  if (roomInfo.creator) {
    roomInfo.members.push(roomInfo.creator)
  }

  let streamID = config.bizid + '_' + roomInfo.creator + '_' + randomstring.generate({
    length: 6,
    charset: '0123456789abcdefghijklmnopqrstuvwxyz'
  })

  roomInfo.streamID = md5(streamID)
  roomInfo.liveAppID = config.liveAppID
  roomInfo.pushUrl = getPushUrl(
    config.pushDomain,
    config.bizid,
    roomInfo.streamID,
    config.pushSecretKey
  )

  roomInfo.playUrl = getPlayUrl(config.playDomain, roomInfo.streamID)

  // 将房间信息写入数据库
  let result = await roomsCollection.add({
    data: roomInfo
  })

  console.log('roomInfo', roomInfo, result)

  return roomInfo
}

exports.createRoom = createRoom