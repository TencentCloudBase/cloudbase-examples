import { model } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { HOME_SWIPER } from '../cloudbaseMock/index';

const HOME_SWIPER_MODEL_KEY = DATA_MODEL_KEY.HOME_SWIPER;

export async function getHomeSwiper() {
  if (cloudbaseTemplateConfig.useMock) {
    return HOME_SWIPER[0];
  }

  return (await model()[HOME_SWIPER_MODEL_KEY].list({ select: { images: true } })).data.records[0];
}
