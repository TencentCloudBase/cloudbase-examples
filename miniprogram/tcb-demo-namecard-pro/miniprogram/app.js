//app.js
App({
  onLaunch: function () {
    // 初始化云开发环境
    wx.cloud.init({
      traceUser: true
    });
    this.userinit(()=>{});
  },
  userinit(succ){
    // 初始化用户加载
    let that = this;
    wx.cloud.callFunction({
      name: 'init'
    }).then(res => {
      console.log(res);
      that.globalData.id = res.result.id;
      that.globalData.list = res.result.list;
      succ();
    })
  },
  globalData: {
    id:null,
    list:[]
  }
});