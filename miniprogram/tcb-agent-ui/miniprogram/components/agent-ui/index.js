// components/agent-ui/index.js
import { guide, checkConfig } from "./tools";
Component({
  properties: {
    agentConfig: {
      type: Object,
      value: {
        type: "", // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，model必填
        botId: "", // agent id
        modelName: "", // 大模型服务商
        model: "", // 具体的模型版本
        logo: "", // 图标(只在model模式下生效)
        welcomeMessage: "", // 欢迎语(只在model模式下生效)
      },
    },
  },

  data: {
    isLoading: true, // 判断是否尚在加载中
    article: {},
    windowInfo: wx.getWindowInfo(),
    bot: {},
    inputValue: "",
    output: "",
    chatRecords: [],
    scrollTop: 0,
    streamStatus: false,
    setPanelVisibility: false,
    questions: [],
    scrollTop: 0,
    guide,
    showGuide: false,
  },

  attached: async function () {
    const { botId, type } = this.data.agentConfig;
    const [check, message] = checkConfig(this.data.agentConfig);
    if (!check) {
      wx.showModal({
        title: "提示",
        content: message,
      });
      this.setData({ showGuide: true });
    } else {
      this.setData({ showGuide: false });
    }
    if (type === "bot") {
      const ai = wx.cloud.extend.AI;
      const bot = await ai.bot.get({ botId });
      this.setData({ bot, questions: bot.initQuestions });
      return;
    }
  },
  methods: {
    bindKeyInput: function (e) {
      this.setData({
        inputValue: e.detail.value,
      });
    },
    clearChatRecords: function () {
      this.setData({
        chatRecords: [],
        streamStatus: false,
        setPanelVisibility: !this.data.setPanelVisibility,
      });
    },
    stop: function () {
      const { chatRecords } = this.data;
      const newChatRecords = [...chatRecords];
      const record = newChatRecords[newChatRecords.length - 1];
      if (record.content === "...") {
        record.content = "已暂停回复";
      }
      this.setData({ streamStatus: false, chatRecords: newChatRecords });
    },
    openSetPanel: function () {
      this.setData({ setPanelVisibility: true });
    },
    closeSetPanel: function () {
      this.setData({ setPanelVisibility: false });
    },
    sendMessage: async function (event) {
      const { message } = event.currentTarget.dataset;
      let { inputValue, bot, agentConfig, chatRecords, streamStatus } =
        this.data;
      if (streamStatus) {
        return;
      }
      if (message) {
        inputValue = message;
      }
      if (!inputValue) {
        return;
      }
      const { type, modelName, model } = agentConfig;
      // console.log(inputValue,bot.botId)
      const userRecord = {
        content: inputValue,
        record_id: "record_id" + String(+new Date() - 10),
        role: "user",
      };
      const record = {
        content: "...",
        record_id: "record_id" + String(+new Date() + 10),
        role: "assistant",
      };
      this.setData({
        inputValue: "",
        questions: [],
        chatRecords: [...chatRecords, userRecord, record],
        streamStatus: false,
      });
      // 先这样写，后面抽离出来
      if (type === "bot") {
        const ai = wx.cloud.extend.AI;
        const res = await ai.bot.sendMessage({
          data: {
            botId: bot.botId,
            history: [
              ...chatRecords.map((item) => ({
                role: item.role,
                content: item.content,
              })),
            ],
            msg: inputValue,
          },
        });
        this.setData({ streamStatus: true });
        let contentText = "";
        let reasoningText = "";
        for await (let event of res.eventStream) {
          if (!this.data.streamStatus) {
            break;
          }
          this.toBottom();
          const { data } = event;
          try {
            const dataJson = JSON.parse(data);
            // console.log(dataJson)
            const { content, reasoning_content, record_id } = dataJson;
            contentText += content;
            reasoningText += reasoning_content;
            const newValue = [...this.data.chatRecords];
            newValue[newValue.length - 1] = {
              record_id,
              role: dataJson.role || "assistant",
              content: contentText,
              reasoning_content: reasoningText,
            };
            this.setData({ chatRecords: newValue });
          } catch (e) {
            // console.log('err', event, e)
            break;
          }
        }
        this.setData({ streamStatus: false });
        if (bot.isNeedRecommend) {
          const ai = wx.cloud.extend.AI;
          const recommendRes = await ai.bot.getRecommendQuestions({
            data: {
              botId: bot.botId,
              history: [],
              msg: inputValue,
              agentSetting: "",
              introduction: "",
              name: "",
            },
          });
          let result = "";
          for await (let str of recommendRes.textStream) {
            // console.log(str);
            this.toBottom();
            result += str;
            this.setData({
              questions: result.split("\n").filter((item) => !!item),
            });
          }
        }
      }
      if (type === "model") {
        const aiModel = wx.cloud.extend.AI.createModel(modelName);
        const res = await aiModel.streamText({
          data: {
            model: model,
            messages: [
              ...chatRecords.map((item) => ({
                role: item.role,
                content: item.content,
              })),
              {
                role: "user",
                content: inputValue,
              },
            ],
          },
        });
        let contentText = "";
        let reasoningText = "";
        this.setData({ streamStatus: true });
        for await (let event of res.eventStream) {
          if (!this.data.streamStatus) {
            break;
          }
          this.toBottom();

          const { data } = event;
          try {
            const dataJson = JSON.parse(data);
            const { id, choices = [] } = dataJson || {};
            const { delta, finish_reason } = choices[0] || {};
            if (finish_reason === "stop") {
              break;
            }
            const { content, reasoning_content, role } = delta;
            reasoningText += reasoning_content || "";
            contentText += content || "";
            const newValue = [...this.data.chatRecords];
            newValue[newValue.length - 1] = {
              content: contentText,
              reasoning_content: reasoningText,
              record_id: "record_id" + String(id),
              role: role,
            };
            this.setData({ chatRecords: newValue });
          } catch (e) {
            // console.log(e, event)
            break;
          }
        }
        this.setData({ streamStatus: false });
      }
    },
    toBottom: function () {
      this.setData({ scrollTop: this.data.scrollTop + 4 });
    },
    copyChatRecord: function (e) {
      // console.log(e)
      const { content } = e.currentTarget.dataset;
      wx.setClipboardData({
        data: content + "\n\n来自微信云开发AI+",
        success: function (res) {
          wx.showToast({
            title: "复制成功",
            icon: "success",
          });
        },
      });
    },
  },
});
