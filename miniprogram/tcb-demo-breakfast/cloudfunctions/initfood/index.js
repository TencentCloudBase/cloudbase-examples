const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try{
    const AFood = (await db.collection('food').doc('ADMIN').get()).data;

    const User = (await db.collection('food').where({
      userID:event.userInfo.openId
    }).get()).data

    if(User.length != 0){
      return {
        Food:AFood,
        state:User[0].state,
        submittime:User[0].submittime,
        SID:User[0].SID,
        statetime:User[0].statetime!=null?User[0].statetime:null,
        donetime:User[0].donetime!=null?User[0].donetime:null
      }
    }
    else{
      //判断用户是否被禁止预定，此为手动添加
      if(AFood.ban.indexOf(event.userInfo.openId)==-1){
        return {
          Food:AFood,
        }
      }
      else{
        return 1
      }
    }
  }
  catch(e){
    console.log(e);
    return -1
  }
}