import Toast from 'tdesign-miniprogram/toast/index';
import { getCates } from '../../../services/cate/cate';

Page({
  data: {
    cates: [],
  },
  async init() {
    try {
      const cates = await getCates();
      this.setData({ cates });
    } catch (e) {
      console.error('获取商品分类列表失败', e);
      Toast({
        context: this,
        selector: '#t-toast',
        message: '获取商品分类列表失败',
        duration: 1000,
        icon: '',
      });
    }
  },

  onShow() {
    this.getTabBar().init();
  },
  onChange(e) {
    const cateId = e?.detail?.item?._id;
    wx.navigateTo({
      url: `/pages/goods/list/index?cateId=${cateId}`,
    });
  },
  onLoad() {
    this.init(true);
  },
});
