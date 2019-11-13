// pages/posts/posts.js
const util = require('../../utils/util.js');  

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postlist: null,
    update: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 刷新数据
   */
  refresh: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'get_post_list',
      success: function (res) {
        //提取数据
        var data = res.result.postlist.data
        for (let i = 0; i < data.length; i++) {
          console.log(data[i])
          data[i].update_time = util.formatTime(new Date(data[i].update_time))
        }
        wx.hideLoading()
        that.setData({
          postlist: data
        })
        wx.stopPullDownRefresh()
      },
      fail: console.error
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.startPullDownRefresh()
    this.refresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    if (this.data.update) {
      wx.startPullDownRefresh()
      this.refresh()
      this.setData({
        update: false
      })
    }

    wx.getStorage({
      key: 'userInfo',
      success: function (res) {

      },
      fail: function () {
        that.userInfoAuthorize()
      }
    })
  },

  /**
   * 用户认证
   */
  userInfoAuthorize: function () {
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { // 存储用户信息
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo.nickName)
              console.log(util.formatTime(new Date()))

              wx.setStorage({
                key: app.globalData.userInfo,
                data: res.userInfo,
              })
              app.globalData.wechatNickName = res.userInfo.nickName
              app.globalData.wechatAvatarUrl = res.userInfo.avatarUrl
            }
          })
        } else { // 跳转到授权页面 
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // TODO 主体功能完备后要支持分页加载
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 带参跳转
   */
  newPost: function(e) {
    wx.navigateTo({
      url: '../publish/publish'
    })
  },
  onItemClick: function (e) {
    console.log(e.currentTarget.dataset.postid)
    wx.navigateTo({
      url: '../postdetail/postdetail?postid=' + e.currentTarget.dataset.postid,
    })
  }
})