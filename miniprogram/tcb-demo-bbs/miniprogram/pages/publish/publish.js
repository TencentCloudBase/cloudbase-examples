// pages/publish/publish.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: [],
    content: '',
    clould_img_id_list: [],
    is_anonymous: false,
    maxContentLength: 1000,
    minContentLength: 5
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData)
  },
  input: function (e) {
    if (e.detail.value.length >= this.data.maxContentLength) {
      wx.showToast({
        title: '已达到最大字数限制',
      })
    }
    this.setData({
      content: e.detail.value
    })
  },
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          //图如果满了9张，不显示加图
          if (res.tempFilePaths.length == 9) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            if (img_url.length >= 9) {
              wx.showToast({
                image: '../../images/warn.png',
                title: '图片过多'
              })
              that.setData({
                hideAdd: 1
              })
              break
            }
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })
        }
      }
    })
  },
  /**
   * 执行发布
   */
  publish: function(img_url_ok) {
    var that = this
    wx.cloud.callFunction({
      name: 'publish_post',
      //传递数据
      data: {
        author_name: app.globalData.wechatNickName,
        author_avatar_url: app.globalData.wechatAvatarUrl,
        content: that.data.content,
        is_anonymous: that.data.is_anonymous,
        image_url: img_url_ok,
      },
      success: function (res) {
        var pages = getCurrentPages();             //  获取页面栈
        var prevPage = pages[pages.length - 2];    // 上一个页面
        prevPage.setData({
          update: true
        })
        wx.hideLoading()
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function(res) {
        that.publishFail('发布失败')
      }
    })
  },
  //发布按钮事件
  send: function () {
    if (this.data.content.length < this.data.minContentLength) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '内容太短!',
      })
      return
    }
    var that = this;

    wx.showLoading({
      title: '发布中',
      mask: true
    })

    let img_url = that.data.img_url;
    let img_url_ok = [];

    if (img_url.length == 0) {
      this.publish([])
      return
    }
    for (let i = 0; i < img_url.length; i++) {
      var str = img_url[i];
      var obj = str.lastIndexOf("/");
      var fileName = str.substr(obj + 1)
      console.log(fileName)

      //上传图片
      wx.cloud.uploadFile({
        cloudPath: 'post_images/' + fileName,
        filePath: img_url[i], 
        success: res => {
          img_url_ok.push(res.fileID)
          if (img_url_ok.length == img_url.length) {
            that.publish(img_url_ok)
          }
        },
        fail: err => {
          that.publishFail('图片上传失败')
          console.log('fail: ' + err.errMsg)
        }
      })
 
    }  
    
  },

  /**
   * 监测匿名开关
   */
  switchChange: function (e) {
    const that = this;
    that.setData({
      is_anonymous: e.detail.value
    })
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

  },
  publishFail(info) {
    wx.showToast({
      image: '../../images/warn.png',
      title: info,
      mask: true,
      duration: 2500
    })
  }
})