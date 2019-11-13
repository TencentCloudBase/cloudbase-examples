Page({
  /**
   * 页面的初始数据
   */
  data: {
    roomName: '',
    roomID: '',
    roomType: 'roomID',
    tapTime: '',    // 防止两次点击操作间隔太快
  },

  // 选择输入房间号还是房间名
  radioChange: function (e) {
    this.setData({
      roomType: e.detail.value
    })
  },

  // 绑定输入房间号输入框
  bindRoomID: function (e) {
    this.setData({
      roomID: e.detail.value
    });
  },

  // 绑定输入房间名输入框
  bindRoomName: function (e) {
    this.setData({
      roomName: e.detail.value
    });
  },

  // 进入rtcroom页面
  joinRoom() {
    let {
      roomType,
      roomID,
      roomName,
      tapTime,
    } = this.data
    // 防止两次点击操作间隔太快
    let nowTime = new Date();
    if (nowTime - tapTime < 1000) {
      return;
    }

    if (roomType === 'roomID') {
      roomName = ''
      if (!roomID) {
        wx.showToast({
          title: '请输入房间号',
          icon: 'none',
          duration: 2000
        })
        return
      }

      if (/^\d\d+$/.test(roomID) === false) {
        wx.showToast({
          title: '只能为数字',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    else {
      roomID = ''
      if (!roomName) {
        wx.showToast({
          title: '请输入房间名',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }

    let url = `../room/index?roomID=${roomID}&roomName=${roomName}`

    wx.redirectTo({
      url: url
    })

    this.setData({ 'tapTime': nowTime })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '小程序·云开发音视频解决方案',
      path: '/pages/index/index',
    }
  }
})