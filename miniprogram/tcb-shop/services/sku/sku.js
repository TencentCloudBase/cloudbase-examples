import { model, getAll } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';

const SKU_MODEL_KEY = DATA_MODEL_KEY.SKU;

/**
 *
 * @param {String} skuId
 */
export async function getSkuDetail(skuId) {
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
