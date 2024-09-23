import Toast from 'tdesign-miniprogram/toast/index';
import { ORDER_STATUS, listOrder, orderStatusToName } from '../../../services/order/order';
import { getAllOrderItemsOfAnOrder } from '../../../services/order/orderItem';
import { LIST_LOADING_STATUS } from '../../../utils/listLoading';
import { getCloudImageTempUrl } from '../../../utils/cloudImageHandler';
import { OPERATION_TYPE } from '../../../utils/orderOperation';
import { shouldFresh, orderListFinishFresh } from '../../../utils/orderListFresh';

const ORDER_STATUS_ALL = '0';

Page({
  page: {
    size: 5,
    num: 1,
  },

  data: {
    tabs: [
      { key: ORDER_STATUS_ALL, text: '全部', total: 0 },
      { key: ORDER_STATUS.TO_PAY, text: '待付款', total: 0 },
      { key: ORDER_STATUS.TO_SEND, text: '待发货', total: 0 },
      { key: ORDER_STATUS.TO_RECEIVE, text: '待收货', total: 0 },
      { key: ORDER_STATUS.FINISHED, text: '已完成', total: 0 },
    ],
    curTab: ORDER_STATUS_ALL,
    orderList: [],
    listLoading: LIST_LOADING_STATUS.READY,
    emptyImg: 'https://cdn-we-retail.ym.tencent.com/miniapp/order/empty-order-list.png',
    backRefresh: false,
    status: ORDER_STATUS_ALL,
    pullDownRefreshing: false,
    loadingProps: {
      theme: 'circular',
      size: '40rpx',
    },
  },

  errorToast(message, e) {
    console.error(message, e);
    this.toast(message);
  },

  toast(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
      duration: 1000,
      icon: '',
    });
  },

  onLoad(query) {
    const status = this.data.tabs.find((x) => x.key === query.status)?.key ?? ORDER_STATUS_ALL;
    this.setData({
      status,
    });
    this.refreshList(status);
  },

  async pullRefresh() {
    this.setData({ pullDownRefreshing: true });
    try {
      await this.onRefresh();
      orderListFinishFresh();
    } catch (e) {
      this.errorToast('获取订单列表失败', e);
    } finally {
      this.setData({ pullDownRefreshing: false });
    }
  },

  async onShow() {
    if (!shouldFresh) return;
    try {
      await this.onRefresh();
      orderListFinishFresh();
    } catch (e) {
      this.errorToast('获取订单列表失败', e);
    }
  },

  onReachBottom() {
    if (this.data.listLoading === LIST_LOADING_STATUS.READY) {
      this.getOrderList(this.data.curTab);
    }
  },

  async getOrderItems(order) {
    const orderId = order._id;
    try {
      const orderItems = await getAllOrderItemsOfAnOrder({ orderId });

      const images = orderItems.map((x) => x.sku.image ?? '');
      (await getCloudImageTempUrl(images)).forEach((image, index) => (orderItems[index].sku.image = image));

      order.orderItems = orderItems;
      order.totalPrice = orderItems.reduce((acc, cur) => acc + cur.sku.price * cur.count, 0);
    } catch (e) {
      this.errorToast('获取订单详情失败', e);
    }
  },

  async getOrderList(statusCode = ORDER_STATUS_ALL, reset = false) {
    this.setData({
      listLoading: LIST_LOADING_STATUS.LOADING,
    });
    try {
      const { records, total } = await listOrder({
        pageSize: this.page.size,
        pageNumber: this.page.num,
        status: statusCode !== ORDER_STATUS_ALL ? statusCode : undefined,
      });

      records.forEach((order) => (order.statusDesc = orderStatusToName(order.status)));

      // async get items for each order
      await Promise.all(records.map((order) => this.getOrderItems(order)));

      const orderList = reset ? records : this.data.orderList.concat(records);
      const listLoading = orderList.length >= total ? LIST_LOADING_STATUS.NO_MORE : LIST_LOADING_STATUS.READY; // TODO: maybe we should notify user when `length > total`?

      this.setData({ listLoading, orderList });
      const currentNum = reset ? 1 : this.page.num;
      this.page.num = currentNum + 1;
    } catch (e) {
      console.error('获取订单列表失败', e);
      this.setData({ listLoading: LIST_LOADING_STATUS.FAILED });
    }
  },

  onReTryLoad() {
    this.getOrderList(this.data.curTab);
  },

  onTabChange(e) {
    const { value } = e.detail;
    this.setData({
      status: value,
    });
    this.refreshList(value);
  },

  refreshList(status = ORDER_STATUS_ALL) {
    this.page = {
      size: this.page.size,
      num: 1,
    };
    this.setData({ curTab: status, orderList: [] });

    return this.getOrderList(status, true);
  },

  onRefresh() {
    return this.refreshList(this.data.curTab);
  },

  onOrderCardTap(e) {
    const { order } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/order-detail/index?orderId=${order._id}`,
    });
  },

  onOperation(e) {
    const type = e?.detail?.type;
    const success = e?.detail?.success;

    if (type == null) return;

    const resultMessage = success ? '成功' : '失败';

    let operationMessage;

    if (type === OPERATION_TYPE.CANCEL) {
      operationMessage = '取消订单';
    } else if (type === OPERATION_TYPE.CONFIRM) {
      operationMessage = '确认收货';
    } else {
      operationMessage = '支付';
    }

    this.toast(`${operationMessage}${resultMessage}`);
    this.onRefresh();
  },
});
