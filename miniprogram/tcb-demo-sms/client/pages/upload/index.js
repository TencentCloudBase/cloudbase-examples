import regeneratorRuntime from '../../libs/runtime'
import TcbService from '../../libs/tcb-service-mp-sdk/index'
let tcbService = new TcbService(wx.cloud)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '上传语音文件',
    fileID: '',
    fid: ''
  },

  recordFileID(e) {
    this.setData({
      fileID: e.detail.value
    })
  },

  async upload() {
    let fileID = this.data.fileID

    if (!fileID) {
      return wx.showToast({
        title: 'fileID不能为空',
        icon: 'none'
      })
    }

    let result = await tcbService.callService({
      service: 'sms',
      action: 'VoiceFileUpload',
      data: {
        fileID
      }
    })

    if (!result.code) {
      let data = result.data
      this.setData({
        fid: data.fid
      })
    }
    else {
      wx.showToast({
        title: '上传文件失败',
        icon: 'none'
      })
    }

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

  }
})