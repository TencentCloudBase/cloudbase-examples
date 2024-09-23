Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },

  properties: {
    goods: {
      type: Object,
      value: null,
      observer(goods) {
        if (!goods) {
          return;
        }
        this.setData({
          goodsWithoutAttrValue: {
            ...goods,
            sku: {
              ...goods.sku,
              attr_value: [],
            },
          },
        });
      },
    },
    show: {
      type: Boolean,
      value: false,
    },
    thumbMode: {
      type: String,
      value: 'aspectFit',
    },
  },

  data: {
    goodsWithoutAttrValue: null,
  },
  methods: {
    onClose() {
      this.triggerEvent('close');
    },

    onCloseOver() {
      this.triggerEvent('closeover');
    },
  },
});
