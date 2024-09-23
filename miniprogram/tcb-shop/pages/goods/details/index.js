// 第三方库
import Toast from 'tdesign-miniprogram/toast/index';

// 服务层
import { getAllAttrValues } from '../../../services/attrValue/attrValue';
import { handleSpuCloudImage, getSpu } from '../../../services/good/spu';
import { fetchCartItems, createCartItem, updateCartItemCount } from '../../../services/cart/cart';
import { getGoodsDetailCommentInfo } from '../../../services/comments/comments';
import { getAllSku } from '../../../services/sku/sku';

// 工具函数
import { cdnBase } from '../../../config/index';
import { cartShouldFresh } from '../../../utils/cartFresh';
import { getCloudImageTempUrl, getSingleCloudImageTempUrl } from '../../../utils/cloudImageHandler';
import { objectToParamString } from '../../../utils/util';

const imgPrefix = `${cdnBase}/`;

const recLeftImg = `${imgPrefix}common/rec-left.png`;
const recRightImg = `${imgPrefix}common/rec-right.png`;

async function replaceCloudImageWithTempUrl(text) {
  let ret = text;

  // 使用正则表达式匹配所有被双引号包裹的链接
  const regex = /"(cloud:\/\/[^"]*)"/g;
  let match;
  // 使用一个循环来处理所有匹配的链接
  while ((match = regex.exec(ret)) !== null) {
    const originalLink = match[0];
    const pureLink = match[1];
    // 处理链接
    const processedLink = await getSingleCloudImageTempUrl(pureLink);
    // 替换文本中的原始链接
    ret = ret.replace(originalLink, `"${processedLink}"`);
  }

  return ret;
}

const OUT_OPERATE_STATUS = {
  CART: 'cart',
  BUY: 'buy',
  NO: 'no',
};

