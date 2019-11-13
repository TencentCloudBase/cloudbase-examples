//app.js
App({
  onLaunch: function () {
    // 初始化云开发环境
    wx.cloud.init({
      traceUser: true
    });
  },
  globalData: {
    namecard: {}
  }
});
