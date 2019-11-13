const {
  genPrivateMapKey,
  gzcompressSync,
  genUserSig
} = require('./libs/sign')
// 云函数入口文件
const config = require('./config')

function sign({ userID, roomID }) {

  let signInfo = {}

  // private_key 不能被下载
  let privateKey = config.privateKey;
  console.log(`privateKey: ${privateKey}`)

  let sdkAppID = config.sdkAppID
  let accountType = config.accountType

  if (roomID) {
    let privateMapKey = genPrivateMapKey({
      userID: userID,
      sdkAppID: sdkAppID,
      accountType: accountType,
      roomID: roomID,
      priKey: privateKey
    })

    signInfo.privateMapKey = gzcompressSync(privateMapKey)
    console.log(`signInfo.privateMapKey: ${signInfo.privateMapKey}`)
  }

  let userSig = genUserSig({
    userID: userID,
    sdkAppID: sdkAppID,
    accountType: accountType,
    priKey: privateKey
  })
  console.log(`userSig: ${userSig}`)

  signInfo.userSig = gzcompressSync(userSig)
  console.log(`signInfo.userSig: ${signInfo.userSig}`)

  signInfo.userID = userID
  signInfo.sdkAppID = sdkAppID

  return signInfo
}

exports.sign = sign