// components/agent-ui-new/chatFIle/chatFile.js
Component({
  lifetimes: {
    attached: function () {
      console.log('enableDel', this.data.enableDel)
      // const formatSize = this.transformSize(this.data.fileSize)
      const {tempFileName, rawFileName, tempPath, fileId, botId} = this.data.fileData
      const type = this.getFileType(tempFileName)
      console.log('type', type)
      if(fileId) {
        this.setData({
          formatSize: this.transformSize(this.data.fileData.fileSize),
          iconPath: '../imgs/' + type + '.svg'
        })
        return 
      }

      this.setData({
        formatSize: '解析中',
        iconPath: '../imgs/' + type + '.svg'
      })

      // 上传云存储获取 fileId
      console.log('rawFileName tempFileName tempPath',rawFileName, tempFileName, tempPath)
      wx.cloud.uploadFile({
        cloudPath: this.generateCosUploadPath(botId, rawFileName ? (rawFileName.split('.')[0] + '-' + tempFileName) : tempFileName), // 云上文件路径
        filePath: tempPath, // 本地文件路径
        success: res => {
            console.log('上传成功，fileID为：', res.fileID);
            this.triggerEvent('changeChild', {tempId: this.data.fileData.tempId, fileId: res.fileID})
        },
        fail: err => {
            console.error('上传失败：', err);
        }
      });
    }
  },
  observers: {
    'fileData.fileId': function(fileId) {
      if(!fileId) {
        this.setData({
          formatSize: '解析中'
        })
      } else {
        this.setData({
          formatSize: this.transformSize(this.data.fileData.fileSize)
        })
      }
    }
  },
	/**
	 * 组件的属性列表
	 */
	properties: {
    enableDel: {
      type: Boolean,
      value: false
    },
    fileData: {
      type: Object,
      value: {
        tempId: '',
        rawType: '',
        tempFileName: '',
        rawFileName: '',
        tempPath: '',
        fileSize: 0,
        fileUrl: '',
        fileId: ''
      }
    }
	},

	/**
	 * 组件的初始数据
	 */
	data: {
    formatSize: '',
    iconPath: '../imgs/file.svg'
  },
	/**
	 * 组件的方法列表，
	 */
	methods: {
    generateCosUploadPath: function (botId, fileName) {
      return `agent_file/${botId}/${fileName}`
    },
		// 提取文件后缀
		getFileType: function (fileName) {
			let index = fileName.lastIndexOf('.');
      const fileExt = fileName.substring(index + 1);
      if(fileExt === 'docx' || fileExt === 'doc') {
        return 'word'
      }
      if(fileExt === 'xlsx' || fileExt === 'xls' || fileExt === 'csv') {
        return 'excel'
      }
      if(fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'svg') {
        return 'image'
      }

      if(fileExt === 'ppt' || fileExt === 'pptx') {
        return 'ppt'
      }

      if(fileExt === 'pdf') {
        return 'pdf'
      }
      return 'file'
    },
    // getFileIcon: function (fileName) {
    //   const type = this.getFileType(fileName)
    //   console.log('type', type)
    //   if(type === 'pdf') {
    //     return 'pdf.png'
    //   }

    //   return 'image.png'
    // },
		// 转换文件大小（原始单位为B）
		transformSize: function (size) {
			if (size < 1024) {
				return size + 'B';
			} else if (size < 1024 * 1024) {
				return (size / 1024).toFixed(2) + 'KB';
			} else {
				return (size / 1024 / 1024).toFixed(2) + 'MB';
			}
    },
    removeFileFromParents: function () {
      console.log('remove', this.data.fileData)
      this.triggerEvent('removeChild', {tempId: this.data.fileData.tempId})
    },
    openFile: function () {
      if(this.data.fileData.tempPath) {
        if(this.data.fileData.rawType === 'file') {
          const fileExt = this.data.fileData.tempPath.split('.')[1]
          if(['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'].includes(fileExt)) {
            wx.openDocument({
              filePath: this.data.fileData.tempPath,
              success: function (res) {
                console.log('打开文档成功')
              },
              fail: function (err) {
                console.log('打开文档失败', err)
              }
            })
          }else {
            wx.showModal({
              content: "当前支持文件类型为 pdf、doc、docx、ppt、pptx、xls、xlsx",
              showCancel: false,
              confirmText: '确定'
            })
          }
        }else {
          console.log('fileId', this.data.fileData.fileId)
          if(this.data.fileData.fileId) {
            wx.previewImage({
              urls: [this.data.fileData.fileId],
              showmenu: true,
              success: function (res) {
                console.log('res', res)
              },
              fail: function (e) {
                console.log('e', e)
              }
            })
          }
        }
      }
      // TODO: 针对带cloudID的处理（历史记录中附带的文件）
    }
	},
});
