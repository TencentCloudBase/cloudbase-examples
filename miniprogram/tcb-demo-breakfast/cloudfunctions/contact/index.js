// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);

  let content = "收到消息，将在稍后打电话处理"

  if(event.Content.indexOf('取消')!=-1){
    await db.collection('food').where({
      userID:event.userInfo.openId
    }).remove();
    content='已经成功删除'
  }
  
  
  await cloud.openapi.customerServiceMessage.send({
    touser: event.userInfo.openId,
    msgtype: 'text',
    text: {
      content: content,
    },
  })

  return 'success'
}