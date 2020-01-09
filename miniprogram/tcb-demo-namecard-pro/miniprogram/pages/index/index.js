const app = getApp();
const mapping = require('../common/mapping.js');

Page({
  data: {
    fileID: null,
    coverImage: '',
    formData: []
  },
  onShow(){
  },
  /**
   * 上传文件
   */
  uploadFile() {
    let that = this;
    if(app.globalData.id==null){
      wx.showToast({
        title: '初始化未完成，请稍后再试',
        icon:'none'
      });
      return;
    }
    wx.chooseImage({
      success: function (dRes) {
        wx.showLoading({
          title: '上传文件',
        })
        let cloudPath = `${app.globalData.id}/${Date.now()}-${Math.floor(Math.random(0, 1)*1000)}.png`;

        /*【开始】=====================【代码实战位置A-1】=====================【开始】*/
        wx.cloud.uploadFile({
          cloudPath,
          filePath: dRes.tempFilePaths[0],
        }).then(res => {
          if (res.statusCode < 300) {
            that.setData({
              fileID: res.fileID}, 
              () => { that.getTempFileURL() 
            })
          }
        }).catch(err => {
          console.log(err)
          wx.hideLoading()
          wx.showToast({ title: '上传失败', icon: 'none'})
        })
        /*【结束】=====================【代码实战位置A-1】=====================【结束】*/
      },
      fail: console.error
    })
  },
  /**
     * 获取图片链接
     */
  getTempFileURL() {
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.getTempFileURL({
      fileList: [that.data.fileID]
    }).then(res => {
      let files = res.fileList
      if (files.length) {
        that.setData({
          coverImage: files[0].tempFileURL
        }, () => {
          that.parseNameCard();
        })
      } else {
        wx.showToast({
          title: '获取图片链接失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.error
      wx.showToast({
        title: '获取图片链接失败',
        icon: 'none'
      })
      wx.hideLoading();
    })
  },
  /**
   * 调用接口解析名片
   */
  parseNameCard() {
    let that = this
    wx.showLoading({
      title: '解析名片',
    })
    /*【开始】=====================【代码观看位置A-2】=====================【开始】*/
    wx.cloud.callFunction({
      name: 'parseNameCard',
      data: {
        url: that.data.coverImage
      }
    }).then(res => {
      console.log(res)
      if (res.result.code !== 0) {
        wx.showToast({
          title: '识别失败',
          icon: 'none'
        })
        wx.hideLoading()
        return
      }
      console.log(res.result.data)
      let data = that.transformMapping(res.result.data)
      console.log(data)
      that.setData({
        formData: data
      })
      wx.hideLoading()
    /*【结束】=====================【代码观看位置A-2】=====================【结束】*/
    }).catch(err => {
      console.error
      console.log(err)
      wx.showToast({
        title: '解析失败',
        icon: 'none'
      })
      wx.hideLoading()
    })
  },

  /**
  * 将获取的名片数据进行处理
  * @param {Object} data
  */
  transformMapping(data) {
    let record = {};
    let returnData = [];

    data.map((item) => {
      let name = null;
      if (mapping[item.item]!=null) {
        name = mapping[item.item];
        // 写入英文名
        item.name = name;
      }
      return item;
    });

    // 过滤重复的字段
    data.forEach((item) => {
      if (!record.hasOwnProperty(item.item)) {
        returnData.push(item);
        record[item.item] = true;
      }
    });
    return returnData;
  },
  /**
   * 上传名片
   */
  addNameCard(e) {
    const that = this
    const formDate = e.detail.value
    wx.showLoading({
      title: '添加中',
    })
    formDate.cover = that.data.fileID;
    console.log(formDate);
    wx.cloud.callFunction({
      name:"add",
      data:{
        card: formDate
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '上传成功'
      })
      that.setData({
        coverImage: null,
        fileID: null,
        formData: []
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      })
    })
  }
})
