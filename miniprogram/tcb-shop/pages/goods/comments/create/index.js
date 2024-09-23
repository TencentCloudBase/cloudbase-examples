import Toast from 'tdesign-miniprogram/toast/index';
import { getOrderItem } from '../../../../services/order/orderItem';
import { getSkuDetail } from '../../../../services/sku/sku';
import { getCloudImageTempUrl } from '../../../../utils/cloudImageHandler';
import { createComment } from '../../../../services/comments/comments';

Page({
  data: {
    sku: null,
  },

  toast(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
  },

  failedAndBack(message, e) {
    e && console.error(e);
    this.toast(message);
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },

  async onLoad(options) {
    const orderItemId = options.orderItemId;
    if (typeof orderItemId !== 'string') return this.failedAndBack('获取订单失败');

    const orderItem = await getOrderItem(orderItemId);

    const comment = orderItem?.comment;
    if (comment != null) return this.failedAndBack('已经评价过了');

    let sku = orderItem?.sku;
    if (sku == null) return this.failedAndBack('获取商品信息失败');

    try {
      sku = await getSkuDetail(sku._id);
      sku.image = (await getCloudImageTempUrl([sku.image ?? '']))[0];
      sku.spec = sku.attr_value.map((x) => x.value).join('，');
      this.setData({ sku, orderItemId });
    } catch (e) {
      return this.failedAndBack('获取商品信息失败', e);
    }
  },

  onRateChange(e) {
    const { value } = e?.detail;
    const item = e?.currentTarget?.dataset?.item;
    this.setData({ [item]: value }, () => {
      this.updateButtonStatus();
    });
  },

  onAnonymousChange(e) {
    const status = !!e?.detail?.checked;
    this.setData({ isAnonymous: status });
  },

  handleSuccess(e) {
    const { files } = e.detail;

    this.setData({
      uploadFiles: files,
    });
  },

  handleRemove(e) {
    const { index } = e.detail;
    const { uploadFiles } = this.data;
    uploadFiles.splice(index, 1);
    this.setData({
      uploadFiles,
    });
  },

  onTextAreaChange(e) {
    const value = e?.detail?.value;
    this.textAreaValue = value;
    this.updateButtonStatus();
  },

  updateButtonStatus() {
    const { goodRateValue, isAllowedSubmit } = this.data;
    const { textAreaValue } = this;
    const temp = Boolean(goodRateValue) && Boolean(textAreaValue);
    if (temp !== isAllowedSubmit) this.setData({ isAllowedSubmit: temp });
  },

  async onSubmitBtnClick() {
    const { goodRateValue, isAllowedSubmit, orderItemId, sku } = this.data;
    const { textAreaValue } = this;

    if (!isAllowedSubmit) return;

    try {
      await createComment({ orderItemId, content: textAreaValue, rating: goodRateValue, spuId: sku.spu._id });
      Toast({
        context: this,
        selector: '#t-toast',
        message: '评价提交成功',
        icon: 'check-circle',
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    } catch (e) {
      return this.failedAndBack('创建评论失败', e);
    }
  },
});
