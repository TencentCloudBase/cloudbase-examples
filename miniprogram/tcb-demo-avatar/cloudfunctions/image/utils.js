const config = require('./config.js');
const COS = require('cos-nodejs-sdk-v5');

var cos = new COS({
  SecretId: config.COS_SECRETID,
  SecretKey: config.COS_SECRETKEY
});

/**
 * 用于上传文件的函数
 */
function upFile(buffer, filename) {
  return new Promise((reslove, reject) => {
    cos.putObject({
      Bucket: config.BUCKET,
      /* 必须 */
      Region: config.REGION,
      /* 必须 */
      Key: filename,
      /* 必须 */
      Body: buffer,
      /* 必须 */
    }, function (err, data) {
      if (err) {
        reject({
          code: 0,
          message: 'upload rror'
        });
      }
      if (data) {
        console.log(data);
        reslove({
          code: 200,
          url: data.Location,
          filename: filename
        })
      }
    });
  });
}

/**
 * 用于生成 Base64 的函数
 */
function encode64(str) {
  return new Buffer(str).toString('base64')
}

/**
 * 用于拼接出数据万象的 URL 的函数
 */
function generateURL(filename, avatarname) {
  return `https://${config.DOMAIN}/${filename}?watermark/1/image/${encode64('http://' + config.DOMAIN +'/'+ avatarname)}/blogo/1`
}

module.exports = {
  upFile, generateURL
}