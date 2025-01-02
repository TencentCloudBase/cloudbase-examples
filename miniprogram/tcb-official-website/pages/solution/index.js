import { fetchSolutionData } from '../../services/solution/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    solutionList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    await this.getSolutionList();
  },

  // 获取解决方案 列表数据
  async getSolutionList(){
    try {
      wx.showLoading({
        title: '加载中',
      })   
      const solutionList = await fetchSolutionData();

      this.setData({
        solutionList
      })  
    } catch (error) {
      wx.showToast({
        title: error?.message || '页面请求失败，请刷新页面',
        icon: 'error',
        duration: 2000
      })  
    } finally{
      // 请求完成关闭loading
      wx.hideLoading()
    }
  },

  // 去详情页
  async goDetail(event){
    try {
      const id = event.currentTarget.dataset.id;
      const title = event.currentTarget.dataset.title;

      // 缺失数据标识id,中断跳转并报错提示
      if(!id){
        throw new Error("id获取失败")
      }
      // 跳转详情页
      wx.navigateTo({
        url:`/pages/detail/index?type=solution&id=${id}&title=${title}`
      })
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: 'error',
        duration: 2000
      })   
    }
  }
})