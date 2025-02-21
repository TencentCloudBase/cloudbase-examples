
export const guide = `agent ui组件配置不正确，请参照使用说明进行配置。

## 使用说明

### 1、前置条件

#### 1.1、开通微信云开发
agent ui 小程序组件依赖微信云开发 AI 服务，需要开通微信云开发服务。

开通方式

![](https://qcloudimg.tencent-cloud.cn/raw/f06ca4761f54ecc8ed8d9644229c92f9.png)

如已开通微信云开发服务，请跳转至云开发平台(\`https://tcb.cloud.tencent.com/dev\`)创建AI服务。

#### 1.2、创建AI服务
- 方式一：直接使用agent智能体服务
 ![](https://qcloudimg.tencent-cloud.cn/raw/97786aaaa15aa1f23e9bbd39a7a6762f.png)

- 方式二：接入大模型
 ![](https://qcloudimg.tencent-cloud.cn/raw/876d2238b5331a7bdcbd91a1b38b8248.png)

### 2、配置 agent ui 小程序组件
#### 2.1、配置云开发环境ID
打开\`miniprogram/app.js\`文件，配置云开发环境ID。
\`\`\`js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "",// 环境id
        traceUser: true,
      });
    }

    this.globalData = {};
  },
});
\`\`\`
#### 2.1、 agent ui 小程序组件配置
打开小程序\`miniprogram/pages/index/index.js\`文件，配置 agent ui 小程序组件。

组件参数说明如下：

| 参数名称  | 参数说明         | 参数类型 | 是否必填 | 默认值 |
| --------- | ---------------- | -------- | -------- | ------ |
| type      | 对接ai服务类型   | String   | 是       | -      |
| botId     | agent ID         | String   | 否       | -      |
| modelName | ai大模型服务商   | String   | 否       | -      |
| model     | 具体使用的大模型 | String   | 否       | -      |
| logo     | 图标 | String   | 否       | -      |
| welcomeMessage     | 欢迎语 | String   | 否       | -      |

对接 agent 服务时，type 为 bot，botId 必填，配置如下：
\`\`\`js
agentConfig: {
      type: "bot",
      botId: "bot-e7d1e736", 
      modelName: "", 
      model:"",
      logo:"",
      welcomeMessage:""
    } 
\`\`\`
对接 ai 大模型服务时，type 为 model，modelName 和 modelName必填，配置如下：
\`\`\`js
agentConfig: {
      type: "model",
      botId: "", 
      modelName: "hunyuan", 
      model:"hunyuan-lite",
      logo:"",
      welcomeMessage:"" 
    } 
\`\`\`
`;
export const checkConfig = (config) => {
  const { type, botId, modelName, model } = config
  // 检测AI能力，不存在提示用户
  if(!wx.cloud.extend||!wx.cloud.extend.AI){
    return [false,'使用AI能力需基础库为3.7.7及以上，请升级基础库版本']
  }
  if (!['bot', 'model'].includes(type)) {
    return [false, 'type 不正确，值应为“bot”或“model”']
  }
  if (type === 'bot' && !botId) {
    return [false, '当前type值为bot，请配置botId']
  }
  if (type === 'model' && (!modelName || !model)) {
    return [false, '当前type值为model，请配置modelNam和model']
  }
  return [true, '']
}