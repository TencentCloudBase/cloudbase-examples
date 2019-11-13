//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cover: '',
    title: '',
    content: '',
  },

  onLoad: function () {
    this.getBlogDetail();
  },

  /**
   * 获取文章详情
   */
  getBlogDetail() {
    // 初始化db
    const db = wx.cloud.database({});
    let blogId = app.globalData.blog.detailId;
    db.collection('blog').doc(blogId).get().then(res => {
        console.log('db读取成功', res.data);
        let data = res.data;
        this.setData({
          cover: data.cover,
          title: data.title,
          content: data.content
        });
      })
      .catch(e => {
        wx.showToast({
          title: 'db读取失败',
          icon: 'none'
        });
      });
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
