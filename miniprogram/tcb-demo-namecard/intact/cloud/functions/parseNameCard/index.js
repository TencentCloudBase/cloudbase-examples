const {
  ImageClient
} = require('image-node-sdk')

const {
  AppId,
  SecretId,
  SecretKey
} = require('./config/index.js');

const imgClient = new ImageClient({
  AppId,
  SecretId,
  SecretKey,
});

exports.main = async (event) => {
  const res = await imgClient.ocrBizCard({
    data: {
      url_list: [event.url],
    },
  });
  return JSON.parse(res.body).result_list[0];
}