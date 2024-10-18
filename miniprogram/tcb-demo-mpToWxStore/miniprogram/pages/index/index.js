const { init } = require('@cloudbase/wx-cloud-client-sdk')
const client = init(wx.cloud)
const models = client.models
Page({
  data: {
    menuPosition: wx.getMenuButtonBoundingClientRect(),
    menuItems: [
      {
        key: 1,
        title: "小店管理"
      },
      {
        key: 2,
        title: "商品管理"
      }
    ],
    selectedItemIndex: 1,
    tipShow:false,
    title:"",
    desc:"",
    url:"",
    isPreview:false,
    storeList:[],
    storeTotal:0,
    productList:[],
    productTotal:0
  },
  async onLoad(){
    try{
      wx.showLoading({
        title: '',
      })
      // 查询店铺首页了列表
      const {data:{records:storeList,total:storeTotal}}  = await models.store_home_3bzb1t4.list({
        filter: {
          where: {}
        },
        pageSize: 10, // 分页大小，建议指定，如需设置为其它值，需要和 pageNumber 配合使用，两者同时指定才会生效
        pageNumber: 1, // 第几页
        getCount: true, // 开启用来获取总数
      });
      // 查询商品列表
      const {data:{records:productList,total:productTotal}}  = await models.store_product_zh57lp5.list({
        filter: {
          where: {}
        },
        pageSize: 10, // 分页大小，建议指定，如需设置为其它值，需要和 pageNumber 配合使用，两者同时指定才会生效
        pageNumber: 1, // 第几页
        getCount: true, // 开启用来获取总数
      });
      wx.hideLoading()
      this.setData({
        storeList,
        storeTotal,
        productList,
        productTotal,
        isPreview:false,
        title:"使用云模板管理微信小店",
        desc:"您已成功配置后台数据，可以打开下方地址对微信小店及商品进行增删改查等数据管理，配置后的数据将同步到该模板",
        url:"https://tcb.cloud.tencent.com/cloud-admin?_jump_source=wxide_mp2store#/management/content-mgr/index"
      })
    }catch(e){
      wx.hideLoading()
      this.setData({
        isPreview:true,
        title:"使用云模板快速接入微信小店",
        desc:"当前为体验数据，切换为真实数据请复制下方链接并在浏览器中打开，帮您快速接入微信小店，管理小店及商品数据",
        url:"https://tcb.cloud.tencent.com/cloud-template/detail?appName=wx_shop&from=wxide_mp2store"
      })
    }
  },
  onChangeTab(e) {
    const {key}=e.target.dataset
    this.setData({
      selectedItemIndex:key
    })
  },
  onOpenTipsModal(){
    this.setData({
      tipShow:true
    })
  }
});
