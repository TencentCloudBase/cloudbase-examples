const app = getApp();
const mapping = require('../common/reversemapping.js');

Page({
  data: {
    cover: '',
  },

  onLoad: function () {
    this.getNameCardDetail();
  },

  /**
   * 获取名片详情
   */
  getNameCardDetail() {
    let that = this
    const db = wx.cloud.database()
    let _id = app.globalData.namecard.id
    db.collection('namecard').doc(_id).field({
      name: true,
      phone: true,
      company: true,
      cover: true
    }).get().then(res=>{
      console.log(res.data)
      that.setData({
        cover: res.data.cover,
        namecard: res.data
      })
    }).catch(err => {
      wx.showToast({
        title: '名片详情读取失败',
        icon: 'none'
      })
    })
  },

  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [this.data.cover] // 需要预览的图片http链接列表  
    });
  } 
})
