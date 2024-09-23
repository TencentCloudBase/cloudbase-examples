import Toast from 'tdesign-miniprogram/toast/index';
import dayjs from 'dayjs';
import { orderListShouldFresh } from '../../../utils/orderListFresh';
import { OrderStatus } from '../config';
import { getAllOrderItemsOfAnOrder } from '../../../services/order/orderItem';
import { getOrder, orderStatusToName, ORDER_STATUS, updateOrderDeliveryInfo } from '../../../services/order/order';
import { fetchBusinessTime } from '../../../services/order/orderDetail';
import { getAddressPromise } from '../../usercenter/address/list/util';
import { OPERATION_TYPE } from '../../../utils/orderOperation';

Page({
  data: {
    pageLoading: true,
    order: {}, // 后台返回的原始数据
    _order: {}, // 内部使用和提供给 order-card 的数据
    storeDetail: {},
    countDownTime: null,
    addressEditable: false,
    backRefresh: false, // 用于接收其他页面back时的状态
    formatCreateTime: '', //格式化订单创建时间
    logisticsNodes: [],
    /** 订单评论状态 */
    orderHasCommented: true,
  },

  toast(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
  },

  onLoad({ orderId }) {
    if (orderId == null) {
      toast('异常订单号');
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    }
    this.orderId = orderId;
    this.init();
    this.navbar = this.selectComponent('#navbar');
    this.pullDownRefresh = this.selectComponent('#wr-pull-down-refresh');
  },

  onShow() {
    // 当从其他页面返回，并且 backRefresh 被置为 true 时，刷新数据
    if (!this.data.backRefresh) return;
    this.onRefresh();
    this.setData({ backRefresh: false });
  },

  onPageScroll(e) {
    this.pullDownRefresh && this.pullDownRefresh.onPageScroll(e);
  },

  onImgError(e) {
    if (e.detail) {
      console.error('img 加载失败');
    }
  },

  // 页面初始化，会展示pageLoading
  init() {
    this.setData({ pageLoading: true });
    this.getStoreDetail();
    this.getDetail()
      .then(() => {
        this.setData({ pageLoading: false });
      })
      .catch((e) => {
        console.error(e);
      });
  },

  // 页面刷新，展示下拉刷新
  onRefresh() {
    this.init();
    // 如果上一页为订单列表，通知其刷新数据
    const pages = getCurrentPages();
    const lastPage = pages[pages.length - 2];
    if (lastPage) {
      lastPage.data.backRefresh = true;
    }
  },

  // 页面刷新，展示下拉刷新
  onPullDownRefresh_(e) {
    const { callback } = e.detail;
    return this.getDetail().then(() => callback && callback());
  },

  async getDetail() {
    const orderId = this.orderId;
    const [order, orderItems] = await Promise.all([getOrder(orderId), getAllOrderItemsOfAnOrder({ orderId })]);
    order.orderItems = orderItems;
    order.totalPrice = orderItems.reduce((acc, cur) => acc + cur.count * cur.sku.price, 0);
    order.statusDesc = orderStatusToName(order.status);
    order.isPaid = order.status !== ORDER_STATUS.TO_PAY;
    order.createdTimeString = dayjs(new Date(order.createdAt)).format('YYYY-MM-DD HH:mm:ss');

    this.setData({ order, addressEditable: order.statusDesc === '待付款' });
    // console.log('ha', order);
    // return fetchOrderDetail(params).then((res) => {
    //   const order = res.data;
    //   const _order = {
    //     id: order.orderId,
    //     orderNo: order.orderNo,
    //     parentOrderNo: order.parentOrderNo,
    //     storeId: order.storeId,
    //     storeName: order.storeName,
    //     status: order.orderStatus,
    //     statusDesc: order.orderStatusName,
    //     amount: order.paymentAmount,
    //     totalAmount: order.goodsAmountApp,
    //     logisticsNo: order.logisticsVO.logisticsNo,
    //     goodsList: (order.orderItemVOs || []).map((goods) =>
    //       Object.assign({}, goods, {
    //         id: goods.id,
    //         thumb: goods.goodsPictureUrl,
    //         title: goods.goodsName,
    //         skuId: goods.skuId,
    //         spuId: goods.spuId,
    //         specs: (goods.specifications || []).map((s) => s.specValue),
    //         price: goods.tagPrice ? goods.tagPrice : goods.actualPrice, // 商品销售单价, 优先取限时活动价
    //         num: goods.buyQuantity,
    //         titlePrefixTags: goods.tagText ? [{ text: goods.tagText }] : [],
    //         buttons: goods.buttonVOs || [],
    //       }),
    //     ),
    //     buttons: order.buttonVOs || [],
    //     createTime: order.createTime,
    //     receiverAddress: this.composeAddress(order),
    //     groupInfoVo: order.groupInfoVo,
    //   };
    //   this.setData({
    //     order,
    //     _order,
    //     formatCreateTime: formatTime(parseFloat(`${order.createTime}`), 'YYYY-MM-DD HH:mm'), // 格式化订单创建时间
    //     countDownTime: this.computeCountDownTime(order),
    //     addressEditable:
    //       [OrderStatus.PENDING_PAYMENT, OrderStatus.PENDING_DELIVERY].includes(order.orderStatus) &&
    //       order.orderSubStatus !== -1, // 订单正在取消审核时不允许修改地址（但是返回的状态码与待发货一致）
    //     isPaid: !!order.paymentVO.paySuccessTime,
    //     invoiceStatus: this.datermineInvoiceStatus(order),
    //     invoiceDesc: order.invoiceDesc,
    //     invoiceType: order.invoiceVO?.invoiceType === 5 ? '电子普通发票' : '不开发票', //是否开票 0-不开 5-电子发票
    //     logisticsNodes: this.flattenNodes(order.trajectoryVos || []),
    //   });
    // });
  },

  datermineInvoiceStatus(order) {
    // 1-已开票
    // 2-未开票（可补开）
    // 3-未开票
    // 4-门店不支持开票
    return order.invoiceStatus;
  },

  // 拼接省市区
  composeAddress(order) {
    return [
      //order.logisticsVO.receiverProvince,
      order.logisticsVO.receiverCity,
      order.logisticsVO.receiverCountry,
      order.logisticsVO.receiverArea,
      order.logisticsVO.receiverAddress,
    ]
      .filter((s) => !!s)
      .join(' ');
  },

  getStoreDetail() {
    fetchBusinessTime().then((res) => {
      const storeDetail = {
        storeTel: res.data.telphone,
        storeBusiness: res.data.businessTime.join('\n'),
      };
      this.setData({ storeDetail });
    });
  },

  // 仅对待支付状态计算付款倒计时
  // 返回时间若是大于2020.01.01，说明返回的是关闭时间，否则说明返回的直接就是剩余时间
  computeCountDownTime(order) {
    if (order.orderStatus !== OrderStatus.PENDING_PAYMENT) return null;
    return order.autoCancelTime > 1577808000000 ? order.autoCancelTime - Date.now() : order.autoCancelTime;
  },

  onCountDownFinish() {
    //this.setData({ countDownTime: -1 });
    const { countDownTime, order } = this.data;
    if (countDownTime > 0 || (order && order.groupInfoVo && order.groupInfoVo.residueTime > 0)) {
      this.onRefresh();
    }
  },

  onGoodsCardTap(e) {
    const { index } = e.currentTarget.dataset;
    const goods = this.data.order.orderItemVOs[index];
    wx.navigateTo({ url: `/pages/goods/details/index?spuId=${goods.spuId}` });
  },

  async onEditAddressTap() {
    const deliveryInfoPromise = getAddressPromise();
    // TODO: check url param
    wx.navigateTo({
      url: `/pages/usercenter/address/list/index?selectMode=true`,
    });
    try {
      const deliveryInfo = await deliveryInfoPromise;
      try {
        await updateOrderDeliveryInfo({ orderId: this.data.order._id, deliveryInfoId: deliveryInfo._id });
        this.setData({
          'order.delivery_info._id': deliveryInfo._id,
          'order.delivery_info.phone': deliveryInfo.phone,
          'order.delivery_info.address': deliveryInfo.address,
          'order.delivery_info.name': deliveryInfo.name,
        });
      } catch (e) {
        console.error(e);
        this.toast('更新地址失败');
      }
    } catch {}
  },

  onOrderNumCopy() {
    wx.setClipboardData({
      data: this.data.order.orderNo,
    });
  },

  onDeliveryNumCopy() {
    wx.setClipboardData({
      data: this.data.order.logisticsVO.logisticsNo,
    });
  },

  onToInvoice() {
    wx.navigateTo({
      url: `/pages/order/invoice/index?orderNo=${this.data._order.orderNo}`,
    });
  },

  onSuppleMentInvoice() {
    wx.navigateTo({
      url: `/pages/order/receipt/index?orderNo=${this.data._order.orderNo}`,
    });
  },

  onDeliveryClick() {
    const logisticsData = {
      nodes: this.data.logisticsNodes,
      company: this.data.order.logisticsVO.logisticsCompanyName,
      logisticsNo: this.data.order.logisticsVO.logisticsNo,
      phoneNumber: this.data.order.logisticsVO.logisticsCompanyTel,
    };
    wx.navigateTo({
      url: `/pages/order/delivery-detail/index?data=${encodeURIComponent(JSON.stringify(logisticsData))}`,
    });
  },

  /** 跳转订单评价 */
  navToCommentCreate() {
    wx.navigateTo({
      url: `/pages/order/createComment/index?orderNo=${this.orderNo}`,
    });
  },

  /** 跳转拼团详情/分享页*/
  toGrouponDetail() {
    wx.showToast({ title: '点击了拼团' });
  },

  clickService() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '您点击了联系客服',
    });
  },

  onOrderInvoiceView() {
    wx.navigateTo({
      url: `/pages/order/invoice/index?orderNo=${this.orderNo}`,
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
    orderListShouldFresh();
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },
});
