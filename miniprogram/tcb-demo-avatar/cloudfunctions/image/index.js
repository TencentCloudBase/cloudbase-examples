// 引入依赖
const cloud = require('wx-server-sdk');
const COS = require('cos-nodejs-sdk-v5');
const got = require('got');
const config = require('./config.js');
const utils = require('./utils.js');

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  /**
   * 获取云函数调用时传递的信息
   */
  let imageUrl = event.avatar;
  let style = event.style;
  /**
   * 下载头像并重新上传
   */
  let filename = `generated/${Math.floor(Math.random() * 10000)}.png`;
  let avatarBuffer = await got(imageUrl, {
    stream: true
  });
  let data = await utils.upFile(avatarBuffer, filename);
  /**
   * 根据文件上传情况进行相应的处理
   */
  if (data.code === 200) {
    return {
      code: 200,
      url: utils.generateURL(data.filename, `head${style}.png`)
    }
  } else {
    return {
      code: 0,
      messge: 'code error'
    }
  }
}