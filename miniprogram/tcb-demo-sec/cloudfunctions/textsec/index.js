const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  return await cloud.openapi.security.msgSecCheck({
    content:event.text
  })
}