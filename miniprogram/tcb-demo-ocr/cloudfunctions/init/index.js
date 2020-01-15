/**
 * 云函数：初始化列表
 * 用途：根据用户的唯一openid构建数据库文档，用于存储用户的信息；每次调用时都要返回存储的信息。
 */
const cloud = require('wx-server-sdk')

//云开发初始化
cloud.init();

//将云开发数据库能力声明给db
const db = cloud.database();

//云函数运行主函数，为异步函数
exports.main = async (event, context) => {

  //声明一个mess，用于承载函数执行结果用于返回
  var mess = {};
  try {
    
    //利用数据库where查找，数据集中openid为用户所属的文档
    const userdata = (await db.collection('list').where({
      openid: event.userInfo.openId
    }).get()).data;

    //如果length不等于0，则证明存在用户所属文档
    if (userdata.length != 0) {

      //将用户的识别列表读取出来
      mess.list = userdata[0].ocrlist;
      //将文档id取出，用于小程序端上传图片时的文件夹命名。由于安全性，不可以将openid传给小程序端
      mess.id = userdata[0]._id;
      //正常标志code=0
      mess.code = 0;
    }
    //如果length等于0，则没有用户文档需要创建
    else {

      //使用数据库add增加，根据data传入的JSON对象进行构建，返回的为构建的信息，包含文档id
      let result = await db.collection('list').add({
        data: {
          openid: event.userInfo.openId,
          ocrlist: []
        }
      });

      //将文档id取出
      mess.id = result._id;
      //新建则识别列表为空
      mess.list = [];
      //正常标志code=0
      mess.code = 0;
    }
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