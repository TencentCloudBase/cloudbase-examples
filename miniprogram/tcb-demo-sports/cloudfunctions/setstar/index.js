// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const user = (await db.collection('rundata').doc(event.ta).get()).data;
  
  if(user.star==null||user.star.indexOf(event.userInfo.openId)==-1){
    if(event.flag==false){
      await db.collection('rundata').doc(event.ta).update({
        data:{
          star:_.push(event.userInfo.openId)
        }
        
      });
      return {
        num:user.star?user.star.length+1:0+1,
        status:1
      }
    }
    else{
      return {
        num:user.star?user.star.length:0,
        status:0
      }
    }
  }
  else{
    if(event.flag==true){
      await db.collection('rundata').doc(event.ta).update({
        data:{
          star:_.pull(event.userInfo.openId)
        }
      });
      return {
        num:user.star?user.star.length-1:0,
        status:0
      }
    }
    else{
      return {
        num:user.star?user.star.length:0,
        status:1
      }
    }
  }
}