// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

const db = cloud.database()

const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  //更新帖子浏览数
  await db.collection('post_collection').where({
    _id: event.postid
  }).update({
    data: {
      watch_count: _.inc(1)
    },
    success: function (res) {
      console.log(res.data)
    }
  })
}