// miniprogram/pages/demo1/demo1.js
const db = wx.cloud.database()

Page({
  sendLog: {},

  colName: 'danmu-list',
  
  watcher: null,

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    // 弹幕输入相关属性
    lastInputValue: '',
    inputValue: '',
    maxDanmuLength: 30,
    danmuSending: false,
    // 视频相关属性
    currentVideoTime: 0,
    inputTipContent: '',
    inputTipShow: false
  },

  onLoad: function() {
    const { videoUrl } = this.data
    this.watcher = db.collection(this.colName)
      .where({
        videoId: videoUrl
      })
      .watch({
        onChange: this.handleWatch,
        onError: function(err) {
          console.error('the watch closed because of error', err)
        }
      })
  },

  handleWatch: function(snapshot) {
    const { currentVideoTime } = this.data
    const { docChanges } = snapshot;
    const newDocs = docChanges.filter(item => {
        return item.dataType === 'add' 
          && item.time - 5 <= currentVideoTime 
          && item.time + 5 >= currentVideoTime
      })
      .map(item => item.doc)
    this.showDanmu(newDocs)
  },

  onUnload: function() {
    if (this.watcher) {
      this.watcher.close()
    }
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'video',
      path: 'page/component/pages/video/video'
    }
  },

  /**
   * 处理视频错误信息
   */
  handleBindError(e) {
    console.log('视频错误信息:', e.detail.errMsg)
  },

  /**
   * 处理弹幕输入框
   */
  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  /**
   * 监听视频时间变化
   */
  async handleTimeUpdate(e) {
    const currentVideoTime = Math.floor(e.detail.currentTime)
    const { videoUrl } = this.data
    const _ = db.command

    this.setData({
      currentVideoTime
    })
    
    const { data: danmuList } = await db.collection(this.colName)
      .where(_.and([
        {
          videoId: videoUrl
        },
        {
          time: _.gte(currentVideoTime - 1)
        },
        {
          time: _.lte(currentVideoTime + 1)
        }
      ]))
      .limit(50)
      .get()

    this.showDanmu(danmuList)
  },

  /**
   * 弹幕发送前的钩子
   * 检查弹幕是否合法
   */
  async beforeSendDanmu() {
    const {inputValue, lastInputValue} = this.data;

    if (inputValue.trim().length === 0) {
      this.setData({
        inputTipContent: '弹幕长度不能为0',
        inputTipShow: true
      })
      throw new Error('弹幕长度不能为0')
    }

    if (lastInputValue === inputValue) {
      this.setData({
        inputTipContent: '和上一个弹幕相同',
        inputTipShow: true
      })
      throw new Error('和上一个弹幕相同')
    }

    try {
      await wx.cloud.callFunction({
        name: 'textsec',
        data: {
          text: inputValue.trim()
        }
      })
    } catch (error) {
      this.setData({
        inputTipContent: '弹幕中包含敏感词',
        inputTipShow: true
      })
      throw new Error('弹幕中包含敏感词')
    }
  },

  /**
   * 发送弹幕
   */
  async sendDanmu() {
    await this.beforeSendDanmu();
    this.setData({
      danmuSending: true
    });

    const { videoUrl, inputValue, currentVideoTime } = this.data; 

    const danmu = {
      text: inputValue.trim(),
      color: getRBGColor() // 方便看到
    }

    let _id = ''
    try {
      const res = await db.collection(this.colName).add({
        data: {
          ...danmu,
          videoId: videoUrl,
          time: currentVideoTime
        }
      })
      _id = res._id
    } catch (error) {
      _id = `local-${Date.now()}` // 本地随机Id
      console.log('>>> 弹幕上传失败', error.message)
    }

    this.showDanmu({
      ...danmu,
      _id
    })
    this.setData({
      lastInputValue: inputValue,
      inputValue: '',
      danmuSending: false
    });
  },

  /**
   * 展示弹幕
   */
  showDanmu(danmuList) {
    const { sendLog, videoContext } = this
    danmuList = Array.isArray(danmuList) ? danmuList : [danmuList]

    danmuList.forEach(danmu => {
      if (sendLog[danmu._id]) {
        return
      }

      sendLog[danmu._id] = true;
      videoContext.sendDanmu({
        text: danmu.text,
        color: danmu.color
      })
    })
  }
})

/**
 * 生成随机的RBG格式的色彩
 */
function getRBGColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length === 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}