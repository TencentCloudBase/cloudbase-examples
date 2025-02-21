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
    imageList: []
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
      // console.log(bot)
      // 新增错误提示
      if(bot.code){
        wx.showModal({
          title: "提示",
          content: bot.message,
        });
        return
      }
      this.setData({ bot, questions: bot.initQuestions });
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
      let { inputValue, bot, agentConfig, chatRecords, streamStatus, imageList } = this.data;
      // 如果正在流式输出，不让发送消息
      if (streamStatus) {
        return;
      }
      // 将传进来的消息给到inputValue
      if (message) {
        inputValue = message;
      }
      // 空消息返回
      if (!inputValue) {
        return;
      }
      // 图片上传没有完成，返回
      if (imageList.length) {
        if (imageList.filter(item => !item.base64Url).length) {
          return
        }
      }
      const { type, modelName, model } = agentConfig;
      // console.log(inputValue,bot.botId)
      const userRecord = {
        content: inputValue,
        record_id: "record_id" + String(+new Date() - 10),
        role: "user",
        imageList: [...imageList]
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
        imageList: []
      });
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
        let contentText = ''
        let reasoningContentText = ''
        for await (let event of res.eventStream) {
          if (!this.data.streamStatus) {
            break;
          }
          this.toBottom();
          const { data } = event;
          try {
            const dataJson = JSON.parse(data);
            // console.log(dataJson)
            const { type, content, reasoning_content, record_id, search_info, role, knowledge_meta,finish_reason } = dataJson;
            const newValue = [...this.data.chatRecords];
            // 取最后一条消息更新
            const lastValue = newValue[newValue.length - 1]
            lastValue.role = role || 'assistant'
            lastValue.record_id = record_id || lastValue.record_id
            // 优先处理错误,直接中断
            if(finish_reason==='error'){
              lastValue.search_info=null
              lastValue.reasoning_content=''
              lastValue.knowledge_meta=[];
              lastValue.content='网络繁忙，请稍后重试!'
              this.setData({ chatRecords: newValue })
              break;
            }
            // 下面根据type来确定输出的内容
            // 只更新一次参考文献，后续再收到这样的消息丢弃
            if (type === "search" && !lastValue.search_info) {
              lastValue.search_info = search_info
              this.setData({ chatRecords: newValue })
            }
            // 思考过程
            if (type === 'thinking') {
              reasoningContentText += reasoning_content
              lastValue.reasoning_content = reasoningContentText
              this.setData({ chatRecords: newValue });
            }
            // 内容
            if (type === 'text') {
              contentText += content
              lastValue.content = contentText
              this.setData({ chatRecords: newValue });
            }
            // 知识库，这个版本没有文件元信息，展示不更新
            if (type === 'knowledge') {
              // lastValue.knowledge_meta = knowledge_meta
              // this.setData({ chatRecords: newValue });
            }
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
        let params = {}
        if (model === 'hunyuan-vision') {
          params = {
            model: model,
            messages: [
              ...chatRecords.map(item => ({
                role: item.role,
                content: [
                  {
                    "type": "text",
                    "text": item.content
                  },
                  ...(item.imageList || []).map(item => ({
                    "type": "image_url",
                    "image_url": {
                      "url": item.base64Url
                    }
                  }))
                ]
              })),
              {
                role: "user",
                content: [
                  {
                    "type": "text",
                    "text": inputValue
                  },
                  ...imageList.map(item => ({
                    "type": "image_url",
                    "image_url": {
                      "url": item.base64Url
                    }
                  }))
                ]
              },
            ],
          }
        } else {
          params = {
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
          }
        }
        const res = await aiModel.streamText({
          data: params,
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
    uploadImgs: function () {
      const that = this
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success(media) {
          // console.log(media.tempFiles)
          const { tempFiles } = media
          that.setData({ imageList: [...tempFiles] })
          tempFiles.forEach((img, index) => {
            const lastDotIndex = img.tempFilePath.lastIndexOf('.');
            const fileExtension = img.tempFilePath.substring(lastDotIndex + 1);
            wx.getFileSystemManager().readFile({
              filePath: img.tempFilePath,
              encoding: 'base64',
              success(file) {
                const base64String = file.data;
                const base64Url = `data:image/${fileExtension};base64,${base64String}`
                const { imageList } = that.data
                const image = imageList[index]
                image.base64Url = base64Url
                that.setData({ imageList: [...imageList] })
              },
            })
          })
        },
        fail(e) {
          console.log(e)
        }
      })
    },
    deleteImg: function (e) {
      const { currentTarget: { dataset: { index } } } = e
      const { imageList } = this.data
      const newImageList = imageList.filter((_, idx) => idx != index);
      this.setData({ imageList: [...newImageList] })
    },
    copyUrl: function (e) {
      const { url } = e.currentTarget.dataset
      console.log(url)
      wx.setClipboardData({
        data: url,
        success: function (res) {
          wx.showToast({
            title: "复制成功",
            icon: "success",
          });
        },
      });
    }
  },
});
