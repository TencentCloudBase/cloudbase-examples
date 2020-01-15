/**
 * 云函数: 删除识别的图片
 * 用途：根据图片地址，将云数据库保存的识别图片进行删除。
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

    //利用数据库where查找，数据集中openid为用户所属的文档，然后使用update进行更新操作
    const userdata = await db.collection('list').where({
      openid: event.userInfo.openId
    }).update({
      data: {
        //_.pull为command能力，含义为将数组中src为event.img的元素删除
        ocrlist: _.pull({
          src: event.img
        })
      }
    });
    //使用云存储能力，根据列表的fileid地址删除文件
    await cloud.deleteFile({
      fileList: [event.img]
    })

    //在处理完全后，返回自定义的code码，表示一定的逻辑含义；在这里code=0为正常成功
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