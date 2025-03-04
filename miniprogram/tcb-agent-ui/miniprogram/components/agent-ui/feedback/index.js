// pages/components/feedback/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    isShowFeedback: {
      type: Boolean,
      value: false
    },
    feedbackRecordId: {
      type: String,
      value: ''
    },
    feedbackType: {
      type: String,
      value: ''
    },
    botId: {
      type: String,
      value: ''
    },
    input: {
      type: String,
      value: ""
    },
    aiAnswer: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    upVote: [
      {
        "selected": false,
        "value": "准确有效"
      },
      {
        "selected": false,
        "value": "回答全面"
      },
      {
        "selected": false,
        "value": "立场正确"
      },
      {
        "selected": false,
        "value": "格式规范"
      },
      {
        "selected": false,
        "value": "专业性强"
      },
      {
        "selected": false,
        "value": "富有创意"
      },
      {
        "selected": false,
        "value": "表达清晰"
      },
      {
        "selected": false,
        "value": "值得信赖"
      },
      {
        "selected": false,
        "value": "高效"
      },
      {
        "selected": false,
        "value": "满意"
      }
    ],
    downVote: [
      {
        "selected": false,
        "value": "理解错误"
      },
      {
        "selected": false,
        "value": "未识别问题"
      },
      {
        "selected": false,
        "value": "事实错误"
      },
      {
        "selected": false,
        "value": "推理错误"
      },
      {
        "selected": false,
        "value": "内容不完整"
      },
      {
        "selected": false,
        "value": "不专业"
      },
      {
        "selected": false,
        "value": "违法有害"
      },
      {
        "selected": false,
        "value": "格式错误"
      },
      {
        "selected": false,
        "value": "乱码"
      },
      {
        "selected": false,
        "value": "内容重复"
      }
    ],
    score: 5,
    message: ""
  },
  observers:{
    "feedbackType":function (value) {
      this.setData({score:value==='upvote'?5:1})
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    reset: function () {
      this.setData({
        upVote: [
          {
            "selected": false,
            "value": "准确有效"
          },
          {
            "selected": false,
            "value": "回答全面"
          },
          {
            "selected": false,
            "value": "立场正确"
          },
          {
            "selected": false,
            "value": "格式规范"
          },
          {
            "selected": false,
            "value": "专业性强"
          },
          {
            "selected": false,
            "value": "富有创意"
          },
          {
            "selected": false,
            "value": "表达清晰"
          },
          {
            "selected": false,
            "value": "值得信赖"
          },
          {
            "selected": false,
            "value": "高效"
          },
          {
            "selected": false,
            "value": "满意"
          }
        ],
        downVote: [
          {
            "selected": false,
            "value": "理解错误"
          },
          {
            "selected": false,
            "value": "未识别问题"
          },
          {
            "selected": false,
            "value": "事实错误"
          },
          {
            "selected": false,
            "value": "推理错误"
          },
          {
            "selected": false,
            "value": "内容不完整"
          },
          {
            "selected": false,
            "value": "不专业"
          },
          {
            "selected": false,
            "value": "违法有害"
          },
          {
            "selected": false,
            "value": "格式错误"
          },
          {
            "selected": false,
            "value": "乱码"
          },
          {
            "selected": false,
            "value": "内容重复"
          }
        ],
        score: 5,
        message: ""
      })
    },
    onChangeScore: function (e) {
      const { score } = e.currentTarget.dataset
      this.setData({ score })
    },
    onSelect: function (e) {
      const { item } = e.currentTarget.dataset
      const newArr = [...this.data.feedbackType === 'upvote' ? this.data.upVote : this.data.downVote]
      const [selectedItem] = newArr.filter(i => i.value === item.value)
      selectedItem.selected = !selectedItem.selected
      if (this.data.feedbackType === 'upvote') {
        this.setData({ upVote: newArr })
      } else {
        this.setData({ downVote: newArr })
      }

    },
    inputChange: function (e) {
      const value = e.detail.value
      this.setData({ message: value })
    },
    closeShowFeedback: function () {
      this.triggerEvent('close')
    },
    submitFeedback: async function () {
      const res = await wx.cloud.extend.AI.bot.sendFeedback({
        userFeedback: {
          botId: this.data.botId,
          recordId: this.data.feedbackRecordId,
          comment: this.data.message,
          rating: this.data.score,
          tags: this.data.feedbackType === 'upvote' ? this.data.upVote.filter(item => item.selected).map(item => item.value) : this.data.downVote.filter(item => item.selected).map(item => item.value),
          aiAnswer: this.data.aiAnswer,
          input: this.data.input,
          type: this.data.feedbackType === 'upvote' ? "upvote" : 'downvote',
        },
        botId: this.data.botId
      });
      if (res.status === 'success') {
        wx.showToast({
          title: "感谢反馈",
          icon: "success",
        });
      } else {
        wx.showToast({
          title: "反馈失败",
          icon: "fail",
        });
      }
      this.reset();
      // console.log(res)
      this.triggerEvent("close")
    }
  }
})