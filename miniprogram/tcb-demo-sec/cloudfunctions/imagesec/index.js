const cloud = require('wx-server-sdk');
cloud.init()

exports.main = async (event, context) => {
  const imgmsg = (await cloud.downloadFile({
    fileID: event.img,
  })).fileContent;

  return cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: imgmsg
      }
    })
}