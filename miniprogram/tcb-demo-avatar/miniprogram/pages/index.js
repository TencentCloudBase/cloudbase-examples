Page({

  data: {

  },
  getInfo: function(e) {
    wx.showLoading({
      title: '头像生成中',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name:'image',
      data:{
        avatar: e.detail.userInfo.avatarUrl, // 头像获取自 userInfo
        style: e.target.dataset.style // style 可以取值 1 ～ 4
      }
    }).then(res => {
      this.setData({
        avatarUrl:res.result.url
      },res => {
        wx.hideLoading();
      })
    })
  }
})