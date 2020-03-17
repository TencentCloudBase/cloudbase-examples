const cloud = require('tcb-admin-node');

cloud.init({
  env: '',//此处填写你的云开发环境ID，需要保证tcb_custom_login.json为同一环境ID下的
  credentials: require('tcb_custom_login.json')
});
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let body = {};
  try{
    if(event.queryStringParameters.number!=null){
      const ids = (await db.collection('admin').where({
        _id:event.queryStringParameters.number
      }).get()).data;
      if(ids.length!=0){
        body.ticket = cloud.auth().createTicket((ids[0]._openid).replace('_',''), {
          refresh: 10 * 60 * 1000
        });//服务端SDK根据customId生成ticket
        body.openid = ids[0]._openid;
        body.code = 0;
      }
    }
  }catch(e){
    body.code = -1;
    body.err = e;
    console.log(e);
  }
  return {//返回集成内容
    statusCode: 200,
    headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin':'*',//配置同源策略为所有
        'Access-Control-Allow-Methods':'*',//配置同源策略方法为全部
        'Access-Control-Max-Age':'3600',
        'Access-Control-Allow-Headers':'Content-Type'
    },
    body: body
};
}