import { getAll } from '../_utils/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { IndexData} from '../cloudbaseMock/index'
import { DATA_MODEL_KEY } from '../../config/model'

/** 获取企业信息数据 */
export function fetchIndexData() {
  if (cloudbaseTemplateConfig.useMock) {
    /** 返回企业信息 mock数据 */
    return IndexData;
  }
  return getAll({
    name: DATA_MODEL_KEY.INDEX_DATA,
  });
}
