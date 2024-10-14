import { getAll } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from "../../config/index"
import { ATTR_VALUE } from "../cloudbaseMock/index"

const ATTR_VALUE_MODEL_KEY = DATA_MODEL_KEY.ATTR_VALUE;

export async function getAllAttrValues(skuId) {
  if (cloudbaseTemplateConfig.useMock) {
    return ATTR_VALUE.filter(x => x.sku.find(x => x._id === skuId))
  }
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
      sku: {
        _id: true
      }
    },
  });
  return res;
}
