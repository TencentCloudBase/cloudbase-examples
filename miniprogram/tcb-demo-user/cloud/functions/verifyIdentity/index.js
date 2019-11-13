const db = require('./lib/db');
const Res = require('./lib/res');
// 登录后调用的函数，并返回当前用户的信息
/**
 * 
 * @param {string} event.session 用户的session 
 */
exports.main = async function (event) {
  const { session } = event
  // status集合中保存用户当前的登录状态信息
  const statusCollection = db.collection('status')

  // user集合存放用户的头像性别信息等
  const userCollection = db.collection('users')

  // session对应的登录状态
  const status = await statusCollection.where({ session }).get()

  if (status.data[0]) {
    if (Date.now() <= status.data[0].timeout) {
      // 登录状态有效，返回用户对应的信息
      const user = await userCollection
        .where({ openid: status.data[0].openid })
        .get()
      const { avatarUrl, gender, nickName } = user.data[0]
      return new Res({
        message: '调用成功',
        data: { avatarUrl, gender, nickName }
      })
    } else {
      // 过期清除当前session
      await statusCollection.doc(status.data[0]._id).remove()
      return new Res({ code: 401, message: '调用失败' })
    }
  } else {
    // 当前session不存在
    return new Res({ code: 401, message: '调用失败' })
  }
}
