// pages/chatBot/chatBot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agentConfig: {
      type: "model", // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
      botId: "bot-e7d1e736", // agent id
      modelName: "deepseek", // 大模型服务商
      model: "deepseek-v3", // 具体的模型版本
      logo: "https://docs.cloudbase.net/img/logo.svg",// 图标(只在model模式下生效)
      welcomeMessage: "欢迎语!"// 欢迎语(只在model模式下生效)
    }
  },
  

  // modelName: "hunyuan-open", // 大模型服务商
  // model: "hunyuan-lite", // 具体的模型版本

  // modelName: "hunyuan-open", // 大模型服务商
  // model: "hunyuan-vision", // 具体的模型版本

  // modelName: "deepseek", // 大模型服务商
  // model: "deepseek-r1", // 具体的模型版本

  // modelName: "deepseek", // 大模型服务商
  // model: "deepseek-v3", // 具体的模型版本
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})