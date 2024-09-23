import { orderStatusToName } from '../../../../services/order/order';

Component({
  externalClasses: ['wr-class', 'header-class', 'title-class'],

  options: {
    multipleSlots: true,
  },

  relations: {
    '../order-goods-card/index': {
      type: 'descendant',
      linked(target) {
        this.children.push(target);
        this.setHidden();
      },
      unlinked(target) {
        this.children = this.children.filter((item) => item !== target);
      },
    },
    '../goods-card/index': {
      type: 'descendant',
      linked(target) {
        this.children.push(target);
        this.setHidden();
      },
      unlinked(target) {
        this.children = this.children.filter((item) => item !== target);
      },
    },
    '../specs-goods-card/index': {
      type: 'descendant',
      linked(target) {
        this.children.push(target);
        this.setHidden();
      },
      unlinked(target) {
        this.children = this.children.filter((item) => item !== target);
      },
    },
  },

  created() {
    this.children = [];
  },

  properties: {
    order: {
      type: Object,
      observer(order) {
        const goodsCount = order?.orderItems?.length;
        if (typeof goodsCount !== 'number') return;

        this.setData({
          goodsCount,
        });
      },
    },
    useTopLeftSlot: Boolean,
    useTopRightSlot: Boolean,
    //  初始显示的商品数量，超出部分会隐藏。
    defaultShowNum: {
      type: null,
      value: 10,
    },
  },

  data: {
    showAll: true, // 是否展示所有商品，设置为false，可以使用展开更多功能
    goodsCount: 0,
  },

  methods: {
    setHidden() {
      const isHidden = !this.data.showAll;
      this.children.forEach((c, i) => i >= this.properties.defaultShowNum && c.setHidden(isHidden));
    },

    onOrderCardTap() {
      this.triggerEvent('cardtap');
    },

    onShowMoreTap() {
      this.setData({ showAll: true }, () => this.setHidden());
      this.triggerEvent('showall');
    },
  },
});
