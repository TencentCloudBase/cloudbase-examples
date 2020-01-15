// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let d={};
  const userdata = (await db.collection('rundata').where({
    openid: event.userInfo.openId
  }).get()).data;
  if (userdata.length != 0) {
    const oldimg = userdata[0].perimg?userdata[0].perimg:null;
    try{
      await cloud.callFunction({
        name: 'secimg',
        data: {
          img:event.img
        }
      })
      await db.collection('rundata').where({
        openid: event.userInfo.openId
      }).update({
        data:{
          perimg:event.img
        }
      });
      if(oldimg!=null){
        await cloud.deleteFile({
          fileList: [oldimg]
        })
      }
      d.code = 0;
      d.img = event.img;
    }
    catch(e){
      console.log(e);
      await cloud.deleteFile({
        fileList: [event.img]
      });
      d.code = 1;
      d.img = oldimg;
    }
  }
  else{
    d.code=-1;
  }
  return d;
}