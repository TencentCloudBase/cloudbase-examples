// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  let d={};

  const userdata = (await db.collection('rundata').where({
    openid: event.userInfo.openId
  }).get()).data;

  if (userdata.length != 0) {
    d.rundata = userdata[0].rundata;
    d.runauth = userdata[0].runauth;
    d.runimg = userdata[0].perimg?userdata[0].perimg:null;
    d.runtext = userdata[0].runtext?userdata[0].runtext:"";
    d.runinrule = userdata[0].inrule
    d.id = userdata[0]._id;
    d.avatarUrl = userdata[0].avatarUrl?userdata[0].avatarUrl:null;
    d.nickname = userdata[0].nickname?userdata[0].nickname:null;
  }
  else{
    let result = await db.collection('rundata').add({
      data:{
        openid: event.userInfo.openId,
        runauth:false,
        inrule:false
      }
    })
    d.run = null;
    d.runauth = false;
    d.runimg = null;
    d.runtext = "";
    d.runinrule = false;
    d.id = result._id;
  }
  let other = (await db.collection('rundata').where({
    inrule:true,
    // openid:_.neq(event.userInfo.openId)
  }).field({
    perimg:true,
    runtext:true,
    avatarUrl:true,
    nickname:true,
    rundata:true
  }).get()).data;

  let tempnow = new Date(new Date().getTime()+28800000);

  let nowlocal = tempnow.toLocaleDateString();

  let nowdate=new Date(nowlocal);

  console.log('当前时间',tempnow,'0点时间',nowlocal,nowdate);
  for(let c in other){
    let temp={};
    let Rdata=[];
    let Rdate=[];
    let rundata = other[c].rundata;
    for(let i =6;i>=0;i--){
      let tim = new Date(nowdate.getTime()-28800000-86400000*i);
      let runtemp = rundata[parseInt(tim.getTime()/1000)];
      let runitem = runtemp?runtemp.step:0;
      Rdata.push(runitem);
      Rdate.push(i==6?(tim.getMonth())+1+'.'+tim.getDate():tim.getDate());

      if(i==0){
        other[c].Rnow = runitem;
      }
    }
    temp.Rdata = Rdata;
    temp.Rdate = Rdate;
    other[c].rundata=temp;
  }
  d.other = other;

  return d;
}