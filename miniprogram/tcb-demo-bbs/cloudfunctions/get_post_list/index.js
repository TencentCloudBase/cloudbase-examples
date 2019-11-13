// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    // 获取帖子列表
    postlist: await db.collection('post_collection').field({
      _id: true,
      content: true,
      watch_count: true,
      update_time: true,
      author_name: true,
      is_anonymous: true,
    }).orderBy('update_time', 'desc').get()

  }
}