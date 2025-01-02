import { fetchIndexData } from '../../services/index/index';
import { fetchSceneData} from '../../services/scene/index';
import { fetchNewsData } from '../../services/news/index';

Page({
  data: {
    showUploadTip:false,
    bannerList:[],
    productAbilityList:[],
    applicationScene:[],
    newsList:[],
    partnersList:[]
  },
  async onLoad() {
    await this.getRequestList();
  },
  // 首页数据请求
  async getRequestList(){
    try {
      wx.showTabBar();
      wx.showLoading({
        title: '加载中',
      })
      const res = await fetchIndexData({pageSize:1});
      const res1 = await fetchSceneData();
      const res2 = await fetchNewsData({pageSize:3});
      const {index_show,function_show,cooperation} = res?.[0];

      this.setData({
        showUploadTip: true,
        bannerList:index_show,
        productAbilityList:function_show,
        partnersList: cooperation,
        applicationScene:res1,
        newsList: res2
      });
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
  // 跳转最新动态列表页面
  onGoNews(){
    wx.navigateTo({
      url: '/pages/news/index'
    })
  },
  // 跳转详情页
  async goDetail(event){
    try {
      const id = event.currentTarget.dataset.id;
      const title = event.currentTarget.dataset.title;
      if(!id){
        throw new Error("id获取失败")
      }
      wx.navigateTo({
        url:`/pages/detail/index?type=scene&id=${id}&title=${title}`
      })
    } catch (error) {
      wx.showToast({
        title: error.message || '页面跳转失败',
        icon: 'error',
        duration: 2000
      }) 
    }
  }
});
