Page({
  data: {
    introduction: [
      {
        title: "极简配置",
        desc: "只需简单配置组件参数，对接腾讯云开发AI功能，支持最新deepseek大模型",
      },
      {
        title: "超小体积",
        desc: "超小的组件体积，提升组件加载速度和页面响应速度",
      },
      {
        title: "可自定义",
        desc: "源码级组件，可更具需要调整组件样式，扩充更多功能",
      },
    ],
    agentExpand: false,
    modelExpand: false,
    agentUiConfig: {
      initEnvID: `wx.cloud.init({
  env: "你的环境ID",
  traceUser: true,
});`,
      agentConfig: `data: {
  chatMode: "bot", // bot 表示使用agent，model 表示使用大模型
  showBotAvatar: true, // 是否在对话框左侧显示头像
  agentConfig: {
    botId: "bot-e7d1e736", // agent id,
    allowWebSearch: true, // 允许客户端选择启用联网搜索
    allowUploadFile: true, // 允许上传文件
    allowPullRefresh: true // 允许下拉刷新
  }
}`,
      modelConfig1: `data: {
  chatMode: "model", // bot 表示使用agent，model 表示使用大模型
  showBotAvatar: true, // 是否在对话框左侧显示头像
  modelConfig: {
    modelProvider: "hunyuan-open", // 大模型服务厂商
    quickResponseModel: "hunyuan-lite", //大模型名称
    logo: "", // model 头像
    welcomeMsg: "欢迎语", // model 欢迎语
  },
}`,
      modelConfig2: `data: {
  chatMode: "model", // bot 表示使用agent，model 表示使用大模型
  showBotAvatar: true, // 是否在对话框左侧显示头像
  modelConfig: {
    modelProvider: "deepseek", // 大模型服务厂商
    quickResponseModel: "deepseek-v3", //大模型名称
    logo: "", // model 头像
    welcomeMsg: "欢迎语", // model 欢迎语
  },
}`,
    },
    params: [
      {
        name: "chatMode",
        type: "string",
        desc: "组件对接的AI类型，值为 'bot' 或者 'model'，为 'bot' 时，对接 agent 能力；为 'model' 时，对接大模型能力",
      },
      {
        name: "agentConfig.botId",
        type: "string",
        desc: "agent id，当 chatMode = 'bot' 时，必填",
      },
      {
        name: "modelConfig.modelProvider",
        type: "string",
        desc: "大模型服务商，当 chatMode = 'model' 时，必填，值为 'hunyuan-open' | 'deepseek'",
      },
      {
        name: "modelConfig.quickResponseModel",
        type: "string",
        desc: "具体使用的模型，当 chatMode = 'model' 时，必填。与 modelConfig.modelProvider 组合使用，可选的组合 [{modelProvider:'hunyuan-open',quickResponseModel:'hunyuan-lite'},{modelProvider:'hunyuan-exp',quickResponseModel:'hunyuan-lite'},{modelProvider:'deepseek',quickResponseModel:'deepseek-r1'},{modelProvider:'deepseek',quickResponseModel:'deepseek-v3'},{modelProvider:'hunyuan-open',quickResponseModel:'hunyuan-vision'}]",
      },
      {
        name: "modelConfig.logo",
        type: "string",
        desc: "页面 logo，当 chatMode = 'model' 时，选填",
      },
      {
        name: "modelConfig.welcomeMsg",
        type: "string",
        desc: "欢迎语，当 chatMode = 'model' 时，选填",
      },
      {
        name: "agentConfig.allowWebSearch",
        type: "boolean",
        desc: "界面是否展示联网搜索开关 选填",
      },
      { name: "showBotAvatar", type: "boolean", desc: "界面是否展示左侧头像" },
      {
        name: "agentConfig.allowUploadFile",
        type: "boolean",
        desc: "界面是否展示文件上传",
      },
      {
        name: "agentConfig.allowPullRefresh",
        type: "boolean",
        desc: "允许下拉刷新",
      },
    ],
    guide: [
      `{
  "usingComponents": {
    "agent-ui":"/components/agent-ui/index"
  },
}`,
      `&lt;agent-ui agentConfig="{{agentConfig}}" showBotAvatar="{{showBotAvatar}}" chatMode="{{chatMode}}" modelConfig="{{modelConfig}}""&gt;&lt;/agent-ui&gt;`,
      `data: {
  chatMode: "bot", // bot 表示使用agent，model 表示使用大模型
  showBotAvatar: true, // 是否在对话框左侧显示头像
  agentConfig: {
    botId: "bot-e7d1e736", // agent id,
    allowWebSearch: true, // 允许客户端选择启用联网搜索
    allowUploadFile: true, // 允许上传文件
    allowPullRefresh: true // 允许下拉刷新
  },
  modelConfig: {
    modelProvider: "hunyuan-open", // 大模型服务厂商
    quickResponseModel: "hunyuan-lite", // 大模型名称
    logo: "", // model 头像
    welcomeMsg: "欢迎语", // model 欢迎语
  },
}`,
    ],
  },
  expandAgent: function () {
    this.setData({ agentExpand: !this.data.agentExpand });
  },
  expandModel: function () {
    this.setData({ modelExpand: !this.data.modelExpand });
  },
  goChatBot: function () {
    wx.navigateTo({
      url: "/pages/chatBot/chatBot",
    });
  },
  scrollToAnchor: function (e) {
    // 获取点击的锚点 ID
    const anchorId = e.currentTarget.dataset.anchor;
    // 使用 wx.createSelectorQuery() 获取锚点元素的位置
    const query = wx.createSelectorQuery();
    query.select("#" + anchorId).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (res[0]) {
        // 获取锚点元素距离页面顶部的距离
        const scrollTop = res[1].scrollTop + res[0].top;
        // 使用 wx.pageScrollTo 方法将页面滚动到锚点位置
        wx.pageScrollTo({
          scrollTop: scrollTop,
          duration: 300, // 滚动动画的持续时间，单位为毫秒
        });
      }
    });
  },
  copyUrl: function () {
    wx.setClipboardData({
      data: "https://tcb.cloud.tencent.com/dev",
      success: function (res) {
        wx.showToast({
          title: "链接复制成功",
          icon: "success",
        });
      },
      fail: function (err) {
        wx.showToast({
          title: "复制失败",
          icon: "none",
        });
      },
    });
  },
});
