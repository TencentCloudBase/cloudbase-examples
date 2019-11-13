// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //将新帖写入数据库
  try {
    return await db.collection('post_collection').add({
      data: {
        author_id: event.userInfo.openId,
        author_name: event.author_name,
        author_avatar_url: event.author_avatar_url,
        content: event.content,
        is_anonymous: event.is_anonymous,
        image_url: event.image_url,
        publish_time: Date.now(),
        update_time: Date.now(),
        watch_count: 1,//浏览数
      }
    })
  } catch (e) {
    console.error(e)
  }
}