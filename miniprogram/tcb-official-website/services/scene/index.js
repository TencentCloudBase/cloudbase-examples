import { getAll, getOne } from '../_utils/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import {SceneData, SolutionData, NewsData} from '../cloudbaseMock/index'
import { DATA_MODEL_KEY } from '../../config/model'

/** 获取应用场景数据 */
export async function fetchSceneData(params) {
  if (cloudbaseTemplateConfig.useMock) {
    /** 返回应用场景 mock数据 */
    return SceneData;
  }
  return await getAll({
    name: DATA_MODEL_KEY.SCENE_LIST
  });
}

/** 获取应用场景数据详情 */
export async function fetchSceneDetail(id,type) {
  const NAMES = {
    news: DATA_MODEL_KEY.NEWS_LIST,
    scene: DATA_MODEL_KEY.SCENE_LIST,
    solution: DATA_MODEL_KEY.SOLUTION_LIST
  }
  if (cloudbaseTemplateConfig.useMock) {
    /** 返回应用场景 mock数据 */
    if(type === 'news'){
      return NewsData.find((item)=> item?._id === id);
    }else if(type === 'scene'){
      return SceneData.find((item)=> item?._id === id);
    }else if(type === 'solution'){
      return SolutionData.find((item)=> item?._id === id);
    }
  }
  return await getOne({
    name: NAMES[type],
    _id:id
  });
}