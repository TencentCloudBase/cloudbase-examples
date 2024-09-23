import { getSkuDetail } from '../../../services/sku/sku';
import { getOrderItem } from '../../../services/order/orderItem';
import { getCommentsOfSpu } from '../../../services/comments/comments';
import { LIST_LOADING_STATUS } from '../../../utils/listLoading';
import dayjs from 'dayjs';

const layoutMap = {
  0: 'vertical',
};
Page({
  data: {
    commentList: [],
    layoutText: layoutMap[0],
    loadMoreStatus: 0,
    spuId: null,
  },

  pageNumber: 1,
  pageSize: 10,

  async loadComments(refresh = false) {
    refresh && (this.pageNumber = 1);

    this.setData({ loadMoreStatus: LIST_LOADING_STATUS.LOADING });

    const { spuId } = this.data;
    const { pageNumber, pageSize } = this;
    try {
      const { records: newComments, total } = await getCommentsOfSpu({ spuId, pageNumber, pageSize });
      await Promise.all(
        newComments.map(async (x) => {
          const orderItemId = x.order_item._id;
          const {
            sku: { _id: skuId },
          } = await getOrderItem(orderItemId);
          const sku = await getSkuDetail(skuId);
          x.desc = sku.attr_value.map((x) => x.value).join('，');
          x.createdTimeString = dayjs(new Date(x.createdAt)).format('YYYY-MM-DD HH:mm:ss');
          x.user = x.createBy.substring(0, 10);
        }),
      );

      this.pageNumber++;
      const commentList = refresh ? newComments : this.data.commentList.concat(newComments);
      if (commentList.length >= total) {
        this.setData;
      }
      this.setData({
        commentList,
        loadMoreStatus: commentList.length >= total ? LIST_LOADING_STATUS.NO_MORE : LIST_LOADING_STATUS.READY,
      });
    } catch (e) {
      console.error(e);
      this.setData({ loadMoreStatus: LIST_LOADING_STATUS.FAILED });
    }
  },

  async onLoad(options) {
    const spuId = options?.spuId;
    if (typeof spuId !== 'string') {
      this.setData({ loadMoreStatus: LIST_LOADING_STATUS.FAILED });
    } else {
      this.setData({ spuId });
    }

    this.loadComments(true);
  },
  onReachBottom() {
    if (this.data.loadMoreStatus == LIST_LOADING_STATUS.READY) this.loadComments(false);
  },
});
