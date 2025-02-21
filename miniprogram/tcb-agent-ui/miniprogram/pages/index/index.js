Page({
  data: {
    introduction: [
      {
        title: '极简配置',
        desc: "只需简单配置组件参数，对接腾讯云开发AI功能，支持最新deepseek大模型"
      },
      {
        title: '超小体积',
        desc: "超小的组件体积，提升组件加载速度和页面响应速度"
      },
      {
        title: '可自定义',
        desc: "源码级组件，可更具需要调整组件样式，扩充更多功能"
      }
    ],
    agentExpand: false,
    modelExpand: false,
    agentUiConfig: {
      initEnvID: `wx.cloud.init({
  env: "你的环境ID",
  traceUser: true,
});`,
      agentConfig: `data: {
    agentConfig: {
      type: "bot", 
      botId: "bot-xxxxxx", 
      modelName: "", 
      model: "", 
      logo: "",
      welcomeMessage: ""
    }
}`,
      modelConfig1: `data: {
  agentConfig: {
    type: "model", 
    botId: "", 
    modelName: "hunyuan-open", 
    model: "hunyuan-lite", 
    logo: "",
    welcomeMessage: ""
  }
}`,
      modelConfig2: `data: {
  agentConfig: {
    type: "model", 
    botId: "", 
    modelName: "deepseek", 
    model: "deepseek-r1", // 值为 “deepseek-r1” 或者 “deepseek-v3”
    logo: "",
    welcomeMessage: ""
  }
}`
    },
    params: [
      { name: 'type', type: "string", desc: "组件对接的AI类型，值为 'bot' 或者 'model'，为 'bot' 时，对接 agent 能力；为 'model' 时，对接大模型能力" },
      { name: 'botId', type: 'string', desc: "agent id，当 type = 'bot' 时，必填" },
      { name: 'modelName', type: 'string', desc: "大模型服务商，当 type = 'model' 时，必填，值为 'hunyuan-open' | 'hunyuan-exp' | 'deepseek'" },
      { name: 'model', type: 'string', desc: "具体使用的模型，当 type = 'model' 时，必填。与 modelName 组合使用，可选的组合 [{modelName:'hunyuan-open',model:'hunyuan-lite'},{modelName:'hunyuan-exp',model:'hunyuan-lite'},{modelName:'deepseek',model:'deepseek-r1'},{modelName:'deepseek',model:'deepseek-v3'},{modelName:'hunyuan-open',model:'hunyuan-vision'}]" },
      { name: 'logo', type: 'string', desc: "页面 logo，当 type = 'model' 时，选填" },
      { name: 'welcomeMessage', type: 'string', desc: "欢迎语，当 type = 'model' 时，选填" },
    ],
    guide: [`{
  "usingComponents": {
    "agent-ui":"/components/agent-ui/index"
  },
}`, `&lt;agent-ui agentConfig="{{agentConfig}}"&gt;&lt;/agent-ui&gt;`, `  data: {
    agentConfig: {
      type: "bot", // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，model必填
      botId: "bot-e7d1e736", // agent id
      modelName: "deepseek", // 大模型服务商
      model: "deepseek-r1", // 具体的模型版本
      logo: "123",// 图标(只在model模式下生效)
      welcomeMessage: "123"// 欢迎语(只在model模式下生效)
    }
  }`]
  },
  expandAgent: function () {
    this.setData({ agentExpand: !this.data.agentExpand })
  },
  expandModel: function () {
    this.setData({ modelExpand: !this.data.modelExpand })
  },
  goChatBot: function () {
    wx.navigateTo({
      url: '/pages/chatBot/chatBot',
    })
  },
  scrollToAnchor: function (e) {
    // 获取点击的锚点 ID
    const anchorId = e.currentTarget.dataset.anchor;
    // 使用 wx.createSelectorQuery() 获取锚点元素的位置
    const query = wx.createSelectorQuery();
    query.select('#' + anchorId).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (res[0]) {
        // 获取锚点元素距离页面顶部的距离
        const scrollTop = res[1].scrollTop + res[0].top;
        // 使用 wx.pageScrollTo 方法将页面滚动到锚点位置
        wx.pageScrollTo({
          scrollTop: scrollTop,
          duration: 300 // 滚动动画的持续时间，单位为毫秒
        });
      }
    });
  },
  copyUrl: function () {
    wx.setClipboardData({
      data: "https://tcb.cloud.tencent.com/dev",
      success: function (res) {
        wx.showToast({
          title: '链接复制成功',
          icon: 'success'
        });
      },
      fail: function (err) {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  }
});
