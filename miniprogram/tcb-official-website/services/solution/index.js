import { getAll } from '../_utils/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import {SolutionData} from '../cloudbaseMock/index'
import { DATA_MODEL_KEY } from '../../config/model'

/** 获取解决方案数据 */
export async function fetchSolutionData() {
  if (cloudbaseTemplateConfig.useMock) {
    /** 返回解决方案mock数据 */
    return SolutionData;
  }

  return await getAll({
    name: DATA_MODEL_KEY.SOLUTION_LIST
  });
}
