const cloud = require('wx-server-sdk');
const doneSID = 'Xw4e3cMQ3Bp2Fm2B4xaPZ213BicUK1CeozGoBUrcBDA';

cloud.init();
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    let now = new Date(new Date().getTime()+28800000);
    const messages = await db.collection('food').where({
        state : 1,
        donetime: _.lt(now)
      }).get();

    const sendPromises = messages.data.map(async message => {
      try {
        if(message.doneMess==true){
          await cloud.openapi.subscribeMessage.send({
            touser: message.userID,
            page: 'index',
            data: message.doneContent,
            templateId: doneSID,
          });
        }
        return db.collection('food').doc(message._id).update({
            data: {
              state: 2
            },
          });
      } catch (e) {
        return e;
      }
    });
    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};