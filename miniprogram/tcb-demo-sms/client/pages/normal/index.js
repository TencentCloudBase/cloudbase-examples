import regeneratorRuntime from '../../libs/runtime'
import TcbService from '../../libs/tcb-service-mp-sdk/index'
let tcbService = new TcbService()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '普通短信通知',
    type: 'SmsSingleSendTemplate',
    phoneNumber: ''
  },

  recordPhoneNumber(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  typeChange(e) {
    this.setData({
      type: e.detail.value
    })
  },

  async sendSMS() {
    let data = {}
    let {
      type,
      phoneNumber
    } = this.data

    if (type === 'SmsSingleSendTemplate') {
      data.phoneNumber = phoneNumber
    }
    else if (type === 'SmsMultiSend') {
      data.phoneNumbers = phoneNumber.split(',')
    }
    else if (type === 'SmsMultiSendTemplate') {
      data.phoneNumbers = phoneNumber.split(',')
    }

    let result = await tcbService.callService({
      service: 'sms',
      action: type,
      data
    })

    console.log(result)

    if (!result.code) {
      wx.showToast({
        title: '发送短信成功',
        icon: 'none'
      })
    }
    else {
      wx.showToast({
        title: '发送短信失败',
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