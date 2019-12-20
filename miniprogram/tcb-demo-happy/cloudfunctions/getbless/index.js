const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  let ibless = (await db.collection('happy').doc('mess').get()).data.bless;
  let lucky = Math.floor(Math.random() * ibless.length);
  return ibless[lucky];
}