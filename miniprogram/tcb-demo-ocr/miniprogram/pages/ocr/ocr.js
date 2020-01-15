var app = getApp();
Page({
  data: {
    imglist: []
  },

  onLoad(options){
    this.initlist();
  },

  onPullDownRefresh(){
    this.initlist();
  },

  toimgshow(e) {
    app.globalData.nowimage = this.data.imglist[e.currentTarget.dataset.i];
    wx.navigateTo({
      url: '../show/show',
    })
  },

  initlist() {
    wx.showLoading({
      title: '列表加载',
    })
    let that = this;
    wx.cloud.callFunction({
      name: 'init',
      success(res) {
        if (res.result.code == 0) {
          app.globalData.id=res.result.id;
          that.setData({
            imglist: res.result.list
          })
        }
        else if (res.result.code == -1) {
          console.log(res.err);
          that.showmodel('系统错误', '系统出现问题，请稍后再试!');
        }
        wx.stopPullDownRefresh();
        wx.hideLoading();
      },
      fail(err) {
        console.log(err);
        that.showmodel('系统错误', '网络出现问题，请稍后再试!');
        wx.hideLoading();
      }
    })
  },

  chooseimg() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let imgUrl = res.tempFilePaths[0];
        that.uploadImgweb(imgUrl)
      }
    })
  },

  uploadImgweb(imgUrl) {
    wx.showLoading({
      title: '上传图片',
    })
    let that = this;
    wx.cloud.uploadFile({
      cloudPath: app.globalData.id + '/' + imgUrl.slice(imgUrl.length - 20, imgUrl.length),
      filePath: imgUrl,
      success: res => {
        wx.hideLoading();
        that.addimg(res.fileID);
      },
      fail: err => {
        wx.hideLoading();
        console.log("上传失败", err)
      }
    })
  },

  addimg(imgsrc) {
    wx.showLoading({
      title: 'AI赋能中',
    })
    let that = this;
    wx.cloud.callFunction({
      name: 'addimg',
      data: {
        img: imgsrc
      },
      success(res) {
        if (res.result.code == 0) {
          that.initlist();
        }
        else if (res.result.code == -1) {
          console.log(res.err);
          that.showmodel('系统错误', '系统出现问题，请稍后再试!');
        }
      },
      fail(err) {
        console.log(err);
        that.showmodel('网络错误','网络出现问题，请稍后再试!');
        
      }
    })
  },

  removeimg(e) {
    let that = this;
    wx.showModal({
      title: '确认删除',
      content: '你是否确认删除这个图片以及识别结果？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除图片',
          })
          wx.cloud.callFunction({
            name: 'removeimg',
            data: {
              img: e.currentTarget.dataset.img
            },
            success(res) {
              if (res.result.code == 0) {
                that.initlist();
              }
              else if (res.result.code == -1) {
                console.log(res.err);
                that.showmodel('系统错误', '系统出现问题，请稍后再试!');
              }
            },
            fail(err) {
              console.log(err);
              that.showmodel('网络错误', '网络出现问题，请稍后再试!');
            }
          })
        }
      }
    })
  },

  showmodel(title,msg){
    wx.hideLoading();
    wx.showModal({
      title: title,
      content: msg,
      showCancel: false
    })
  }
})