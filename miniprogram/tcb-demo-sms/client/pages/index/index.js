// index.js
const app = getApp()

Page({
  data: {
    list: [
      {
        id: 'verification',
        name: '验证码',
      },
      {
        id: 'normal',
        name: '普通短信通知'
      },
      {
        id: 'upload',
        name: '上传语音文件'
      },
      {
        id: 'voice',
        name: '语音短信通知'
      }
    ]
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '小程序·云开发音视频解决方案',
      path: '/pages/index/index',
    }
  },

  jumpUrl(e) {
    const id = e.currentTarget.id
    const list = this.data.list

    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        console.log(list[i].id, id)
        wx.navigateTo({
          url: `/pages/${list[i].id}/index`
        })
        return
      }
    }
  }
})
