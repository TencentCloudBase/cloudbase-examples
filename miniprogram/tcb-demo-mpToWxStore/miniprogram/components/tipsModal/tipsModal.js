// components/tipsModal.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    tipShow: Boolean,
    title:String,
    desc:String,
    url:String
  },
  observers: {
    tipShow: function (value) {
      this.setData({ isShow: value })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(){
      this.setData({
        isShow:false
      })
    },
    copyToClipboard(){
      wx.setClipboardData({
        data:this.properties.url,
        success(){
          wx.showToast({
            title: '链接已复制',
            icon:"none"
          })
        }
      })
    }
  }
})