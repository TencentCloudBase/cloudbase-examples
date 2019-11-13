// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from '../../../libs/runtime.js'
import TcbService from '../../../libs/tcb-service-js-sdk/index'
let tcbService = new TcbService(wx.cloud)

Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    roomList: [],
    tapTime: '',
    tapJoinRoom: false
  },

  // 拉取房间列表
  async getRoomList() {
    try {
      let res = await tcbService.callService({
        service: 'video',
        action: 'webrtcroom-get-room-list',
        data: {
          skip: 0,
          limit: 20
        }
      })

      if (!res || res.code) {
        throw new Error(res.errMsg)
      }
    
      this.setData({
        roomList: res.data
      });
    }
    catch(e) {
      wx.showToast({
        title: '拉取房间列表失败，请重试',
        icon: 'none'
      })
    }
  },

  // 创建房间，进入创建页面
  create() {
    // 防止两次点击操作间隔太快
    let nowTime = new Date();

    if (nowTime - this.data.tapTime < 1000) {
      return;
    }

    let url = `../join-room/index?type=createByID`
    wx.navigateTo({
      url: url
    });

    this.setData({
      'tapTime': nowTime
    });
  },

  // 进入 webrtcroom 页面
  goToRoom(e) {
    let dataset = e.currentTarget.dataset
    // 防止两次点击操作间隔太快
    let nowTime = new Date()
    if (nowTime - this.data.tapTime < 1000) {
      return
    }

    let url = `../room/index?roomID=${dataset.roomid}`

    if (!this.data.tapJoinRoom) { // 如果没有点击进入房间
      this.data.tapJoinRoom = true;
      wx.navigateTo({
        url: url,
        complete: () => {
          this.data.tapJoinRoom = false; // 不管成功还是失败，重置tapJoinRoom
        }
      })
    }

    this.setData({
      'tapTime': nowTime
    })
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad(options) {
    this.getRoomList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setTimeout(() => {
      this.getRoomList()
    }, 2000)
  },

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh: function () {
    this.getRoomList()
    wx.stopPullDownRefresh()
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