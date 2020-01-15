// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const userdata = (await db.collection('rundata').where({
    openid: event.userInfo.openId
  }).get()).data;

  let stepobj={};
  let runauth=true;
  if(event.mess!=null){
    event.mess.data.stepInfoList.map(step=>{
      if(step.step!=0){
        stepobj[step.timestamp]={
          step:step.step,
          time:new Date((step.timestamp)*1000)
        }
      }
    })
  }
  else{
    runauth=false;
  }
  
  if (userdata.length != 0) {
    await db.collection('rundata').doc(userdata[0]._id).update({
      data:{
        rundata:stepobj,
        runauth:runauth
      }
    })
  }
  return stepobj;
}