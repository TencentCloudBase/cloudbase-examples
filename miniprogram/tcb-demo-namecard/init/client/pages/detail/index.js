const app = getApp();
const mapping = require('../common/reversemapping.js');

Page({
  data: {
    cover: '',
    title: '',
    content: '',
  },

  onLoad: function () {
    this.getNameCardDetail();
  },

  /**
   * 获取名片详情
   */
  getNameCardDetail() {
    
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
