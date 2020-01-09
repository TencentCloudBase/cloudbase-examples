const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    /*【开始】-----------------【代码实战位置B-1】-----------------【开始】*/
    const result = await db.collection('messages').add({
      data: {
        touser: event.userInfo.openId,
        page: 'index',
        data: event.data,
        templateId: event.templateId,
        date: new Date(event.date),
        done: false,
      },
    });
    return result;
    /*【结束】-----------------【代码实战位置B-1】-----------------【结束】*/
  } catch (err) {
    console.log(err);
    return err;
  }
};
