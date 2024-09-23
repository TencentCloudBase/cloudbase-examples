/* eslint-disable */
import { mockIp, mockReqId } from '../../../utils/mock';

export const resp = {
  data: {
    pageNum: 1,
    pageSize: 10,
    totalCount: 51,
    states: {
      audit: 1,
      approved: 6,
      complete: 2,
      closed: 1,
    },
    dataList: [],
  },
  code: 'Success',
  msg: null,
  requestId: mockReqId(),
  clientIp: mockIp(),
  rt: 79,
  success: true,
};

export function getRightsList({ parameter: { afterServiceStatus, pageNum } }) {
  const _resq = JSON.parse(JSON.stringify(resp));
  if (pageNum > 3) _resq.data.dataList = [];
  if (afterServiceStatus > -1) {
    _resq.data.dataList = _resq.data.dataList.filter((item) => item.rights.rightsStatus === afterServiceStatus);
  }
  return Promise.resolve(_resq);
}
