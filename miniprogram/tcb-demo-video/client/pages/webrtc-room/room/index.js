// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from '../../../libs/runtime.js'
import TcbService from '../../../libs/tcb-service-js-sdk/index'
let tcbService = new TcbService(wx.cloud)
const app = getApp()
const plugin = requirePlugin("webRtcRoomPlugin");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    template: '1v1bigsmall',
    aspect: '16:9',
    webrtcroomComponent: null,
    roomID: '', // 房间id
    roomName: '',
    beauty: 5,
    muted: false,
    debug: false,
    frontCamera: true,
    userID: '',
    userSig: '',
    sdkAppID: '',
    comment: [],
    autoplay: true,
    enableCamera: true,
    showRoom: false,

    pusherBackgroundImg: 'https://main.qcloudimg.com/raw/0e5160f27794db3dd6484f2778bcbb17.jpg',
    waitingImg: 'https://main.qcloudimg.com/raw/4518d7dd552b3b3fdaff5dfcbb74a52d.gif',
    playerBackgroundImg: 'https://main.qcloudimg.com/raw/0e5160f27794db3dd6484f2778bcbb17.jpg',
    loadingImg: 'https://main.qcloudimg.com/raw/4518d7dd552b3b3fdaff5dfcbb74a52d.gif',
  },

  /**
   * 监听房间事件
   */
  bindRoomEvent(e) {
    var self = this;
    switch (e.detail.tag) {
      case 'error':
        if (e.detail.code === -10) { // 进房失败，一般为网络切换的过程中
          wx.showModal({
            title: '提示',
            content: e.detail.detail,
            confirmText: '重试',
            cancelText: '退出',
            success: (res) => {
              if (res.confirm) {
                this.joinRoom();
              } else if (res.cancel) { //
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          })
        }
        else {
          // 在房间内部才显示提示
          console.error("error:", e.detail.detail);
          wx.showModal({
            title: '提示',
            content: e.detail.detail,
            showCancel: false,
            complete: () => {
              wx.showToast({
                title: `code:${e.detail.code} content:${e.detail.detail}`
              });
              wx.navigateBack({
                delta: 1
              });
            }
          })
        }
        break;
    }
  },

  /**
   * 切换摄像头
   */
  changeCamera: function () {
    this.data.webrtcroomComponent.switchCamera();
    this.setData({
      frontCamera: !this.data.frontCamera
    })
  },

  onEnableCameraClick: function () {
    this.setData({
      enableCamera: !this.data.enableCamera
    });
  },

  /**
   * 设置美颜
   */
  setBeauty: function () {
    let beauty = (this.data.beauty == 0 ? 5 : 0);
    this.setData({
      beauty
    });
  },

  /**
   * 切换是否静音
   */
  changeMute: function () {
    this.setData({
      muted: !this.data.muted
    });
  },

  /**
   * 是否显示日志
   */
  showLog: function () {
    this.setData({
      debug: !this.data.debug
    });
  },

  /**
   * 进入房间
   */
  async joinRoom() {
    
    wx.showToast({
      icon: 'none',
      title: '房间初始化中'
    });

    let {
      roomID,
      roomName
    } = this.data

    try {
      // let res = await webrtcroom.enterRoom({
      //   roomID,
      //   roomName, 
      // })
      let res = await tcbService.callService({
        service: 'video',
        action: 'webrtcroom-enter-room',
        data: {
          roomID,
          roomName
        }
      })

      if (!res || res.code) {
        throw new Error(res.errMsg)
      }    

      console.log('进入房间', res)

      let {
        roomInfo,
        signInfo
      } = res.data

      this.setData({
        roomID: roomInfo.roomID,
        roomName: roomInfo.roomName,
        userID: signInfo.userID,
        userSig: signInfo.userSig,
        sdkAppID: signInfo.sdkAppID,
        privateMapKey: signInfo.privateMapKey,
        showRoom: true,
      }, () => {
        this.data.webrtcroomComponent = plugin.instance.getWebrtcRoomInstance();
        this.data.webrtcroomComponent.start()

        // 设置房间标题
        wx.setNavigationBarTitle({
          title: `${roomInfo.roomName}`
        })
      })
    }
    catch(e) {
      console.error(e, '进入房间失败')
      this.bindRoomEvent({
        detail: {
          tag: 'error',
          code: 20001,
          detail: '进入房间失败'
        }
      })
    }
  },

  async quitRoom() {
    // let res = await webrtcroom.quitRoom(this.data.userID, this.data.roomID);
    
    let res = await tcbService.callService({
      service: 'video',
      action: 'webrtcroom-quit-room',
      data: {
        userID: this.data.userID,
        roomID: this.data.roomID
      }
    })
  
    if (!res.code) {
      wx.showToast({
        title: '退出房间成功',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      roomID,
      roomName
    } = options

    this.setData({
      roomID: roomID || '',
      roomName: roomName || '',
    }, async () => {
      await this.joinRoom();
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('room.js onShow');
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('room.js onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('room.js onUnload');
    this.quitRoom()
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
  },

})