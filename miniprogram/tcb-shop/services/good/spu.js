import { model } from '../_utils/model';
import { getCloudImageTempUrl } from '../../utils/cloudImageHandler';
import { SPU_SELLING_STATUS } from '../../utils/spuStatus';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { SPU, SKU } from '../cloudbaseMock/index';

const SPU_MODEL_KEY = DATA_MODEL_KEY.SPU;
const SKU_MODEL_KEY = DATA_MODEL_KEY.SKU;

/**
 *
 * @param {{
 *   pageSize: Number,
 *   pageNumber: Number,
 *   cateId: String,
 *   search: String
 * }}} param0
 * @returns
 */
export async function listGood({ pageSize, pageNumber, search }) {
  if (cloudbaseTemplateConfig.useMock) {
    const records = search ? SPU.filter((x) => x.name.includes(search)) : SPU;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      records: records.slice(startIndex, endIndex),
      total: records.length,
    };
  }
  const filter = {
    where: {
      status: { $eq: SPU_SELLING_STATUS },
    },
  };
  if (search) {
    filter.where.name = { $search: search };
  }

  return (
    await model()[SPU_MODEL_KEY].list({
      filter,
      pageSize,
      pageNumber,
      getCount: true,
      orderBy: [{ priority: 'desc' }],
    })
  ).data;
}

export async function getPrice(spuId) {
  if (cloudbaseTemplateConfig.useMock) {
    return SKU.find((x) => x.spu._id === spuId).price;
  }
  const {
    data: { records },
  } = await model()[SKU_MODEL_KEY].list({
    filter: {
      where: {
        spu: {
          $eq: spuId,
        },
      },
    },
    select: {
      $master: true,
      spu: {
        _id: true,
      },
    },
  });
  return records[0].price;
}

export async function handleSpuCloudImage(spu) {
  if (spu == null) {
    return;
  }
  const handledImages = await getCloudImageTempUrl([spu.cover_image, ...spu.swiper_images]);
  handledImages.forEach((image, index) => {
    if (index === 0) {
      spu.cover_image = image;
      return;
    }
    spu.swiper_images[index - 1] = image;
  });
}

export async function getSpu(spuId) {
  if (cloudbaseTemplateConfig.useMock) {
    return SPU.find((x) => x._id === spuId);
  }
  return (
    await model()[SPU_MODEL_KEY].get({
      filter: {
        where: { _id: { $eq: spuId } },
      },
    })
  ).data;
}
