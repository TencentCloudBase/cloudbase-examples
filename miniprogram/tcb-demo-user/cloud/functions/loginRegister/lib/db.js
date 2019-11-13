// 云端数据库初始化
const { mpAppId, envName } = require('../config/index');
const app = require('tcb-admin-node');

// 定义了users表存放用户信息，status表存放用户登录状态
app.init({
  envName,
  mpAppId
});

module.exports = app.database()
