const regeneratorRuntime = require("../lib/runtime");

Component({
  properties: {
    text: {
      type: String,
      value: '默认文本'
    }
  },
  data: {},
  externalClasses: ['weui-btn'],
  methods: {
    bindTap (e) {
      const that = this
      // 点击登录/注册按钮触发
      wx.login({
        async success (res) {
          const { code } = res
          const { rawData, userInfo } = e.detail
          wx.showLoading({ title: '登录中...' })
          const { result } = await wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'loginRegister',
            // 传递给云函数的参数
            data: {
              code,
              rawData
            }
          });
          wx.hideLoading()
          if (result.code === 0) {
            wx.setStorageSync('session', result.data.session);
            that.triggerEvent('loginsuccess',userInfo);
          } else {
            wx.showToast({
              title: result.message,
              icon: 'none',
              duration: 2000
            });
          }
        }
      })
    }
  }
})
