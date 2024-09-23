import Toast from 'tdesign-miniprogram/toast/index';
import { getOrder } from '../../../../services/order/order';
import { getAllOrderItemsOfAnOrder } from '../../../../services/order/orderItem';
import { getCloudImageTempUrl } from '../../../../utils/cloudImageHandler';

Page({
  data: {
    order: null,
  },

  async onLoad(options) {
    const orderId = options?.orderId;
    if (typeof orderId !== 'string') {
      this.failedAndBack('获取订单详情失败');
      return;
    }

    try {
      const [order, items] = await Promise.all([getOrder(orderId), getAllOrderItemsOfAnOrder({ orderId })]);

      const images = items.map((x) => x.sku.image ?? '');
      try {
        const handleImages = await getCloudImageTempUrl(images);
        handleImages.forEach((image, index) => (items[index].sku.image = image));
      } catch (e) {
        console.error('处理商品图片失败', e);
      }
      order.orderItems = items;
      this.setData({ order });
    } catch (e) {
      this.failedAndBack('获取订单详情失败', e);
    }
  },

  failedAndBack(message, e) {
    e && console.error(e);
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
    setTimeout(() => wx.navigateBack(), 1000);
  },

  toComment(e) {
    const orderItemId = e?.target?.dataset?.orderItem?._id;
    if (typeof orderItemId !== 'string') {
      this.failedAndBack('获取订单详情失败');
      return;
    }

    wx.navigateTo({
      url: `/pages/goods/comments/create/index?orderItemId=${orderItemId}`,
    });
  },
});
