import regeneratorRuntime from '../../libs/runtime'
import TcbService from '../../libs/tcb-service-mp-sdk/index'
const tcbService = new TcbService()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '身份信息认证',
    name: '',
    idcard: ''
  },

  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  getIDCard(e) {
    this.setData({
      idcard: e.detail.value
    })
  },

  async verify() {
    wx.showLoading({
      title: '验证中',
    })

    let result = await tcbService.callService({
      service: 'ai',
      action: 'IdCardVerification',
      data: {
        Name: this.data.name,
        IdCard: this.data.idcard
      }
    })

    wx.hideLoading()
    console.log(result)
    if (!result.code && !+result.data.Result) {
      wx.showToast({
        title: '验证成功',
        icon: 'none'
      })
    }
    else {
      wx.showToast({
        title: '验证失败',
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