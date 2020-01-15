Page({
  toocr() {
    wx.navigateTo({
      url: '../ocr/ocr',
    })
  },
  onShareAppMessage(){
    return {
      title:"小程序云开发"
    }
  }
})