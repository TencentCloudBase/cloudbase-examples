const {
  ImageClient
} = require('image-node-sdk')//引用image-node-sdk包，在他处使用前需要npm install

const {
  AppId,
  SecretId,
  SecretKey
} = require('./config.js');//这是腾讯云的密钥信息，在他处使用前需要在自己账号中获取

const imgClient = new ImageClient({
  AppId,
  SecretId,
  SecretKey,
});

exports.main = async (event) => {
  /*【开始】=====================【代码实战位置B-1】=====================【开始】*/
  const res = await imgClient.ocrBizCard({
    data: {
      url_list: [event.url],
    },
  });
  return JSON.parse(res.body).result_list[0];
  /*【结束】=====================【代码实战位置B-1】=====================【结束】*/
}

