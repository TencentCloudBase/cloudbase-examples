// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

const db = cloud.database()

const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  //更新帖子浏览数

}