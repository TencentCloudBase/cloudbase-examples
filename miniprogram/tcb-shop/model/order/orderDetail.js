import { mockIp, mockReqId } from '../../utils/mock';

const orderResps = [];

export function genOrderDetail(params) {
  const { parameter } = params;
  const resp = orderResps.find((r) => r.data.orderNo === parameter);
  return resp;
}

export function genBusinessTime() {
  const resp = {
    data: {
      businessTime: ['周一,周二,周三,周四,周五:00:20:00-08:00:00'],
      telphone: '18565372257',
      saasId: '88888888',
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 3,
    success: true,
  };
  return resp;
}
