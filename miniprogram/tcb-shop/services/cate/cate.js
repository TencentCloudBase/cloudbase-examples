/* eslint-disable eqeqeq */
import { model, getAll } from '../_utils/model';
import { getCloudImageTempUrl } from '../../utils/cloudImageHandler';
import { SPU_SELLING_STATUS } from '../../utils/spuStatus';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { CATEGORY, SPU } from '../cloudbaseMock/index';

const CATE_MODEL_KEY = DATA_MODEL_KEY.CATE;

// TODO: we should do pagination
export async function getAllSpuOfCate(cateId) {
  if (cloudbaseTemplateConfig.useMock) {
    return { spu: CATEGORY.find((x) => x._id === cateId).spu.map(({ _id }) => SPU.find((x) => x._id === _id)) };
  }

  return (
    await model()[CATE_MODEL_KEY].get({
      filter: {
        where: {
          _id: {
            $eq: cateId,
          },
        },
        relateWhere: {
          spu: {
            where: {
              status: {
                $eq: SPU_SELLING_STATUS,
              },
            },
          },
        },
      },
      select: {
        spu: {
          $master: true,
        },
      },
    })
  ).data;
}

export async function getCates() {
  if (cloudbaseTemplateConfig.useMock) {
    return CATEGORY.filter((x) => x.child_cate?.length > 0);
  }
  const cateSelect = {
    _id: true,
    name: true,
    image: true,
  };

  const allCates = (
    await getAll({
      name: CATE_MODEL_KEY,
      select: {
        ...cateSelect,
        child_cate: cateSelect,
      },
    })
  ).filter((c) => c.child_cate.length !== 0);

  const childCates = allCates.flatMap((c) => c.child_cate);
  const res = await getCloudImageTempUrl(childCates.map((x) => x.image));
  res.forEach((image, index) => (childCates[index].image = image));
  return allCates;
}