Page({
  data: {
    commentsList: [],
    commentsStatistics: {
      badCount: 0,
      commentCount: 0,
      goodCount: 0,
      goodRate: 0,
      hasImageCount: 0,
      middleCount: 0,
    },
    isShowPromotionPop: false,
    activityList: [],
    recLeftImg,
    recRightImg,
    details: {},
    jumpArray: [
      {
        title: '首页',
        url: '/pages/home/home',
        iconName: 'home',
      },
      {
        title: '购物车',
        url: '/pages/cart/index',
        iconName: 'cart',
        showCartNum: true,
      },
    ],
    isStock: true,
    cartNum: 0,
    soldout: false,
    buttonType: 1,
    buyNum: 1,
    selectedAttrStr: '',
    skuArray: [],
    primaryImage: '',
    specImg: '',
    isSpuSelectPopupShow: false,
    isAllSelectedSku: false,
    buyType: 0,
    outOperateStatus: OUT_OPERATE_STATUS.NO, // 是否外层加入购物车
    operateType: 0,
    selectSkuSellsPrice: 0,
    maxLinePrice: 0,
    minSalePrice: 0,
    maxSalePrice: 0,
    list: [],
    spuId: '',
    navigation: { type: 'fraction' },
    current: 0,
    autoplay: true,
    duration: 500,
    interval: 5000,
    soldNum: 0, // 已售数量,
    loading: false,
  },

  setLoading() {
    this.setData({ loading: true });
  },
  unsetLoading() {
    this.setData({ loading: false });
  },

  handlePopupHide() {
    this.setData({
      isSpuSelectPopupShow: false,
    });
  },

  onSpecSelectTap() {
    this.showSkuSelectPopup(OUT_OPERATE_STATUS.NO);
  },

  showSkuSelectPopup(status) {
    this.setData({
      outOperateStatus: status,
      isSpuSelectPopupShow: true,
    });
  },

  buyItNow() {
    this.showSkuSelectPopup(OUT_OPERATE_STATUS.BUY);
  },

  toAddCart() {
    this.showSkuSelectPopup(OUT_OPERATE_STATUS.CART);
  },

  toNav(e) {
    const { url } = e.detail;
    wx.switchTab({
      url: url,
    });
  },

  showCurImg(e) {
    const { index } = e.detail;
    const { images } = this.data.details;
    wx.previewImage({
      current: images[index],
      urls: images, // 需要预览的图片http链接列表
    });
  },

  onPageScroll({ scrollTop }) {
    const goodsTab = this.selectComponent('#goodsTab');
    goodsTab && goodsTab.onScroll(scrollTop);
  },

  chooseSpecItem(e) {
    const { specList } = this.data.details;
    const { selectedSku, isAllSelectedSku } = e.detail;
    if (!isAllSelectedSku) {
      this.setData({
        selectSkuSellsPrice: 0,
      });
    }
    this.setData({
      isAllSelectedSku,
    });
    this.getSkuItem(specList, selectedSku);
  },

  getSkuItem(specList, selectedSku) {
    const { skuArray, primaryImage } = this.data;
    const selectedSkuValues = this.getSelectedSkuValues(specList, selectedSku);
    let selectedAttrStr = ` 件  `;
    selectedSkuValues.forEach((item) => {
      selectedAttrStr += `，${item.specValue}  `;
    });
    // eslint-disable-next-line array-callback-return
    const skuItem = skuArray.filter((item) => {
      let status = true;
      (item.specInfo || []).forEach((subItem) => {
        if (!selectedSku[subItem.specId] || selectedSku[subItem.specId] !== subItem.specValueId) {
          status = false;
        }
      });
      if (status) return item;
    });
    this.selectSpecsName(selectedSkuValues.length > 0 ? selectedAttrStr : '');
    if (skuItem) {
      this.setData({
        selectItem: skuItem,
        selectSkuSellsPrice: skuItem.price || 0,
      });
    } else {
      this.setData({
        selectItem: null,
        selectSkuSellsPrice: 0,
      });
    }
    this.setData({
      specImg: skuItem && skuItem.skuImage ? skuItem.skuImage : primaryImage,
    });
  },

  // 获取已选择的sku名称
  getSelectedSkuValues(skuTree, selectedSku) {
    const normalizedTree = this.normalizeSkuTree(skuTree);
    return Object.keys(selectedSku).reduce((selectedValues, skuKeyStr) => {
      const skuValues = normalizedTree[skuKeyStr];
      const skuValueId = selectedSku[skuKeyStr];
      if (skuValueId !== '') {
        const skuValue = skuValues.filter((value) => {
          return value.specValueId === skuValueId;
        })[0];
        skuValue && selectedValues.push(skuValue);
      }
      return selectedValues;
    }, []);
  },

  normalizeSkuTree(skuTree) {
    const normalizedTree = {};
    skuTree.forEach((treeItem) => {
      normalizedTree[treeItem.specId] = treeItem.specValueList;
    });
    return normalizedTree;
  },

  selectSpecsName(selectSpecsName) {
    if (selectSpecsName) {
      this.setData({
        selectedAttrStr: selectSpecsName,
      });
    } else {
      this.setData({
        selectedAttrStr: '',
      });
    }
  },

  toast(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
      icon: '',
      duration: 1000,
    });
  },

  async addCart({ detail: { count, pickedSku } }) {
    const overCount = () => this.toast('超过购买上限了');
    const addCartSucceed = () => {
      cartShouldFresh();
      this.handlePopupHide();
      this.toast('加入购物车成功');
    };
    const addCartFail = () => this.toast('加入购物车失败');

    const records = await fetchCartItems();

    const cartItem = records.find((x) => x.sku._id === pickedSku._id);
    // eslint-disable-next-line eqeqeq
    if (cartItem == null) {
      // cart item empty, create
      if (count <= pickedSku.count) {
        await createCartItem({ skuId: pickedSku._id, count }).then(addCartSucceed, addCartFail);
      } else {
        overCount();
      }
    } else {
      // cart item exists, update count
      const finalCount = cartItem.count + count;
      if (finalCount <= pickedSku.count) {
        await updateCartItemCount({ cartItemId: cartItem._id, count: finalCount }).then(addCartSucceed, addCartFail);
      } else {
        overCount();
      }
    }
  },

  onPicked() {
    this.setData({ isAllSelectedSku: true });
  },

  gotoBuy(e) {
    const overCount = () => this.toast('超过购买上限了');
    const buyCount = e.detail.count;
    const skuId = e.detail.pickedSku._id;
    const skuCount = e.detail.pickedSku.count;
    if (buyCount > skuCount) return overCount();

    wx.navigateTo({
      url: `/pages/order/order-confirm/index?${objectToParamString({ type: 'direct', count: buyCount, skuId })}`,
    });
  },

  specsConfirm() {
    const { buyType } = this.data;
    if (buyType === 1) {
      this.gotoBuy();
    } else {
      this.addCart();
    }
  },

  changeNum(e) {
    this.setData({
      buyNum: e.detail.buyNum,
    });
  },

  closePromotionPopup() {
    this.setData({
      isShowPromotionPop: false,
    });
  },

  promotionChange(e) {
    const { index } = e.detail;
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${index}`,
    });
  },

  showPromotionPopup() {
    this.setData({
      isShowPromotionPop: true,
    });
  },

  async getInfo(spuId) {
    // pics
    // min price
    // spu title
    // attrs => sku => count + price
    // spu detail
    // comment
    const spu = await getSpu(spuId);

    const loadSkus = async () => {
      const skus = await getAllSku(spuId);
      const minPrice = skus.reduce((acc, current) => Math.min(acc, current.price), Infinity) * 100;
      const loadSkuAttrValues = async () => {
        return Promise.all(
          skus.map(async (sku) => {
            const attrValues = await getAllAttrValues(sku._id);
            sku.attrValues = attrValues;
          }),
        );
      };
      const handleSkuImages = async () => {
        const images = skus.map((s) => s.image ?? '');
        const handledImages = await getCloudImageTempUrl(images);
        handledImages.forEach((image, index) => (skus[index].image = image));
      };
      await Promise.all([handleSkuImages(), loadSkuAttrValues()]);
      return { skus, minPrice };
    };

    const [_x, { skus, minPrice }, commentInfo] = await Promise.all([
      handleSpuCloudImage(spu),
      loadSkus(),
      getGoodsDetailCommentInfo(spu._id),
    ]);

    const [
      {
        data: { records, total: commentCount },
      },
      {
        data: { total: goodCommentCount },
      },
    ] = commentInfo;

    records.forEach((x) => (x.userNameString = x.createBy.substring(0, 10)));

    const detail = await replaceCloudImageWithTempUrl(spu.detail);

    this.setData({
      details: {
        images: spu.swiper_images,
        title: spu.name,
      },
      minSalePrice: minPrice,
      detail,
      descPopUpInitProps: {
        skus,
        minPrice,
        spu,
      },
      commentsStatistics: {
        commentCount,
        goodRate: (goodCommentCount / commentCount) * 100,
      },
      spu,
      commentsList: records,
    });
  },

  /** 跳转到评价列表 */
  navToCommentsListPage() {
    wx.navigateTo({
      url: `/pages/goods/comments/index?spuId=${this.data.spu._id}`,
    });
  },

  async onLoad(query) {
    const { spuId } = query;
    this.setLoading();
    try {
      await this.getInfo(spuId);
    } catch (e) {
      console.error(e);
      this.toast('获取商品详情失败');
    } finally {
      this.unsetLoading();
    }
  },
});
