/**
 * 云函数：添加识别的名片
 * 用途：将名片图片信息上传云数据库进行保存。
 */
const cloud = require('wx-server-sdk')

//云开发初始化
cloud.init();

//将云开发数据库能力声明给db
const db = cloud.database();

//将云开发数据库command能力声明给 _
const _ = db.command;

//云函数运行主函数，为异步函数
exports.main = async (event, context) => {

  //声明一个mess，用于承载函数执行结果用于返回
  var mess = {};
  try {
    await db.collection('list').where({
      openid: event.userInfo.openId
    }).update({
      data: {
        list: _.push([event.card])
      }
    });
    mess.code = 0;
  }
  catch (e) {
    //当发生错误时，如解构FileID等，将执行此代码段，code=-1为异常
    console.log(e);
    mess.code = -1;
    mess.err = e;
  }
  //返回mess给前端
  return mess;
}