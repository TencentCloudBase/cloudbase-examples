// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let d = {};

  try{
    if(event.text!=""){
      await cloud.callFunction({
        name: 'sectext',
        data: {
          text:event.text
        }
      })
    }
    await db.collection('rundata').where({
      openid: event.userInfo.openId
    }).update({
      data:{
        inrule:event.inrule,
        runtext:event.text,
        Info:event.Info,
        avatarUrl:event.Info.avatarUrl,
        nickname:event.Info.nickName
      }
    });
    d.code = 0;
  }
  catch(e){
    console.log(e);
    d.code = 1;
  }
  return d;
}