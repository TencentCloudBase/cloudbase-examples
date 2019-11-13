//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      traceUser: true
    });
  },
  globalData: {
    blog: {}
  }
});
