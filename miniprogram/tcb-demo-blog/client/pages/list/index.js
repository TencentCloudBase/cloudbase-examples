//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  /**
   * 获取文章列表数据
   */
  getData() {
    const db = wx.cloud.database({});
    db.collection('blog').get().then((res) => {
      console.log(res);
      let data = res.data;
      data = data.map((item) => {
        let appendix = (item.content.length > 20) ? '...' : '';
        item.content = item.content.slice(0, 20) + appendix;
        return item;
      });

      this.setData({
        list: data
      });
    }).catch(e => {
      wx.showToast({
        title: 'db读取失败',
        icon: 'none'
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
  },

  /**
   * 跳转至文章详情
   */
  getDetail(e) {
    let _id = e.currentTarget.dataset.blogid;
    app.globalData.blog.id = _id;

    wx.navigateTo({
      url: '../detail/index'
    });
  }

})