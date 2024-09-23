import { getAll } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';

const ATTR_VALUE_MODEL_KEY = DATA_MODEL_KEY.ATTR_VALUE;

export async function getAllAttrValues(skuId) {
  const res = await getAll({
    name: ATTR_VALUE_MODEL_KEY,
    filter: {
      relateWhere: {
        sku: {
          where: {
            _id: {
              $eq: skuId,
            },
          },
        },
      },
    },
    select: {
      _id: true,
      value: true,
      attr_name: {
        _id: true,
        name: true,
      },
    },
  });
  return res;
}
