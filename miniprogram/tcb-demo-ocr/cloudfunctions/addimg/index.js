/**
 * 云函数：添加并识别图片
 * 用途：使用云调用识别文字能力，将小程序端上传的图片进行文字识别，将文字图片信息上传云数据库进行保存。
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
    /*  此代码段用于解析云存储File ID为url，用于之后的业务逻辑使用
        event.img为小程序端的请求数据，为上传的图片fileid
        在正常业务中应该选择使用cloud.getTempFileURL()来获取临时url返回给用户 */
    let first = event.img.indexOf('.');
    let end = event.img.indexOf('/', first);
    let httpsrc = 'https://' + event.img.slice(first + 1, end) + '.tcb.qcloud.la/' + event.img.slice(end + 1, event.img.length);
    //解析云存储ID为url代码片段结束

    //云调用能力，进行图片转换文字请求，相比于正常http请求，免除鉴权流程，整个代码逻辑更加轻便。
    let result = null;
      
    try{
      /*==================从这里开始修复==========================*/
      /* 当result=-1时会在前端显示识别失败！                       */
      /* result应该是文字识别的结果集，它应该使用云开发的云调用能力  */
      result = -1;
      /* 我们将37行代码替换为以下代码，result获得文字识别云调用结果  */

      // result = await cloud.openapi.ocr.printedText({
      //   type: 'photo',
      //   imgUrl: httpsrc
      // })

      /*==================到这里修复结束==========================*/
      /* 当你修改完成后，在左边文件栏，右键点击此代码所在的文件夹     */
      /* 在出现的列表里，点击【上传并部署：云端安装依赖】            */
      /* 等待部署成功，你可以重新尝试上传图片操作，一定可以成功      */
    }
    catch (err) {
      console.log(err);
      result = -1;//约定信息，表示识别无效
    }

    //构建对象，承载云调用结果和图片信息
    var obimg = {};
    obimg.src = event.img;//图片地址
    obimg.content = result;//识别结果

    //根据用户的openid，存入上边识别的图片信息
    await db.collection('list').where({
      openid: event.userInfo.openId
    }).update({
      data: {
        //_.push为云开发数据库中的command操作，含义为往数组中增加传入元素数据。
        ocrlist: _.push([obimg])
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