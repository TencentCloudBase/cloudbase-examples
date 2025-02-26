// components/agent-ui-new/chatFIle/chatFile.js
Component({
  lifetimes: {
    attached: function () {
      // const formatSize = this.transformSize(this.data.fileSize)
      const {fileName, tempPath, fileId} = this.data.fileData
      const type = this.getFileType(fileName)
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
      wx.cloud.uploadFile({
        cloudPath: fileName, // 云上文件路径
        filePath: tempPath, // 本地文件路径
        success: res => {
            console.log('上传成功，fileID为：', res.fileID);
            // 此时你可以使用res.fileID进行后续操作
            // this.setData({
            //   fileData: {
            //     ...this.data.fileData,
            //     fileId: res.fileID
            //   }
            // })
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
      value: true
    },
    fileData: {
      type: Object,
      value: {
        tempId: '',
        rawType: '',
        fileName: '',
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
		// 提取文件后缀
		getFileType: function (fileName) {
			let index = fileName.lastIndexOf('.');
      const fileExt = fileName.substring(index + 1);
      if(fileExt === 'docx' || fileExt === 'doc') {
        return 'word'
      }
      if(fileExt === 'xlsx' || fileExt === 'xls') {
        return 'excel'
      }
      if(fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'svg') {
        return 'image'
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
    }
	},
});
