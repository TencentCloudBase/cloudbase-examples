import { DATA_MODEL_KEY } from '../../config/model';
import { getAll, model } from '../_utils/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { DELIVERY_INFO, createId } from '../cloudbaseMock/index';

const DELIVERY_INFO_MODEL_KEY = DATA_MODEL_KEY.DELIVERY_INFO;

export async function getAllAddress() {
  if (cloudbaseTemplateConfig.useMock) {
    return DELIVERY_INFO;
  }
  return getAll({
    name: DELIVERY_INFO_MODEL_KEY,
    select: {
      _id: true,
      phone: true,
      address: true,
      name: true,
    },
  });
}

/**
 *
 * @param {{
 *   name: String,
 *   address: String,
 *   phone: String,
 * }} param0
 * @returns
 */
export function createAddress({ name, address, phone }) {
  if (cloudbaseTemplateConfig.useMock) {
    DELIVERY_INFO.push({
      address,
      name,
      phone,
      _id: createId(),
    });
    return;
  }
  return model()[DELIVERY_INFO_MODEL_KEY].create({
    data: {
      name,
      address,
      phone,
    },
  });
}

/**
 *
 * @param {{
 *   name,
 *   address,
 *   phone,
 *   _id
 * }} param0
 */
export function updateAddress(props) {
  const { name, address, phone, _id } = props;
  if (cloudbaseTemplateConfig.useMock) {
    Object.assign(
      DELIVERY_INFO.find((x) => x._id === _id),
      props,
    );
    return;
  }
  return model()[DELIVERY_INFO_MODEL_KEY].update({
    data: {
      name,
      address,
      phone,
    },
    filter: {
      where: {
        _id: { $eq: _id },
      },
    },
  });
}

export function deleteAddress({ id }) {
  if (cloudbaseTemplateConfig.useMock) {
    DELIVERY_INFO.splice(
      DELIVERY_INFO.findIndex((x) => x._id === id),
      1,
    );
    return;
  }
  return model()[DELIVERY_INFO_MODEL_KEY].delete({
    filter: {
      where: {
        _id: {
          $eq: id,
        },
      },
    },
  });
}

export async function getAddress({ id }) {
  return (
    await model()[DELIVERY_INFO_MODEL_KEY].get({
      filter: {
        where: {
          _id: {
            $eq: id,
          },
        },
      },
    })
  ).data;
}
