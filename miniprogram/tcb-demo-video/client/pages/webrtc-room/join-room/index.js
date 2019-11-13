Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    roomName: '',
    roomID: '',
    roomType: 'roomID',
    tapTime: ''
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
      template,
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
  onLoad(options) {
    
  },

	/**
	 * 用户点击右上角分享
	 */
  onShareAppMessage: function () {
    return {
      title: '小程序·云开发音视频解决方案',
      path: '/pages/index/index',
    }
  },
})