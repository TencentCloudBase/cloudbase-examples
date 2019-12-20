Page({
  data: {
    dear:'亲爱的微信小程序开发者：',
    message:'圣诞快乐！感谢你对腾讯云云开发的支持，我们的进步离不开你的努力。我们会与你携手共进，一起去发现更多可能。',
    me:'——腾讯云云开发团队'
  },
  Getbless:function(){
    wx.showLoading({
      title: '获取祝福中',
    })
    wx.cloud.callFunction({
      name:'getbless',
      success(res){
        wx.hideLoading();
        wx.showModal({
          title: '圣诞快乐',
          content: res.result,
          showCancel: false,
          confirmText: '收下'
        })
      },
      fail(e){
        wx.hideLoading();
        wx.showModal({
          title: '圣诞快乐',
          content: '内容走丢了，请连接网络重试吧！',
          showCancel:false
        })
      }
    })
  },
  onShareAppMessage:function(){
    return {
      title:"【云开发】圣诞节祝福卡片",
      imageUrl:'https://636c-cloud-cmm55-1300478727.tcb.qcloud.la/happy/share.png'
    }
  }
})