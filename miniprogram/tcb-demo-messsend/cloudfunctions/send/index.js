const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    let now = new Date();
    console.log(now);
    const messages = await db.collection('messages').where({
        done: false,
        date: _.lt(now)
      }).get();
    console.log(messages);
    // 循环消息列表
    /*【开始】-----------------【代码实战位置C-1】-----------------【开始】*/
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: message.data,
          templateId: message.templateId,
        });
        // 发送成功后将消息的状态改为已发送
        return db.collection('messages').doc(message._id).update({
            data: {
              done: true,
            },
          });
      } catch (e) {
        return e;
      }
    });
    /*【结束】-----------------【代码实战位置C-1】-----------------【结束】*/
    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};
