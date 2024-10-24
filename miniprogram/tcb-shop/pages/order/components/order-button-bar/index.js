import Dialog from 'tdesign-miniprogram/dialog/index';
import { ORDER_STATUS, updateOrderStatus } from '../../../../services/order/order';
import { pay, refund } from '../../../../services/pay/pay';
import { OrderButtonTypes } from '../../config';
import { objectToParamString } from '../../../../utils/util';
import { OPERATION_TYPE } from '../../../../utils/orderOperation';

const OPERATION_DONE_EVENT = 'operation';

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    order: {
      type: Object,
      observer(order) {
        this.init(order);
      },
    },
    goodsIndex: {
      type: Number,
      value: null,
    },
    isBtnMax: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    order: {},
    buttons: {
      left: [],
      right: [],
    },
  },

  methods: {
    // 点击【订单操作】按钮，根据按钮类型分发
    onOrderBtnTap(e) {
      const { type } = e.currentTarget.dataset;
      switch (type) {
        case OrderButtonTypes.CANCEL:
          this.onCancel(this.data.order);
          break;
        case OrderButtonTypes.CONFIRM:
          this.onConfirm(this.data.order);
          break;
        case OrderButtonTypes.PAY:
          this.onPay(this.data.order);
          break;
        case OrderButtonTypes.APPLY_REFUND:
          this.onApplyRefund(this.data.order);
          break;
        case OrderButtonTypes.COMMENT:
          this.onAddComment(this.data.order);
          break;
      }
    },

    checkOrder(order, operationType) {
      if (order != null) {
        return true;
      }
      this.triggerEvent(OPERATION_DONE_EVENT, {
        type: operationType,
        message: 'no order',
        success: false,
      });
      return false;
    },

    async onCancel(order) {
      if (!this.checkOrder(order, OPERATION_TYPE.CANCEL)) return;

      // if order is paid, we should first refund
      if (order.status !== ORDER_STATUS.TO_PAY) {
        try {
          await refund(order._id);
        } catch (e) {
          this.triggerEvent(OPERATION_DONE_EVENT, {
            type: OPERATION_TYPE.CANCEL,
            message: 'refund failed',
            success: false,
            detail: e,
          });
          return;
        }
      }

      try {
        await updateOrderStatus({ orderId: order._id, status: ORDER_STATUS.CANCELED });
      } catch (e) {
        this.triggerEvent(OPERATION_DONE_EVENT, {
          type: OPERATION_TYPE.CANCEL,
          message: 'update order status failed',
          success: false,
          detail: e,
        });
        return;
      }

      this.triggerEvent(OPERATION_DONE_EVENT, {
        type: OPERATION_TYPE.CANCEL,
        success: true,
      });
    },

    async onConfirm(order) {
      if (!this.checkOrder(order, OPERATION_TYPE.CONFIRM)) return;

      try {
        await Dialog.confirm({
          title: '确认是否已经收到货？',
          content: '',
          confirmBtn: '确认收货',
          cancelBtn: '取消',
        });
      } catch (e) {
        this.triggerEvent(OPERATION_DONE_EVENT, {
          type: OPERATION_TYPE.CONFIRM,
          message: 'confirm dialog failed',
          success: false,
          detail: e,
        });
        return;
      }

      try {
        await updateOrderStatus({ orderId: order._id, status: ORDER_STATUS.FINISHED });
      } catch (e) {
        this.triggerEvent(OPERATION_DONE_EVENT, {
          type: OPERATION_TYPE.CONFIRM,
          message: 'update order status failed',
          success: false,
          detail: e,
        });
      }

      this.triggerEvent(OPERATION_DONE_EVENT, {
        type: OPERATION_TYPE.CONFIRM,
        success: true,
      });
    },

    async onPay(order) {
      if (!this.checkOrder(order, OPERATION_TYPE.PAY)) return;

      try {
        await pay({ id: order._id, totalPrice: order.totalPrice });
        try {
          await updateOrderStatus({ orderId: order._id, status: ORDER_STATUS.TO_SEND });
        } catch (e) {
          console.error(e);
          this.triggerEvent(OPERATION_DONE_EVENT, {
            type: OPERATION_TYPE.PAY,
            message: 'pay failed',
            success: false,
            detail: e,
          });
          return;
        }
      } catch (e) {
        this.triggerEvent(OPERATION_DONE_EVENT, {
          type: OPERATION_TYPE.PAY,
          message: 'pay failed',
          success: false,
          detail: e,
        });
        return;
      }

      this.triggerEvent(OPERATION_DONE_EVENT, {
        type: OPERATION_TYPE.PAY,
        success: true,
      });
    },

    onApplyRefund(order) {
      wx.navigateTo({ url: `/pages/order/apply-service/index?${objectToParamString({ orderId: order._id })}` });
    },

    /** 添加订单评论 */
    onAddComment(order) {
      wx.navigateTo({
        url: `/pages/goods/comments/create-list/index?${objectToParamString({ orderId: order._id })}`,
      });
    },

    init(order) {
      if (order == null) return;

      if (order.status === ORDER_STATUS.TO_PAY) {
        this.setData({
          buttons: {
            left: [],
            right: [
              { type: OrderButtonTypes.CANCEL, name: '取消订单' },
              { type: OrderButtonTypes.PAY, name: '付款', primary: true },
            ],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.TO_SEND) {
        this.setData({
          buttons: {
            left: [],
            right: [{ type: OrderButtonTypes.CANCEL, name: '取消订单' }],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.TO_RECEIVE) {
        this.setData({
          buttons: {
            left: [],
            right: [{ type: OrderButtonTypes.CONFIRM, name: '确认收货', primary: true }],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.FINISHED) {
        this.setData({
          buttons: {
            left: [],
            right: [{ type: OrderButtonTypes.COMMENT, name: '评价', primary: true }],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.CANCELED) {
        this.setData({
          buttons: {
            left: [],
            right: [],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.RETURN_APPLIED) {
        this.setData({
          buttons: {
            left: [],
            right: [],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.RETURN_REFUSED) {
        this.setData({
          buttons: {
            left: [],
            right: [],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.RETURN_FINISH) {
        this.setData({
          buttons: {
            left: [],
            right: [],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.RETURN_MONEY_REFUSED) {
        this.setData({
          buttons: {
            left: [],
            right: [],
          },
        });
        return;
      }
    },
  },

  lifetimes: {
    attached() {
      this.init(this.data.order);
    },
  },
});
