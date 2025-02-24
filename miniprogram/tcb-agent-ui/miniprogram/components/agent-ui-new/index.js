// components/agent-ui/index.js
import { guide, checkConfig } from './tools';
Component({
	properties: {
		agentConfigList: {
			type: Array,
			value: [
				{
					type: '', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，model必填
					botIds: [], // agent id
					modelName: '', // 大模型服务商
					model: '', // 具体的模型版本
					logo: '', // 图标(只在model模式下生效)
					welcomeMessage: '', // 欢迎语(只在model模式下生效)
					tabName: '',
					tabId: '',
				},
			],
		},
		newAgentConfigList: {
			type: Array,
			value: [
				{
					type: '', // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，model必填
					botId: '', // agent id （bot模式下生效）
					modelName: '', // 大模型服务商 (只在model模式下生效)
					model: '', // 具体的模型版本 (只在model模式下生效)
					logo: '', // 图标(只在model模式下生效)
					welcomeMessage: '', // 欢迎语(只在model模式下生效)
				},
			],
		},
	},

	data: {
		curTab: {},
		isDrawerShow: false,
		isLoading: true, // 判断是否尚在加载中
		article: {},
		windowInfo: wx.getWindowInfo(),
		bot: {},
		inputValue: '',
		output: '',
		chatRecords: [],
		chatRecordsMap: {},
		scrollTop: 0, // 文字撑起来后能滚动的最大高度
		viewTop: 0, // 根据实际情况，可能用户手动滚动设置
		streamStatus: false,
		setPanelVisibility: false,
		questions: [],
		guide,
		showGuide: false,
		agentConfig: {},
		sendFileList: [],
		conversations: [],
		scrollTo: '',
		// autoScrollToBottomFinished: true, // 自动滚动到底部是否完成
		scrollTimer: null,
		useMicro: false,
		recordStart: false,
		showAgentList: false,
		botList: [],
		showBack: false,
		distanceFromBottom: 0, // 距离底部的距离
		manualScroll: false,
		query: null,
		scrollTimer: null,
		autoScrollFinished: true,
		showBack: false,
		transformAgentConfigList: [], // 兼容处理agentConfig 与 agentConfigList 两种输入
	},

	attached: async function () {
		// const { botId, type } = this.data.agentConfig;
		const checkResList = checkConfig(this.data.agentConfigList);
		const invalidList = checkResList.filter((item) => !item[0]);
		if (invalidList.length) {
			wx.showModal({
				title: '提示',
				content: invalidList.map((item) => item[1]).join(' | '),
			});
			this.setData({ showGuide: true });
		} else {
			this.setData({ showGuide: false });
		}
		if (this.data.agentConfigList.length) {
			const firstAgentConfig = this.data.agentConfigList[0];
			const chatRecordsMap = {};
			for (let item of this.data.agentConfigList) {
				chatRecordsMap[item.tabId] = [];
			}
			this.setData({
				agentConfig: firstAgentConfig,
				curTab: {
					id: firstAgentConfig.tabId,
					name: firstAgentConfig.tabName,
					type: firstAgentConfig.type,
				},
				chatRecordsMap,
			});

			// 判断是否有bot类配置，有则拉取所有bot数据
			const botConfig = this.data.agentConfigList.find(
				(item) => item.type === 'bot'
			);
			if (botConfig && botConfig.botIds.length) {
				const ai = wx.cloud.extend.AI;
				const bots = await Promise.all(
					botConfig.botIds.map((id) => ai.bot.get({ botId: id }))
				);
				// console.log('bots', bots)
				this.setData({
					botList: bots,
				});
			}

			const { type } = firstAgentConfig;
			if (type === 'bot') {
				// const ai = wx.cloud.extend.AI;
				// const bot = await ai.bot.get({ botId: firstAgentConfig.botIds[0] });
				const curBot = this.data.botList.find(
					(item) => item.botId === firstAgentConfig.botIds[0]
				);
				this.setData({ bot: curBot, questions: curBot.initQuestions });
				return;
			}
		}
	},
	methods: {
		calculateContentHeight() {
			return new Promise((resolve) => {
				const query = wx.createSelectorQuery().in(this);
				query
					.selectAll('.main >>> .system, .main >>> .user')
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
						console.log('top height', totalHeight);
						resolve(totalHeight);
					})
					.exec();
			});
		},
		onScroll: function (e) {
			if (this.data.scrollTimer) {
				clearTimeout(this.data.scrollTimer);
			}
			const { scrollTop, scrollHeight, height } = e.detail;
			// const distanceFromBottom = scrollHeight - scrollTop - height;

			this.setData({
				scrollTimer: setTimeout(() => {
					console.log(
						'e.detail.scrollTop data.scrollTop',
						scrollTop,
						this.data.scrollTop
					);
					const newTop = Math.max(this.data.scrollTop, e.detail.scrollTop); // ?
					// console.log('new scrollTop', newTop);
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
					// if (distanceFromBottom > 50) {
					// 	this.setData({
					// 		showBack: true,
					// 	});
					// } else {
					// 	this.setData({
					// 		showBack: false,
					// 	});
					// }
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
		handleScrollEnd: function (e) {
			console.log('drag end', e, this.data.scrollTop, e.detail.scrollTop);
			if (this.data.scrollTop - e.detail.scrollTop < 50) {
				this.setData({
					manualScroll: false,
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
		toggleAgentList(e) {
			// console.log('e', e)
			this.setData({
				showAgentList: !this.data.showAgentList,
			});
		},

		switchAgent: async function (e) {
			const bot = e.currentTarget.dataset.bot;
			this.setData({
				showAgentList: false,
				bot,
			});

			// 切换后查库拉取聊天记录，暂不存本地
			// 1.更新当前为当前 bot 会话
			await this.fetchHistoryConversationData();
			// 2. 更新当前 bot 会话记录
			await this.fetchHistoryRecordData(bot.botId);
		},
		changeChatType: async function () {
			this.setData({
				useMicro: !this.data.useMicro,
			});
		},
		clickVoiceBtn: async function () {
			if (true) {
				return; // 先屏蔽
			}
			// this.setData({
			// 	recordStart: true,
			// });
			// const recorderManager = wx.getRecorderManager();

			// recorderManager.onStart(() => {
			// 	console.log('recorder start');
			// });
			// recorderManager.onPause(() => {
			// 	console.log('recorder pause');
			// });
			// recorderManager.onStop((res) => {
			// 	console.log('recorder stop', res);
			// 	const { tempFilePath } = res;
			// 	this.setData({
			// 		recordStart: false,
			// 	});
			// });
			// recorderManager.onFrameRecorded((res) => {
			// 	const { frameBuffer } = res;
			// 	console.log('frameBuffer.byteLength', frameBuffer.byteLength);
			// });

			// const options = {
			// 	duration: 10000,
			// 	sampleRate: 44100,
			// 	numberOfChannels: 1,
			// 	encodeBitRate: 192000,
			// 	format: 'aac',
			// 	frameSize: 50,
			// };

			// recorderManager.start(options);
		},
		fetchHistoryRecordData: async function (botid) {
			const app = getApp();
			const models = app.globalData.models;

			if (!models) {
				return;
			}
			// console.log('e', e.currentTarget.dataset);
			// const { botid, conversation } = e.currentTarget.dataset;
			// 设置会话历史，跳到末尾
			const {
				data: { records, total },
			} = await models.ai_bot_chat_history_5hobd2b.list({
				filter: {
					where: {
						bot_id: {
							$eq: botid,
						},
						// conversation: { // TODO: conversation未区分，暂时用不上
						// 	$eq: conversation,
						// },
					},
				},
				select: {
					_id: true,
					record_id: true,
					role: true,
					content: true,
					createdAt: true,
				},
				pageSize: 20, // 分页大小，建议指定，如需设置为其它值，需要和 pageNumber 配合使用，两者同时指定才会生效
				pageNumber: 1, // 第几页
				getCount: true, // 开启用来获取总数
				orderBy: [
					{
						createdAt: 'desc',
					},
				],
			}); // 拉最近20条
			console.log('records', records, total);
			if (total === 0) {
				const newChatRecordsMap = {
					...this.data.chatRecordsMap,
				};
				newChatRecordsMap[this.data.curTab.id] = [];
				this.setData({
					chatRecordsMap: {
						...newChatRecordsMap,
					},
				});
				return;
			}
			records.sort((a, b) => a.createdAt - b.createdAt);
			const newChatRecordsMap = {
				...this.data.chatRecordsMap,
			};
			newChatRecordsMap[this.data.curTab.id] = [
				...records.map((item) => ({
					record_id: item.record_id,
					role: item.role,
					content: item.content,
				})),
			];
			console.log('chatRecordsMap', newChatRecordsMap);
			this.setData({
				chatRecordsMap: {
					...newChatRecordsMap,
				},
			});
			// 跳尾部
			this.autoToBottom();
		},
		autoToBottom: function () {
			console.log('autoToBottom');
			// const records = this.data.chatRecordsMap[this.data.curTab.id];
			// if (records.length > 0) {
			// 	this.setData({
			// 		scrollTo: 'scroll-bottom',
			// 		// autoScrollToBottomFinished: false,
			// 	});
			// }
			// const finalTop = this.data.scrollTop + 50;
			// this.setData({
			// 	scrollTop: finalTop,
			// 	viewTop: finalTop,
			// });
			this.setData({
				manualScroll: false,
				scrollTo: 'scroll-bottom',
			});
			console.log('scrollTop', this.data.scrollTop);
		},

		fetchHistoryConversationData: async function () {
			const app = getApp();
			const models = app.globalData.models;

			if (!models) {
				return;
			}
			// TODO: 拉取历史会话表数据 (暂只查最近1条获取conversation)，待会话管理功能实现后改造
			const botId = this.data.bot.botId;
			if (botId) {
				const {
					data: { records, total },
				} = await models.ai_bot_chat_history_5hobd2b.list({
					filter: {
						where: {
							bot_id: {
								$eq: botId,
							},
						},
					},
					pageSize: 20, // 分页大小，建议指定，如需设置为其它值，需要和 pageNumber 配合使用，两者同时指定才会生效
					pageNumber: 1, // 第几页
					getCount: true, // 开启用来获取总数
					orderBy: [
						{
							createdAt: 'desc',
						},
					],
				});
				console.log('data', records, total);
				const lastRecord = records[records.length - 1];
				if (total > 0 && lastRecord) {
					this.setData({
						conversations: [
							{
								conversationId: lastRecord.conversation,
								firstRecordContent: lastRecord.content,
								botId: lastRecord.bot_id,
								botName: this.data.bot.name,
								createdAt: new Date(lastRecord.createdAt).toLocaleDateString(),
							},
						],
					});
				} else {
					this.setData({
						conversations: [],
					});
				}
			}
		},
		openDrawer: async function () {
			this.setData({
				isDrawerShow: true,
			});
			await this.fetchHistoryConversationData();
		},
		clickConversation: async function (e) {
			console.log('e', e.currentTarget.dataset);
			const { botid, conversation } = e.currentTarget.dataset;
			// 关闭抽屉
			this.closeDrawer();
			await this.fetchHistoryRecordData(botid);
		},

		closeDrawer() {
			this.setData({
				isDrawerShow: false,
			});
		},

		clickTab: async function (e) {
			this.setData({
				curTab: {
					name: e.target.dataset.name,
					type: e.target.dataset.type,
					id: e.target.dataset.id,
				},
			});
			// 更新对应实例
			const curConfig = this.data.agentConfigList.find(
				(item) => item.tabId === e.target.dataset.id
			);
			if (e.target.dataset.type === 'bot') {
				const ai = wx.cloud.extend.AI;
				const bot = await ai.bot.get({ botId: curConfig.botIds[0] });
				const records = this.data.chatRecordsMap[this.data.curTab.id];
				console.log('records', this.data.chatRecordsMap, records);
				this.setData({
					bot,
					questions: bot.initQuestions,
					agentConfig: curConfig,
				});
			}

			if (e.target.dataset.type === 'model') {
				if (curConfig) {
					this.setData({
						agentConfig: curConfig,
					});
				}
			}
			this.autoToBottom();
		},
		bindInputFocus: function (e) {
			this.setData({
				manualScroll: false,
			});
			this.autoToBottom();
		},
		bindKeyInput: function (e) {
			this.setData({
				inputValue: e.detail.value,
			});
		},
		clearChatRecords: function () {
			const newChatRecordsMap = {
				...this.data.chatRecordsMap,
			};
			newChatRecordsMap[this.data.curTab.id] = [];
			this.setData({
				chatRecords: [],
				chatRecordsMap: {
					...newChatRecordsMap,
				},
				streamStatus: false,
				// setPanelVisibility: !this.data.setPanelVisibility,
			});
			wx.showToast({
				title: '对话清除成功',
				icon: 'success',
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
					console.log('final', [...filterFileList, ...tempFiles]);
					self.setData({
						sendFileList: [...filterFileList, ...tempFiles], //
					});
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
					console.log('final', [...filterFileList, ...tempFiles]);

					self.setData({
						sendFileList: [...filterFileList, ...tempFiles], //
					});
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
					console.log('final', [...filterFileList, ...tempFiles]);
					self.setData({
						sendFileList: [...filterFileList, ...tempFiles], //
					});
				},
			});
		},
		stop: function () {
			console.log('停止');
			this.autoToBottom();

			const { chatRecordsMap } = this.data;
			const chatRecords = chatRecordsMap[this.data.curTab.id];
			const newChatRecords = [...chatRecords];
			console.log('newChatRecords', newChatRecords);
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
			// 唤起文件选择
			// console.log('wx', wx, wx.miniapp);
			// wx.chooseMessageFile({
			// 	count: 10,
			// 	type: 'all',
			// 	success(res) {
			// 		// tempFilePath可以作为img标签的src属性显示图片
			// 		// const tempFilePaths = res.tempFiles;
			// 		console.log('res', res);
			// 		const tempFiles = res.tempFiles.map((item) => ({
			// 			rawType: item.type, // 微信选择默认的文件类型 image/video/file
			// 			fileName: item.name, // 文件名
			// 			tempPath: item.path,
			// 			fileSize: item.size,
			// 			fileUrl: '',
			// 			fileId: '',
			// 		}));
			// 		this.setData({
			// 			sendFileList: tempFiles,
			// 		});
			// 	},
			// });
		},
		closeSetPanel: function () {
			this.setData({ setPanelVisibility: false });
		},
		sendMessage: async function (event) {
			console.log('curTab', this.data.curTab);
			const { message } = event.currentTarget.dataset;
			let { inputValue, bot, agentConfig, chatRecordsMap, streamStatus } =
				this.data;
			const chatRecords = chatRecordsMap[this.data.curTab.id];
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
				record_id: 'record_id' + String(+new Date() - 10),
				role: 'user',
			};
			userRecord.fileList = this.data.sendFileList;
			if (this.data.sendFileList.length) {
				// 清理发送区的文件 && scrollTop 增加文件数量 * 10的位移
				const addTop = this.data.scrollTop + this.data.sendFileList.length * 10;
				// console.log('new scrollTop', addTop);
				if (this.data.manualScroll) {
					this.setData({
						sendFileList: [],
						scrollTop: addTop,
					});
				} else {
					this.setData({
						sendFileList: [],
						scrollTop: addTop,
						viewTop: addTop,
					});
				}
			}
			const record = {
				content: '...',
				record_id: 'record_id' + String(+new Date() + 10),
				role: 'assistant',
			};
			const newChatRecordsMap = {
				...this.data.chatRecordsMap,
			};
			newChatRecordsMap[this.data.curTab.id] = [
				...chatRecords,
				userRecord,
				record,
			];
			console.log('newChatRecordsMap', newChatRecordsMap);
			this.setData({
				inputValue: '',
				questions: [],
				chatRecordsMap: {
					...newChatRecordsMap,
				},
				streamStatus: false,
			});

			// 设置最新一对对话记录时，将scrollTop 对应也要增加
			const newScrollTop = this.data.scrollTop + 20;
			this.setData({
				scrollTop: newScrollTop,
				viewTop: newScrollTop,
			});
			// 先这样写，后面抽离出来
			if (type === 'bot') {
				const ai = wx.cloud.extend.AI;
				console.log('bot chatRecords', this.data.chatRecordsMap);
				const chatRecords = this.data.chatRecordsMap[this.data.curTab.id];
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
						// fileIds: ['a'], // 新增
						// conversationId: '1', // 新增
					},
				});
				this.setData({ streamStatus: true });
				let contentText = '';
				let reasoningText = '';
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
						// const newValue = [...this.data.chatRecords];
						const newValue = [...this.data.chatRecordsMap[this.data.curTab.id]];
						newValue[newValue.length - 1] = {
							record_id,
							role: dataJson.role || 'assistant',
							content: contentText,
							reasoning_content: reasoningText,
						};
						const newChatRecordsMap = {
							...this.data.chatRecordsMap,
						};
						// console.log('new value', newValue);
						newChatRecordsMap[this.data.curTab.id] = newValue;
						// this.setData({ chatRecords: newValue });
						// console.log('final newChatRecordsMap', newChatRecordsMap);
						this.setData({ chatRecordsMap: { ...newChatRecordsMap } });
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
					console.log('recommendRes', recommendRes);
					let result = '';
					for await (let str of recommendRes.textStream) {
						console.log(str);
						this.toBottom();
						result += str;
						this.setData({
							questions: result.split('\n').filter((item) => !!item),
						});
					}
				}
			}
			if (type === 'model') {
				const chatRecords = this.data.chatRecordsMap[this.data.curTab.id];
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
								role: 'user',
								content: inputValue,
							},
						],
					},
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
						// const newValue = [...this.data.chatRecords];
						const newValue = [...this.data.chatRecordsMap[this.data.curTab.id]];
						newValue[newValue.length - 1] = {
							content: contentText,
							reasoning_content: reasoningText,
							record_id: 'record_id' + String(id),
							role: role,
						};
						const newChatRecordsMap = {
							...this.data.chatRecordsMap,
						};
						newChatRecordsMap[this.data.curTab.id] = newValue;
						this.setData({ chatRecordsMap: { ...newChatRecordsMap } });
					} catch (e) {
						// console.log(e, event)
						break;
					}
				}
				this.setData({ streamStatus: false });
			}
			// // 清理发送区的文件
			// this.setData({
			//   sendFileList: []
			// })
		},
		toBottom: async function () {
			// const newTop = this.data.scrollTop + 4;
			// console.log('new scrollTop', newTop);
			// if (this.data.manualScroll) {
			// 	this.setData({
			// 		scrollTop: newTop,
			// 	});
			// } else {
			// 	this.setData({
			// 		scrollTop: newTop,
			// 		viewTop: newTop,
			// 	});
			// }
			const clientHeight = this.data.windowInfo.windowHeight - 160; // 视口高度
			const contentHeight =
				(await this.calculateContentHeight()) +
				(await this.calculateContentInTop()); // 内容总高度
			console.log(
				'contentHeight clientHeight newTop',
				contentHeight,
				clientHeight,
				this.data.scrollTop + 4
			);
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

		// onScroll: function (e) {
		// 	// 清除之前的定时器
		// 	if (this.data.scrollTimer) {
		// 		clearTimeout(this.data.scrollTimer);
		// 	}

		// 	const scrollHeight = e.detail.scrollHeight;
		// 	const scrollTop = e.detail.scrollTop;
		// 	const clientHeight = this.data.windowInfo.windowHeight - 160;
		// 	const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		// 	// 设置新的定时器
		// 	this.setData({
		// 		distanceFromBottom,
		// 		scrollTimer: setTimeout(() => {
		// 			console.log('distanceFromBottom', distanceFromBottom);
		// 			console.log('滚动结束');
		// 			console.log('new scrollTop', e.detail.scrollTop);
		// 			if (this.data.autoScrollToBottomFinished) {
		// 				// 不受自动滚动逻辑影响
		// 				if (distanceFromBottom > 50) {
		// 					// 留一个小范围往上拉
		// 					// if (!this.data.showBack) {
		// 					this.setData({
		// 						showBack: true,
		// 					});
		// 				} else {
		// 					console.log('到底部');
		// 					// if (this.data.showBack) {
		// 					this.setData({
		// 						showBack: false,
		// 					});
		// 				}
		// 			}

		// 			// 在这里执行自动滚动结束后的操作
		// 			if (!this.data.autoScrollToBottomFinished) {
		// 				this.setData({
		// 					autoScrollToBottomFinished: true,
		// 					scrollTop: e.detail.scrollTop,
		// 				});
		// 			}
		// 		}, 100),
		// 	});
		// },
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
	},
});
