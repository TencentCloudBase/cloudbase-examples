let app = getApp();
Page({
  data: {
    imgdata:{}
  },
  onLoad: function (options) {
    let imgdata = app.globalData.nowimage;
    this.setData({
      imgdata:imgdata
    })
  },
  reocr(){
    wx.showLoading({
      title: '文字识别中',
    })
    let that = this;
    wx.cloud.callFunction({
      name: 'reorc',
      data: {
        img: that.data.imgdata.src
      },
      success(res) {
        console.log(res.result);
        if (res.result.code == 0) {
          let imgdata=that.data.imgdata;
          imgdata.content = res.result.content;
          that.setData({
            imgdata:imgdata
          })
        }
        else if (res.result.code == -1) {
          console.log(res.err);
          wx.showModal({
            title: '系统错误',
            content: '系统出现问题，请稍后再试!',
          })
        }
        wx.hideLoading();
      },
      fail(err) {
        console.log(err);
        wx.showModal({
          title: '网络错误',
          content: '网络出现问题，请稍后再试!',
        })
        wx.hideLoading();
      }
    })
  },
  copytext(){
    let items=this.data.imgdata.content.items;
    let text="";
    for(let i=0;i<items.length;i++){
      text+=items[i].text+"\n";
    }
    wx.setClipboardData({
      data: text,
    })
  },
  showimg(){
    let urls=[this.data.imgdata.src];
    wx.previewImage({
      urls
    })
  }
})
