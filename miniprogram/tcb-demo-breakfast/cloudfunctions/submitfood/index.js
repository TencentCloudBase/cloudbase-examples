const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try{
    const AFood = (await db.collection('food').doc('ADMIN').get()).data;
    console.log(AFood);
  
    var foodData={
      Info:event.Info,
      Address:event.Address,
      stateMess:event.stateMess,
      doneMess:event.doneMess
    };

    let nowtime = new Date(new Date().getTime()+28800000);
    
    foodData.state = 0;
    foodData.submittime = nowtime;
    foodData.SID = event.userInfo.openId.slice(0,4)+nowtime.getTime();
    foodData.userID = event.userInfo.openId;
    foodData.statetime = new Date(Date.parse(nowtime) + 5000);
    foodData.donetime = new Date(Date.parse(nowtime) + 15000);
  
    if(event.stateMess==true){
      foodData.stateContent={
        character_string6:{
          value:foodData.SID
        },
        date3:{
          value:formdate(foodData.submittime)
        },
        thing12:{
          value:event.Address.detailInfo.slice(0,20)
        },
        date13:{
          value:formdate(foodData.donetime)
        },
        phone_number11:{
          value:AFood.tel
        }
      }
    }
    if(event.doneMess==true){
      foodData.doneContent={
        character_string1:{
          value:foodData.SID
        },
        amount2:{
          value:AFood.price+'元'
        },
        phrase3:{
          value:'配送完成'
        },
        date4:{
          value:formdate(foodData.donetime)
        }
      }
    }
    const result = await db.collection('food').add({
      data:foodData
    });

    return {
      code:0,
      res:result
    }
  }
  catch(e){
    console.log(e);
    return {
      code:-1
    }
  }
}

function formdate(date){
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var date1 = date.getDate();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  return year + "年" + month + "月" + date1 + "日 " + hour + ":" + minutes;
}