import regeneratorRuntime from '../../libs/runtime'

let countDownInterval = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '验证码',
    type: 'normal', // 短信类型，normal 为普通短信，voice 为语音短信
    phoneNumber: '', // 手机号码
    code: '', // 验证码
    gapTime: null, // 获取新验证码间隔，单位ms
    isCountDown: false,
    countDown: ''
  },

  typeChange(e) {
    this.setData({
      type: e.detail.value
    })
  },

  recordPhoneNumber(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  recordCode(e) {
    this.setData({
      code: e.detail.value
    })
  },

  async getCode(e) {

    let {
      phoneNumber,
      type
     } = this.data
    
    let { result } = await wx.cloud.callFunction({
      name: 'CreateVerificationCode',
      data: {
        type,
        phoneNumber
      }
    })

    console.log(result)

    if (result.code) {
      return wx.showToast({
        title: result.message,
        icon: 'none'
      })
    }
    else {
      wx.showToast({
        title: '验证码已发送，2分钟内有效',
        icon: 'none'
      })
    }

    if (result.data.gapTime && result.data.validTime) {
      this.setData({
        gapTime: result.data.gapTime,
        validTime: result.data.validTime
      })
    }

    this.countDown()
  },

  async verifyCode(e) {
    let code = this.data.code;

    if (!code) {
      return wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
    }
  
    let { result } = await wx.cloud.callFunction({
      name: 'VerifyVerificationCode',
      data: {
        code
      }
    })

    if (!result.code) {
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

    // 清空验证码
    this.setData({
      code: ''
    })
  },

  // 倒计时
  countDown() {
    let countDown = Math.floor(this.data.gapTime / 1000)
    countDownInterval = setInterval(() => {
      this.setData({
        isCountDown: true,
        countDown
      }, () => {
        --countDown
      })

      if (!countDown) {
        clearInterval(countDownInterval)
        countDownInterval = null
        this.setData({
          isCountDown: false
        })
      }
    }, 1000)
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