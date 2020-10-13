//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 请换成你的云开发环境ID
        env: 'tcb-barrage-sample-n7k0k',
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})
