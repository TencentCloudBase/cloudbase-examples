import { fetchIndexData } from '../../services/index/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    aboutUs:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    await this.getAboutUs();
  },
  async getAboutUs(){
    try {
      wx.showLoading({
        title: '加载中',
      })   
      const res = await fetchIndexData({pageSize:1});
      this.setData({aboutUs: res?.[0]})
    } catch (error) {
      wx.showToast({
        title: error?.message || '页面请求失败，请刷新页面',
        icon: 'error',
        duration: 2000
      })   
    } finally{
      wx.hideLoading()
    }
  },
  onPhone(){
    wx.makePhoneCall({
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
  },

  onGoMap(){
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    }) 
  }
})