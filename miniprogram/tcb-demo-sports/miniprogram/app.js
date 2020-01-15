//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData.rundata = wx.getStorageSync('RunData');
  },
  initRun: function (obj) {
    let that = this;
    wx.cloud.callFunction({
      name:'initRun',
      success(res){
        res.result.other = res.result.other.sort((a,b)=>{return b.Rnow-a.Rnow})
        that.globalData.rundata = res.result;
        wx.setStorageSync('RunData',res.result);
        console.log('init request ID:',res.requestID);
        obj.success();
      },
      fail(e){
        console.error('init request error',e);
        wx.showModal({
          title:"错误",
          content:"初始化错误，请退出小程序检查网络后重新进入",
          showCancel:false
        })
        obj.fail(e);
      }
    })
  },
  globalData:{

  }
})
