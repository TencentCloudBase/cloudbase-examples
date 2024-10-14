import { model, getAll } from '../../services/_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from "../../config/index"

const ORDER_MODEL_KEY = DATA_MODEL_KEY.ORDER;

const ORDER_STATUS_INFO = {
  TO_PAY: { value: 'TO_PAY', label: '待付款' },
  TO_SEND: { value: 'TO_SEND', label: '待发货' },
  TO_RECEIVE: { value: 'TO_RECEIVE', label: '待收货' },
  FINISHED: { value: 'FINISHED', label: '已完成' },
  CANCELED: { value: 'CANCELED', label: '已取消' },
  RETURN_APPLIED: { value: 'RETURN_APPLIED', label: '申请退货' },
  RETURN_REFUSED: { value: 'RETURN_REFUSED', label: '拒绝退货申请' },
  RETURN_FINISH: { value: 'RETURN_FINISH', label: '退货完成' },
  RETURN_MONEY_REFUSED: { value: 'RETURN_MONEY_REFUSED', label: '拒绝退款' },
};

export const ORDER_STATUS = new Proxy(ORDER_STATUS_INFO, {
  get(target, prop) {
    return target[prop]?.value;
  },
});

export const orderStatusToName = (status) => Object.values(ORDER_STATUS_INFO).find((x) => x.value === status)?.label;

/**
 *
 * @param {{
 *   status: String,
 *   addressId: String
 * }} param0
 * @returns
 */
export async function createOrder({ status, addressId }) {
  return (
    await model()[ORDER_MODEL_KEY].create({
      data: {
        status,
        delivery_info: {
          _id: addressId,
        },
      },
    })
  ).data;
}

export function getAllOrder() {
  return getAll({
    name: ORDER_MODEL_KEY,
  });
}

/**
 *
 * @param {{
 *   pageSize: Number,
 *   pageNumber: Number,
 *   status?: String
 * }}} param0
 * @returns
 */
export async function listOrder({ pageSize, pageNumber, status }) {
  if (status != null) {
    return (
      await model()[ORDER_MODEL_KEY].list({
        filter: {
          where: {
            status: {
              $eq: status,
            },
          },
        },
        pageSize,
        pageNumber,
        getCount: true,
      })
    ).data;
  }
  return (
    await model()[ORDER_MODEL_KEY].list({
      filter: {},
      pageSize,
      pageNumber,
      getCount: true,
    })
  ).data;
}

async function getOrderCountOfStatus(status) {
  if (cloudbaseTemplateConfig.useMock) {
    return 0;
  }

  return (
    await model()[ORDER_MODEL_KEY].list({
      filter: { where: { status: { $eq: status } } },
      select: { _id: true },
      getCount: true,
    })
  ).data.total;
}

export async function getToPayOrderCount() {
  return getOrderCountOfStatus(ORDER_STATUS.TO_PAY);
}

export async function getToSendOrderCount() {
  return getOrderCountOfStatus(ORDER_STATUS.TO_SEND);
}

export async function getToReceiveOrderCount() {
  return getOrderCountOfStatus(ORDER_STATUS.TO_RECEIVE);
}

/**
 *
 * @param {String} orderId
 */
export async function getOrder(orderId) {
  return (
    await model()[ORDER_MODEL_KEY].get({
      filter: {
        where: {
          _id: { $eq: orderId },
        },
      },
      select: {
        $master: true,
        delivery_info: {
          _id: true,
          phone: true,
          address: true,
          name: true,
        },
      },
    })
  ).data;
}

export async function updateOrderDeliveryInfo({ orderId, deliveryInfoId }) {
  return model()[ORDER_MODEL_KEY].update({
    data: {
      delivery_info: {
        _id: deliveryInfoId,
      },
    },
    filter: {
      where: {
        _id: {
          $eq: orderId,
        },
      },
    },
  });
}

/**
 *
 * @param {{orderId: String, status: String}}} param0
 * @returns
 */
export async function updateOrderStatus({ orderId, status }) {
  return await model()[ORDER_MODEL_KEY].update({
    data: {
      status,
    },
    filter: {
      where: {
        _id: {
          $eq: orderId,
        },
      },
    },
  });
}