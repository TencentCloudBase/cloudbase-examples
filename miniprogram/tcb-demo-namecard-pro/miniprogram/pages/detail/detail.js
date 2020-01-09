const app = getApp();
const mapping = require('../common/reversemapping.js');

Page({
  data: {
    cover: '',
  },

  onLoad: function (options) {
    this.getNameCardDetail(options.i);
  },

  /**
   * 获取名片详情
   */
  getNameCardDetail(i) {
    let that = this
    const db = wx.cloud.database()
    var data = app.globalData.list[i];
    const cover = data.cover;
    delete data.cover;
    let newdata={};
    for (let item in data){
      let name = null;
      if (mapping[item] != null) {
        name = mapping[item];
        newdata[name] = data[item];
      }
    }
    this.setData({
      cover: cover,
      namecard:newdata
    })
  },

  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [this.data.cover]
    });
  },

  /**
   * 删除名片
   */
  deletecard: function(e){
    let that = this;
    wx.showModal({
      title: '确认',
      content: '是否要将这个名片删除？删除后无法找回',
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '删除中',
            mask:true
          })
          /*【开始】=====================【代码观看位置D-1】=====================【开始】*/
          wx.cloud.callFunction({
            name:"remove",
            data:{
              img: that.data.cover
            },
            success(res){
              wx.hideLoading();
              if(res.result.code == 0){
                wx.navigateBack({
                  delta:1
                })
              }
              else{
                wx.showToast({
                  title: '删除失败，请重试！',
                  icon: 'none'
                });
              }
            }
          })
          /*【结束】=====================【代码观看位置D-1】=====================【结束】*/
        }
      }
    })
  }
})
