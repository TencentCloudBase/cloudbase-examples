import { mockIp, mockReqId } from '../../utils/mock';

export function genOrders(params) {
  const resp = {
    data: {
      pageNum: 1,
      pageSize: 10,
      totalCount: 7,
      orders: [],
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 113,
    success: true,
  };
  const { pageNum, pageSize, orderStatus } = params.parameter;
  // 实现筛选
  if (orderStatus > -1) {
    resp.data.orders = resp.data.orders.filter((order) => order.orderStatus === orderStatus);
  }
  // 实现分页
  resp.data.pageNum = pageNum;
  resp.data.pageSize = pageSize;
  resp.data.orders = resp.data.orders.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  return resp;
}

export function genOrdersCount() {
  const resp = {
    data: [
      { tabType: 5, orderNum: 1 },
      { tabType: 10, orderNum: 1 },
      { tabType: 40, orderNum: 1 },
      { tabType: 50, orderNum: 2 },
    ],
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 41,
    success: true,
  };
  return resp;
}
