// 文档
// 服务端开放接口：https://developers.weixin.qq.com/minigame/dev/api-backend/open-api/sec-check/security.msgSecCheck.html
// 云调用开发接口：https://developers.weixin.qq.com/minigame/dev/wxcloud/guide/openapi/openapi.html#%E4%BA%91%E8%B0%83%E7%94%A8

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.getWXContext().ENV
})

exports.main = async (event, context) => {
  // 演示2：调用openapi的内容检查能力
  // todo：
}