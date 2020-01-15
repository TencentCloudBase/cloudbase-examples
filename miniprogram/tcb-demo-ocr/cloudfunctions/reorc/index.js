/**
 * 云函数: 重新识别图片
 * 用途：根据图片地址，重新使用云调用能力识别图片，并更新数据库的存储。
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
  var mess = {};
  try {
    //首先先删除数据库中的该元素
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

    /*  此代码段用于解析云存储File ID为url，用于之后的业务逻辑使用
        event.img为小程序端的请求数据，为上传的图片fileid
        在正常业务中应该选择使用cloud.getTempFileURL()来获取临时url返回给用户 */
    let first = event.img.indexOf('.');
    let end = event.img.indexOf('/', first);
    let httpsrc = 'https://' + event.img.slice(first + 1, end) + '.tcb.qcloud.la/' + event.img.slice(end + 1, event.img.length);
    //解析云存储ID为url代码片段结束

    //云调用能力，进行图片转换文字请求，相比于正常http请求，免除鉴权流程，整个代码逻辑更加轻便。
    let result = null;
    try {
      result = await cloud.openapi.ocr.printedText({
        type: 'photo',
        imgUrl: httpsrc
      })
    } catch (err) {
      //当正常业务操作出现问题，比如云调用超过限制则执行此代码段 
      console.log(err);
      result = -1;//约定信息，表示识别无效
    }

    //构建对象，承载云调用结果和图片信息
    var obimg = {};
    obimg.content = result;
    obimg.src = event.img;

    //根据用户的openid，存入上边识别的图片信息
    await db.collection('list').where({
      openid: event.userInfo.openId
    }).update({
      data: {
        //_.push为云开发数据库中的command操作，含义为往数组中增加传入元素数据。
        ocrlist: _.push([obimg])
      }
    });

    //在处理完全后，返回自定义的code码，表示一定的逻辑含义；在这里code=0为正常成功
    mess.code = 0;
    //将重新识别的文字信息也返回，用于即时展示
    mess.content = result;
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