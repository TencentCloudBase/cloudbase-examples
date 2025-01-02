import { fetchNewsData } from '../../services/news/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    newsList:[],
  },

  async onLoad() {
    await this.getNewsList();
  },

  // 获取最新动态
  async getNewsList(){
    try {
      wx.showLoading({
        title: '加载中...'
      });
      const newsList = await fetchNewsData();
      this.setData({newsList});
    } catch (error) {
      wx.showToast({
        title: error?.message || '页面请求失败，请刷新页面',
        icon: 'error',
        duration: 2000
      })  
    } finally {
      wx.hideLoading();
    }         
  },
})