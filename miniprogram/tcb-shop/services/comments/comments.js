import { model } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { COMMENTS } from '../cloudbaseMock/index';

const COMMENT_MODEL_KEY = DATA_MODEL_KEY.COMMENT;

export async function getGoodsDetailCommentInfo(spuId) {
  if (cloudbaseTemplateConfig.useMock) {
    const all = COMMENTS.filter((x) => x.spu._id === spuId);
    const good = all.filter((x) => x.rating > 3);
    const firstAndTotal = (x) => ({
      data: {
        records: x.length === 0 ? [] : [x[0]],
        total: x.length,
      },
    });
    return Promise.resolve([firstAndTotal(all), firstAndTotal(good)]);
  }

  const firstAndCount = () =>
    model()[COMMENT_MODEL_KEY].list({
      filter: {
        relateWhere: {
          spu: {
            where: {
              _id: {
                $eq: spuId,
              },
            },
          },
        },
      },
      select: {
        $master: true,
        spu: {
          _id: true,
        },
      },
      orderBy: [{ rating: 'desc' }],
      pageNumber: 1,
      pageSize: 1,
      getCount: true,
    });
  const goodCount = () =>
    model()[COMMENT_MODEL_KEY].list({
      filter: {
        relateWhere: {
          spu: {
            where: {
              _id: {
                $eq: spuId,
              },
            },
          },
        },
        where: {
          rating: {
            $gt: 3,
          },
        },
      },
      select: {
        $master: true,
      },
      pageNumber: 1,
      pageSize: 1,
      getCount: true,
    });

  return await Promise.all([firstAndCount(), goodCount()]);
}

export async function getCommentsOfSpu({ spuId, pageNumber, pageSize }) {
  if (cloudbaseTemplateConfig.useMock) {
    const all = COMMENTS.filter((x) => x.spu._id === spuId);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const records = all.slice(startIndex, endIndex);
    return {
      records,
      total: all.length,
    };
  }
  return (
    await model()[COMMENT_MODEL_KEY].list({
      select: {
        $master: true,
        order_item: {
          _id: true,
        },
        spu: {
          _id: true,
        },
      },
      filter: {
        relateWhere: {
          spu: {
            where: {
              _id: {
                $eq: spuId,
              },
            },
          },
        },
      },
      pageSize,
      pageNumber,
      getCount: true,
    })
  ).data;
}

/**
 *
 * @param {{
 *   orderItemId: string,
 *   content: string,
 *   rating: number,
 *   spuId: string
 * }} param0
 */
export function createComment({ orderItemId, content, rating, spuId }) {
  return model()[COMMENT_MODEL_KEY].create({
    data: {
      content,
      rating,
      order_item: {
        _id: orderItemId,
      },
      spu: {
        _id: spuId,
      },
    },
  });
}
