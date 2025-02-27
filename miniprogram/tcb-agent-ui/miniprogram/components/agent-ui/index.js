// components/agent-ui/index.js
import { guide, checkConfig } from './tools';
Component({
  properties: {
    agentConfig: {
      type: Object,
      value: {
        type: '', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，model必填
        botId: '', // agent id
        modelName: '', // 大模型服务商
        model: '', // 具体的模型版本
        logo: '', // 图标(只在model模式下生效)
        welcomeMessage: '', // 欢迎语(只在model模式下生效)
      },
    },
  },

  observers: {
    showTools: function (isShow) {
      if (isShow) {
        this.setData({
          footerHeight: this.data.footerHeight + 80
        })
      } else {
        this.setData({
          footerHeight: this.data.footerHeight - 80
        })
      }
    },
    showFileList: function (isShow) {
      if (isShow) {
        this.setData({
          footerHeight: this.data.footerHeight + 80
        })
      } else {
        this.setData({
          footerHeight: this.data.footerHeight - 80
        })
      }
    }
  },

  data: {
    isLoading: true, // 判断是否尚在加载中
    article: {},
    windowInfo: wx.getWindowInfo(),
    bot: {},
    inputValue: '',
    output: '',
    chatRecords: [],
    scrollTop: 0,
    streamStatus: false,
    setPanelVisibility: false,
    questions: [],
    scrollTop: 0,
    guide,
    showGuide: false,
    imageList: [],
    scrollTop: 0, // 文字撑起来后能滚动的最大高度
    viewTop: 0, // 根据实际情况，可能用户手动滚动，需要记录当前滚动的位置
    scrollTo: '', // 快速定位到指定元素，置底用
    scrollTimer: null, //
    manualScroll: false, // 当前为手动滚动/自动滚动
    showTools: false, // 展示底部工具栏
    showFileList: false, // 展示顶部文件行
    sendFileList: [],
    footerHeight: 80,
    enableUpload: true,
    lastScrollTop: 0
  },

  attached: async function () {
    const { botId, type } = this.data.agentConfig;
    const [check, message] = checkConfig(this.data.agentConfig);
    if (!check) {
      wx.showModal({
        title: '提示',
        content: message,
      });
      this.setData({ showGuide: true });
    } else {
      this.setData({ showGuide: false });
    }
    if (type === 'bot') {
      const ai = wx.cloud.extend.AI;
      const bot = await ai.bot.get({ botId });
      // 新增错误提示
      if (bot.code) {
        wx.showModal({
          title: '提示',
          content: bot.message,
        });
        return;
      }
      this.setData({ bot, questions: bot.initQuestions });
    }
  },
  methods: {
    // 滚动相关处理
    calculateContentHeight() {
      return new Promise((resolve) => {
        const query = wx.createSelectorQuery().in(this);
        query
          .selectAll('.main >>> .system, .main >>> .userContent')
          .boundingClientRect((rects) => {
            let totalHeight = 0;
            rects.forEach((rect) => {
              totalHeight += rect.height;
            });
            resolve(totalHeight);
          })
          .exec();
      });
    },
    calculateContentInTop() {
      return new Promise((resolve) => {
        const query = wx.createSelectorQuery().in(this);
        query
          .selectAll(
            '.main >>> .nav, .main >>> .guide_system, .main >>> .bot_intro_system'
          )
          .boundingClientRect((rects) => {
            let totalHeight = 0;
            rects.forEach((rect) => {
              totalHeight += rect.height;
            });
            // console.log('top height', totalHeight);
            resolve(totalHeight);
          })
          .exec();
      });
    },
    onWheel: function (e) { // 解决小程序开发工具中滑动
      if (!this.data.manualScroll && e.detail.deltaY < 0) {
        this.setData({
          manualScroll: true,
        });
      }
    },
    onScroll: function (e) {
      if (e.detail.scrollTop < this.data.lastScrollTop) {
        // 鸿蒙系统上可能滚动事件，拖动事件失效，兜底处理
        this.setData({
          manualScroll: true
        })
      }

      this.setData({
        lastScrollTop: e.detail.scrollTop
      })

      // 针对连续滚动的最后一次进行处理，scroll-view的 scroll end事件不好判定
      if (this.data.scrollTimer) {
        clearTimeout(this.data.scrollTimer);
      }
      const { scrollTop, scrollHeight, height } = e.detail;

      this.setData({
        scrollTimer: setTimeout(() => {
          // console.log(
          //   'e.detail.scrollTop data.scrollTop',
          //   scrollTop,
          //   this.data.scrollTop,
          //   this.data.manualScroll
          // );
          const newTop = Math.max(this.data.scrollTop, e.detail.scrollTop);
          if (this.data.manualScroll) {
            this.setData({
              scrollTop: newTop,
            });
          } else {
            this.setData({
              scrollTop: newTop,
              viewTop: newTop,
            });
          }
        }, 100),
      });
    },
    handleScrollStart: function (e) {
      console.log('drag start', e);
      if (e.detail.scrollTop > 0) {
        // 手动开始滚
        this.setData({
          manualScroll: true,
        });
      }
    },
    handleScrollToLower: function (e) {
      console.log('scroll to lower', e);
      // 监听到底转自动
      this.setData({
        manualScroll: false,
      });
    },
    autoToBottom: function () {
      console.log('autoToBottom');
      this.setData({
        manualScroll: false,
        scrollTo: 'scroll-bottom',
      });
      // console.log('scrollTop', this.data.scrollTop);
    },
    bindInputFocus: function (e) {
      this.setData({
        manualScroll: false,
      });
      this.autoToBottom();
    },
    //
    bindKeyInput: function (e) {
      this.setData({
        inputValue: e.detail.value,
      });
    },
    clearChatRecords: function () {
      this.setData({
        chatRecords: [],
        streamStatus: false,
        // setPanelVisibility: !this.data.setPanelVisibility,
      });
    },
    handleUploadImg: function () {
      const self = this;
      wx.chooseMessageFile({
        count: 10,
        type: 'image',
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          // const tempFilePaths = res.tempFiles;
          console.log('res', res);
          const tempFiles = res.tempFiles.map((item) => ({
            tempId: `${new Date().getTime()}-${item.name}`,
            rawType: item.type, // 微信选择默认的文件类型 image/video/file
            fileName: item.name, // 文件名
            tempPath: item.path,
            fileSize: item.size,
            fileUrl: '',
            fileId: '',
          }));
          // 过滤掉已选择中的 file 文件（保留image）
          const filterFileList = self.data.sendFileList.filter(
            (item) => item.rawType !== 'file'
          );
          const finalFileList = [...filterFileList, ...tempFiles]
          console.log('final', finalFileList);
          self.setData({
            sendFileList: finalFileList, //
          });

          if (finalFileList.length) {
            self.setData({
              showFileList: true,
              showTools: false
            })
          }
        },
      });
    },
    handleUploadFile: function () {
      const self = this;
      wx.chooseMessageFile({
        count: 10,
        type: 'file',
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          // const tempFilePaths = res.tempFiles;
          console.log('res', res);
          const tempFiles = res.tempFiles.map((item) => ({
            tempId: `${new Date().getTime()}-${item.name}`,
            rawType: item.type, // 微信选择默认的文件类型 image/video/file
            fileName: item.name, // 文件名
            tempPath: item.path,
            fileSize: item.size,
            fileUrl: '',
            fileId: '',
          }));
          // 过滤掉已选择中的 image 文件（保留file)
          const filterFileList = self.data.sendFileList.filter(
            (item) => item.rawType !== 'image'
          );
          const finalFileList = [...filterFileList, ...tempFiles]
          console.log('final', finalFileList);

          self.setData({
            sendFileList: finalFileList, //
          });

          if (finalFileList.length) {
            self.setData({
              showFileList: true,
              showTools: false
            })
          }
        },
      });
    },
    handleCamera: function () {
      const self = this;
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['camera'],
        maxDuration: 30,
        camera: 'back',
        success(res) {
          console.log('res', res);
          // console.log(res.tempFiles[0].tempFilePath)
          // console.log(res.tempFiles[0].size)
          const tempFiles = res.tempFiles.map((item) => {
            let index = item.tempFilePath.lastIndexOf('.');
            const fileExt = item.tempFilePath.substring(index + 1);
            const randomFileName = new Date().getTime() + '.' + fileExt;
            return {
              tempId: randomFileName,
              rawType: item.fileType, // 微信选择默认的文件类型 image/video/file
              fileName: randomFileName, // 文件名
              tempPath: item.tempFilePath,
              fileSize: item.size,
              fileUrl: '',
              fileId: '',
            };
          });
          // 过滤掉已选择中的 file 文件（保留image）
          const filterFileList = self.data.sendFileList.filter(
            (item) => item.rawType !== 'file'
          );
          const finalFileList = [...filterFileList, ...tempFiles]
          console.log('final', finalFileList);
          self.setData({
            sendFileList: finalFileList, //
          });
          if (finalFileList.length) {
            self.setData({
              showTools: false,
              showFileList: true
            })
          }
        },
      });
    },
    stop: function () {
      this.autoToBottom();
      const { chatRecords } = this.data;
      const newChatRecords = [...chatRecords];
      const record = newChatRecords[newChatRecords.length - 1];
      if (record.content === '...') {
        record.content = '已暂停回复';
      }
      this.setData({
        streamStatus: false,
        chatRecords: newChatRecords,
        manualScroll: false,
      });
    },
    openSetPanel: function () {
      this.setData({ setPanelVisibility: true });
    },
    closeSetPanel: function () {
      this.setData({ setPanelVisibility: false });
    },
    sendMessage: async function (event) {
      if (this.data.showFileList) {
        this.setData({
          showFileList: !this.data.showFileList
        })
      }
      if (this.data.showTools) {
        this.setData({
          showTools: !this.data.showTools
        })
      }
      const { message } = event.currentTarget.dataset;
      let {
        inputValue,
        bot,
        agentConfig,
        chatRecords,
        streamStatus,
        imageList,
      } = this.data;
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
        if (imageList.filter((item) => !item.base64Url).length) {
          return;
        }
      }
      const { type, modelName, model } = agentConfig;
      // console.log(inputValue,bot.botId)
      const userRecord = {
        content: inputValue,
        record_id: 'record_id' + String(+new Date() - 10),
        role: 'user',
        imageList: [...imageList],
      };

      userRecord.fileList = this.data.sendFileList;
      if (this.data.sendFileList.length) {
        this.setData({
          sendFileList: []
        })
      }

      // // TODO: 判断是否携带图片(hunyuan-vision 用到)，携带则scrollTop 增加
      // if (imageList.length) {
      //   const newScrollTop = this.data.scrollTop;
      //   if (this.data.manualScroll) {
      //     this.setData({
      //       scrollTop: newScrollTop,
      //     });
      //   } else {
      //     this.setData({
      //       scrollTop: newScrollTop,
      //       viewTop: newScrollTop,
      //     });
      //   }
      // }

      const record = {
        content: '...',
        record_id: 'record_id' + String(+new Date() + 10),
        role: 'assistant',
      };
      this.setData({
        inputValue: '',
        questions: [],
        chatRecords: [...chatRecords, userRecord, record],
        streamStatus: false,
        imageList: [],
      });

      // 新增一轮对话记录时 自动往下滚底
      this.autoToBottom()

      if (type === 'bot') {
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
            fileList: userRecord.fileList.map((item) => ({
              type: item.rawType,
              fileId: item.fileId,
            })),
          },
        });
        this.setData({ streamStatus: true });
        let contentText = '';
        let reasoningContentText = '';
        for await (let event of res.eventStream) {
          if (!this.data.streamStatus) {
            break;
          }
          this.toBottom();
          const { data } = event;
          try {
            const dataJson = JSON.parse(data);
            // console.log(dataJson)
            const {
              type,
              content,
              reasoning_content,
              record_id,
              search_info,
              role,
              knowledge_meta,
              finish_reason,
            } = dataJson;
            const newValue = [...this.data.chatRecords];
            // 取最后一条消息更新
            const lastValue = newValue[newValue.length - 1];
            lastValue.role = role || 'assistant';
            lastValue.record_id = record_id || lastValue.record_id;
            // 优先处理错误,直接中断
            if (finish_reason === 'error') {
              lastValue.search_info = null;
              lastValue.reasoning_content = '';
              lastValue.knowledge_meta = [];
              lastValue.content = '网络繁忙，请稍后重试!';
              this.setData({ chatRecords: newValue });
              break;
            }
            // 下面根据type来确定输出的内容
            // 只更新一次参考文献，后续再收到这样的消息丢弃
            if (type === 'search' && !lastValue.search_info) {
              lastValue.search_info = search_info;
              this.setData({ chatRecords: newValue });
            }
            // 思考过程
            if (type === 'thinking') {
              reasoningContentText += reasoning_content;
              lastValue.reasoning_content = reasoningContentText;
              this.setData({ chatRecords: newValue });
            }
            // 内容
            if (type === 'text') {
              contentText += content;
              lastValue.content = contentText;
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
              agentSetting: '',
              introduction: '',
              name: '',
            },
          });
          let result = '';
          for await (let str of recommendRes.textStream) {
            // console.log(str);
            this.toBottom();
            result += str;
            this.setData({
              questions: result.split('\n').filter((item) => !!item),
            });
          }
        }
      }
      if (type === 'model') {
        const aiModel = wx.cloud.extend.AI.createModel(modelName);
        let params = {};
        if (model === 'hunyuan-vision') {
          params = {
            model: model,
            messages: [
              ...chatRecords.map((item) => ({
                role: item.role,
                content: [
                  {
                    type: 'text',
                    text: item.content,
                  },
                  ...(item.imageList || []).map((item) => ({
                    type: 'image_url',
                    image_url: {
                      url: item.base64Url,
                    },
                  })),
                ],
              })),
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: inputValue,
                  },
                  ...imageList.map((item) => ({
                    type: 'image_url',
                    image_url: {
                      url: item.base64Url,
                    },
                  })),
                ],
              },
            ],
          };
        } else {
          params = {
            model: model,
            messages: [
              ...chatRecords.map((item) => ({
                role: item.role,
                content: item.content,
              })),
              {
                role: 'user',
                content: inputValue,
              },
            ],
          };
        }
        const res = await aiModel.streamText({
          data: params,
        });
        let contentText = '';
        let reasoningText = '';
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
            if (finish_reason === 'stop') {
              break;
            }
            const { content, reasoning_content, role } = delta;
            reasoningText += reasoning_content || '';
            contentText += content || '';
            const newValue = [...this.data.chatRecords];
            newValue[newValue.length - 1] = {
              content: contentText,
              reasoning_content: reasoningText,
              record_id: 'record_id' + String(id),
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
    toBottom: async function () {
      const clientHeight = this.data.windowInfo.windowHeight - this.data.footerHeight; // 视口高度
      const contentHeight =
        (await this.calculateContentHeight()) +
        (await this.calculateContentInTop()); // 内容总高度
      // console.log(
      //   'contentHeight clientHeight newTop',
      //   contentHeight,
      //   clientHeight,
      //   this.data.scrollTop + 4
      // );
      if (clientHeight - contentHeight < 10) {
        // 只有当内容高度接近视口高度时才开始增加 scrollTop
        const newTop = this.data.scrollTop + 4;

        if (this.data.manualScroll) {
          this.setData({
            scrollTop: newTop,
          });
        } else {
          this.setData({
            scrollTop: newTop,
            viewTop: newTop,
          });
        }
      }
    },
    copyChatRecord: function (e) {
      // console.log(e)
      const { content } = e.currentTarget.dataset;
      wx.setClipboardData({
        data: content + '\n\n来自微信云开发AI+',
        success: function (res) {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
          });
        },
      });
    },
    addFileList: function () {
      // 顶部文件行展现时，隐藏底部工具栏
      this.setData({

      })
    },
    subFileList: function () {

    },
    uploadImgs: function () {
      const that = this;
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success(media) {
          // console.log(media.tempFiles)
          const { tempFiles } = media;
          that.setData({ imageList: [...tempFiles] });
          tempFiles.forEach((img, index) => {
            const lastDotIndex = img.tempFilePath.lastIndexOf('.');
            const fileExtension = img.tempFilePath.substring(lastDotIndex + 1);
            wx.getFileSystemManager().readFile({
              filePath: img.tempFilePath,
              encoding: 'base64',
              success(file) {
                const base64String = file.data;
                const base64Url = `data:image/${fileExtension};base64,${base64String}`;
                const { imageList } = that.data;
                const image = imageList[index];
                image.base64Url = base64Url;
                that.setData({ imageList: [...imageList] });
              },
            });
          });
        },
        fail(e) {
          console.log(e);
        },
      });
    },
    deleteImg: function (e) {
      const {
        currentTarget: {
          dataset: { index },
        },
      } = e;
      const { imageList } = this.data;
      const newImageList = imageList.filter((_, idx) => idx != index);
      this.setData({ imageList: [...newImageList] });
    },
    copyUrl: function (e) {
      const { url } = e.currentTarget.dataset;
      console.log(url);
      wx.setClipboardData({
        data: url,
        success: function (res) {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
          });
        },
      });
    },
    handleRemoveChild: function (e) {
      console.log('remove', e.detail.tempId);
      if (e.detail.tempId) {
        const newSendFileList = this.data.sendFileList.filter(
          (item) => item.tempId !== e.detail.tempId
        );
        console.log('newSendFileList', newSendFileList);
        this.setData({
          sendFileList: newSendFileList,
        });
        if (newSendFileList.length === 0) {
          this.setData({
            showFileList: false
          })
        }
      }
    },
    handleChangeChild: function (e) {
      console.log('change', e.detail);
      const { fileId, tempId } = e.detail;
      // const curFile = this.data.sendFileList.find(item => item.tempId === tempId)
      // curFile.fileId = fileId
      const newSendFileList = this.data.sendFileList.map((item) => {
        if (item.tempId === tempId) {
          return {
            ...item,
            fileId,
          };
        }
        return item;
      });
      this.setData({
        sendFileList: newSendFileList,
      });
    },
    handleClickTools: function () {
      if (this.data.showTools) {
        this.setData({
          showTools: !this.data.showTools,
        });
      } else {
        this.setData({
          showTools: !this.data.showTools,
        });
      }
    }
  },
});
