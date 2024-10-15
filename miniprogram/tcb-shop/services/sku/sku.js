import { model, getAll } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { SKU, SPU, ATTR_VALUE } from '../cloudbaseMock/index';

const SKU_MODEL_KEY = DATA_MODEL_KEY.SKU;

/**
 *
 * @param {String} skuId
 */
export async function getSkuDetail(skuId) {
  if (cloudbaseTemplateConfig.useMock) {
    const sku = SKU.find((x) => x._id === skuId);
    sku.attr_value = ATTR_VALUE.filter((x) => x.sku.find((x) => x._id === skuId));
    sku.spu = SPU.find((spu) => spu._id === sku.spu._id);
    return sku;
  }

  const { data } = await model()[SKU_MODEL_KEY].get({
    filter: {
      where: {
        _id: { $eq: skuId },
      },
    },
    select: {
      _id: true,
      count: true,
      price: true,
      image: true,
      attr_value: {
        value: true,
        _id: true,
      },
      spu: {
        name: true,
      },
    },
  });
  return data;
}

export async function updateSku({ skuId, data }) {
  if (cloudbaseTemplateConfig.useMock) {
    SKU.find((x) => x._id === skuId).count = data.count;
    return;
  }

  return wx.cloud.callFunction({
    // 云函数名称
    name: 'shop_update_sku',
    // 传给云函数的参数
    data: {
      skuId,
      data,
    },
  });
}

export async function getAllSku(spuId) {
  if (cloudbaseTemplateConfig.useMock) {
    return SKU.filter((x) => x.spu._id === spuId);
  }
  return getAll({
    name: SKU_MODEL_KEY,
    filter: {
      where: {
        spu: {
          $eq: spuId,
        },
      },
    },
  });
}
