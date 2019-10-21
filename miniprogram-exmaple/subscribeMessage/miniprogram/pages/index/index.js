//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },


  shouqan: function () {
    wx.requestSubscribeMessage({
      tmplIds: [ '8rxAIKK5CDT7cJaXKIPF6L41jul55DQjBXw1LeZFd_U'],
      success: console.log,
      fail: console.error
    })

  },


})