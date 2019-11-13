//app.js
const util = require('./utils/util.js');  
App({
  onLaunch: function () {
    var that = this
    wx.clearStorage()

    //初始化云开发能力

  },

  globalData: {
    userInfo: "StorageUserInfo",
    wechatNickName: '',
    wechatAvatarUrl: ''
  }
})