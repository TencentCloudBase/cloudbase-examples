//获取应用实例
const app = getApp()

Page({
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
  },
  /**
   * 获取文章列表数据
   */
  getData() {
    let that = this;
    app.userinit(()=>{
      that.setData({
        list: app.globalData.list
      })
    });
  },
  /**
   * 跳转至名片详情
   */
  getDetail(e) {
    wx.navigateTo({
      url: '../detail/detail?i=' + e.currentTarget.dataset.i,
    })
  }
})