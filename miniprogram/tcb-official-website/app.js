import { init } from '@cloudbase/wx-cloud-client-sdk';
import updateManager from './common/updateManager';

wx.cloud.init({
  env: 'your-env-id', // 指定云开发环境 ID
});
const client = init(wx.cloud);
const models = client.models;
// 接下来就可以调用 models 上的数据模型增删改查等方法了
globalThis.dataModel = models;

App({
  onLaunch: async function () { },
  onShow: function () {
    // 管理小程序的更新。主要功能包括：检查更新，下载新版本，提示用户更新
    updateManager();
  },
});
