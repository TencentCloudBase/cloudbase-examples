import { fetchSceneDetail } from '../../services/scene/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    article:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 获取页面url search数据
    const { id, title, type } = options;
    // 动态设置页面标题
    wx.setNavigationBarTitle({
      title: title
    })
    await this.getArticle(id,type);
  },

  async getArticle(id,type){
    try {
      wx.showLoading({
        title: '加载中',
      })
      const article = await fetchSceneDetail(id,type);
      this.setData({
        article
      })
    } catch (error) {
    } finally{
      // 请求完成关闭loading框
      wx.hideLoading()
    }
  },
})