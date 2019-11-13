// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()
/**
 * 在此处设置数据库环境会导致每个云函数都需要手动设置，不能一次修改，十分麻烦
 * 一种方法是在小程序端传入环境参数，可以把环境集中在小程序的globalData中管理
 */
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const timestamp = Date.now()
    // 更新帖子最后更新时间
    await db.collection('post_collection').where({
      _id: event.postid
    })
    .update({
      data: {
        update_time: timestamp
      }
    })
    
    await db.collection('comment_collection').add({
      data: {
        postid: event.postid,//评论对应的post
        openid: event.userInfo.openId,
        name: event.name,//评论者名字
        avatarUrl: event.avatarUrl,//评论者头像
        time: timestamp,//评论发生的时间
        content: event.content//评论内容
      }
    })
  } catch (e) {
    console.error(e)
  }
}