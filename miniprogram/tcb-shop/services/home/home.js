import { model } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';

const HOME_SWIPER_MODEL_KEY = DATA_MODEL_KEY.HOME_SWIPER;

export async function getHomeSwiper() {
  return (await model()[HOME_SWIPER_MODEL_KEY].list({ select: { images: true } })).data.records[0];
}
