//app.js
const util = require('./utils/util.js');  
App({
  onLaunch: function () {
    var that = this
    wx.clearStorage()

    //Delete Start
    //初始化云开发能力，需要删除
    wx.cloud.init({
      traceUser: true
    })
    //Delete End
  },

  globalData: {
    userInfo: "StorageUserInfo",
    wechatNickName: '',
    wechatAvatarUrl: ''
  }
})