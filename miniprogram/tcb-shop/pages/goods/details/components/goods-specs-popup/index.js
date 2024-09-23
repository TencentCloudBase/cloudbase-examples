const ATTR_VALUE_STATUS = {
  PICKED: 'picked',
  UNPICKED: 'unpicked',
  DISABLED: 'disabled',
};

Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },

  properties: {
    title: String,
    show: {
      type: Boolean,
      value: false,
    },
    initProps: {
      type: Object,
      observer(initProps) {
        if (!initProps) {
          return;
        }
        const { skus, spu } = initProps;

        const attrValues = collectAttrValueSet(skus);
        const attrList = initAttrList(attrValues);

        this.calculateValue(attrList, skus);

        this.setData({
          skus,
          attrList,
          spu,
        });
      },
    },
    outOperateStatus: {
      type: String,
      value: 'no',
    },
  },

  data: {
    price: 0,
    imgSrc: '',
    max: 1,

    skus: [],
    attrList: [],
    spu: null,
    pickedSku: null,
    value: 1,
  },

  observers: {
    'spu, pickedSku': function (spu, pickedSku) {
      const imgSrc = pickedSku?.image ? pickedSku.image : spu.cover_image;
      this.setData({
        imgSrc,
      });
    },
    'skus, pickedSku': function (skus, pickedSku) {
      let max;
      let price;
      if (pickedSku != null) {
        max = pickedSku.count;
        price = pickedSku.price;
      } else {
        price = skus.reduce((acc, cur) => Math.min(acc, cur.price), Infinity);
        max = 1;
      }
      this.setData({ price, max });
    },
    max: function (max) {
      const { value } = this.data;
      if (value > max) {
        this.setData({
          value: max,
        });
      }
    },
    'attrList, skus': function (attrList, skus) {
      this.calculateValue(attrList, skus);
      const sku = this.pickOnlySku(attrList);
      sku && this.triggerEvent('picked');
      this.setData({ pickedSku: sku });
    },
  },

  methods: {
    clickAttrValue({
      target: {
        dataset: { attrValueIndex, attrNameIndex },
      },
    }) {
      const setAttrListWithCalculation = (attrList) => {
        const { skus } = this.data;
        this.calculateValue(attrList, skus);
        const sku = this.pickOnlySku(attrList);
        this.setData({ attrList, pickedSku: sku });
      };
      const { attrList } = this.data;

      const attrName = attrList[attrNameIndex];
      const attrValue = attrName.values[attrValueIndex];

      switch (attrValue.status) {
        case ATTR_VALUE_STATUS.UNPICKED:
          // pick it, and set others unpicked
          attrName.values.forEach((value) => {
            value.status = value === attrValue ? ATTR_VALUE_STATUS.PICKED : ATTR_VALUE_STATUS.UNPICKED;
          });
          setAttrListWithCalculation(attrList);
          break;
        case ATTR_VALUE_STATUS.DISABLED:
          // do nothing
          break;
        case ATTR_VALUE_STATUS.PICKED:
          // unpick it
          attrValue.status = ATTR_VALUE_STATUS.UNPICKED;
          setAttrListWithCalculation(attrList);
          break;
        default:
          // invalid status, skip
          return;
      }
    },

    /**
     *
     * @param {[]} attrList
     * @param {[]} skus
     */
    calculateValue(attrList, skus) {
      // Any row of attr values, should be filter out by picked attr values from rest of the rows.
      attrList.forEach((attrName, index) => {
        const restPickedValues = attrList
          .filter((_, i) => i !== index) // exclude current line
          .map((x) => x.values.find((y) => y.status === ATTR_VALUE_STATUS.PICKED))
          .filter((x) => x != null);

        const filteredSkus = skus.filter(
          (sku) =>
            sku.count > 0 &&
            contains({
              container: sku.attrValues,
              arr: restPickedValues,
              eq: (a, b) => a._id === b._id,
            }),
        );
        const filteredAttrValues = collectAttrValueSet(filteredSkus);

        attrName.values.forEach((value) => {
          if (filteredAttrValues.find((x) => x._id === value._id) == null) {
            value.status = ATTR_VALUE_STATUS.DISABLED;
          } else {
            if (value.status === ATTR_VALUE_STATUS.DISABLED) {
              value.status = ATTR_VALUE_STATUS.UNPICKED;
            }
          }
        });
      });
    },

    pickOnlySku(attrList) {
      const pickedAttrValues = attrList
        .map((x) => x.values.find((x) => x.status === ATTR_VALUE_STATUS.PICKED))
        .filter((x) => x != null);
      if (pickedAttrValues.length !== attrList.length) {
        // should pick more
        return null;
      }

      const { skus } = this.data;
      const pickedSku = skus.find(
        (sku) =>
          sku.attrValues.length === pickedAttrValues.length && // a and b have the same size
          sku.attrValues.every((x) => pickedAttrValues.find((y) => y._id === x._id) != null), // every item in a can be found in b
      );
      if (pickedSku == null) {
        console.error(
          'Something went wrong! With enough picked attr values, an sku should be picked! Picked attr values:',
          pickedAttrValues,
        );
        return null;
      }
      return pickedSku;
    },

    specsConfirm() {
      if (this.data.outOperateStatus === 'cart') {
        this.addCart();
      } else if (this.data.outOperateStatus === 'buy') {
        this.buyNow();
      }
    },

    handlePopupHide() {
      this.triggerEvent('closeSpecsPopup', {
        show: false,
      });
    },

    addCart() {
      const { pickedSku, max, value } = this.properties;
      if (pickedSku == null) {
        return;
      }
      if (value > max) {
        return;
      }
      if (value < 1) {
        return;
      }
      this.triggerEvent('addCart', { pickedSku, count: value });
    },

    buyNow() {
      const { pickedSku, max, value } = this.properties;
      if (pickedSku == null) {
        return;
      }
      if (value > max) {
        return;
      }
      if (value < 1) {
        return;
      }
      this.triggerEvent('buyNow', { pickedSku, count: value });
    },

    handleBuyNumChange({ detail: { value } }) {
      this.setData({ value });
    },
  },
  lifetimes: {},
});

/**
 *
 * @param {Array} attrValues
 * @returns {Array}
 */
function initAttrList(attrValues) {
  const list = attrValues.reduce((acc, cur) => {
    const item = acc.find((x) => x._id === cur.attr_name._id);
    if (item != null) {
      // already has this attr name, push value to this item
      if (item.values.find((x) => x._id === cur._id) != null) {
        // already has this attr value, do nothing
      } else {
        item.values.push({
          value: cur.value,
          _id: cur._id,
          status: ATTR_VALUE_STATUS.UNPICKED,
        });
      }
    } else {
      // not added attr kind, make a new one
      acc.push({
        ...cur.attr_name,
        values: [
          {
            value: cur.value,
            _id: cur._id,
            status: ATTR_VALUE_STATUS.UNPICKED,
          },
        ],
      });
    }
    return acc;
  }, []);
  return list;
}

/**
 *
 * @param {{container: Array, arr: Array, eq: (a, b) => boolean}} param0
 * @returns
 */
function contains({ container, arr, eq }) {
  return arr.every((itemInArr) => container.findIndex((x) => eq(x, itemInArr)) !== -1);
}

/**
 *
 * @param {Array} skus
 */
function collectAttrValueSet(skus) {
  const attrValues = skus.reduce((acc, sku) => {
    sku.attrValues.forEach((value) => {
      if (acc.find((x) => x._id === value._id) != null) {
        // exists, skip
      } else {
        acc.push(Object.assign({}, value));
      }
    });
    return acc;
  }, []);
  return attrValues;
}
