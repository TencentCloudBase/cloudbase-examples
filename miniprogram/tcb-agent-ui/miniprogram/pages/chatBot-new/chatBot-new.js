// pages/chatBot/chatBot.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// agentConfig: {
		// 	// type: 'model', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
		// 	type: 'bot', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
		// 	botId: 'bot-db3cab4a', // agent id
		// 	// modelName: 'deepseek', // 大模型服务商
		// 	// model: 'deepseek-r1', // 具体的模型版本
		// 	logo: 'https://docs.cloudbase.net/img/logo.svg', // 图标(只在model模式下生效)
		// 	welcomeMessage: '欢迎语!', // 欢迎语(只在model模式下生效)
		// },
		agentConfigList: [
			{
				// type: 'model', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
				type: 'bot', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
				botIds: [
					'bot-5d1bcc60',
					'bot-225b29ad',
					'bot-8e238130',
					'bot-b1ed8b13',
					'bot-1416cf7b',
				], // agent id 列表
				// modelName: 'deepseek', // 大模型服务商
				// model: 'deepseek-r1', // 具体的模型版本
				// logo: 'https://docs.cloudbase.net/img/logo.svg', // 图标(只在model模式下生效)
				// welcomeMessage: '欢迎语!', // 欢迎语(只在model模式下生效)
				tabName: 'Agent',
				tabId: 'Agent', // 不能重复
			}, // bot类配置配一组即可，不同的bot放入该组配置的botIds字段
			{
				type: 'model', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
				// botId: 'bot-db3cab4a', // agent id
				modelName: 'deepseek', // 大模型服务商
				model: 'deepseek-r1', // 具体的模型版本
				logo: 'https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/2339414f-2c0d-4537-9618-1812bd14f4af.svg', // 图标(只在model模式下生效)
				welcomeMessage: '我是 deepseek-r1，很高兴见到你!', // 欢迎语(只在model模式下生效)
				tabName: 'DeepSeek',
				tabId: 'DeepSeek',
			},
			{
				type: 'model', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
				// botId: 'bot-db3cab4a', // agent id
				modelName: 'hunyuan-exp', // 大模型服务商
				model: 'hunyuan-lite', // 具体的模型版本
				logo: 'https://cloudcache.tencent-cloud.com/qcloud/ui/static/other_external_resource/e159ca9b-2184-488b-86c4-49ab744dbbc5.svg', // 图标(只在model模式下生效)
				welcomeMessage: '我是 hunyuan-lite，很高兴见到你!', // 欢迎语(只在model模式下生效)
				tabName: 'Hunyuan',
				tabId: 'Hunyuan',
			},
		],
		newAgentConfigList: [
			{
				type: 'bot',
				botId: 'bot-5d1bcc60',
			},
			{
				type: 'bot',
				botId: 'bot-225b29ad',
			},
			{
				type: 'bot',
				botId: 'bot-8e238130',
			},
			{
				type: 'bot',
				botId: 'bot-b1ed8b13',
			},
			{
				type: 'bot',
				botId: 'bot-1416cf7b',
			},
			{
				type: 'model', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
				// botId: 'bot-db3cab4a', // agent id
				modelName: 'deepseek', // 大模型服务商
				model: 'deepseek-r1', // 具体的模型版本
				logo: 'https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/2339414f-2c0d-4537-9618-1812bd14f4af.svg', // 图标(只在model模式下生效)
				welcomeMessage: '我是 deepseek-r1，很高兴见到你!', // 欢迎语(只在model模式下生效)
			},
			{
				type: 'model', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
				// botId: 'bot-db3cab4a', // agent id
				modelName: 'hunyuan-exp', // 大模型服务商
				model: 'hunyuan-lite', // 具体的模型版本
				logo: 'https://cloudcache.tencent-cloud.com/qcloud/ui/static/other_external_resource/e159ca9b-2184-488b-86c4-49ab744dbbc5.svg', // 图标(只在model模式下生效)
				welcomeMessage: '我是 hunyuan-lite，很高兴见到你!', // 欢迎语(只在model模式下生效)
			},
		],
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
	onLoad(options) {},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {},
});
