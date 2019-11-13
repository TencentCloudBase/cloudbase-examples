// app.js
App({
  onLaunch: function() {
    wx.cloud.init({
      traceUser: true,
      envId: "royhyang-test-lp1jk"
    });
  },
  globalData: {
    userInfo: null,
    temUrl:'',
    fileID:'',
    rect: null,
    filterTemUrl:''
  }
});
