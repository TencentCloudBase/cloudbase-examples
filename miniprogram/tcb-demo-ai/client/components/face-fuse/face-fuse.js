import regeneratorRuntime from '../../libs/runtime'
import TcbService from '../../libs/tcb-service-mp-sdk/index'
const tcbService = new TcbService()
let customImgUrl = 'https://10.url.cn/eth/ajNVdqHZLLBn1TC6loURIX2GB5GB36NBNZtycXDXKGARFHnJwhHD8URMvyibLIRBTJrdcONEsVHc/'

Component({
    data: {
      fileID: null,
      hasUploaded: false,
    },

    methods: {
      handleUploadTap() {
        this.uploadImage();
      },

      async handleRecognizeTap() {
        await this.callFunction();
      },

      uploadImage() {
        // 重新上传，清空结果
        this.setData({
          customImgUrl,
          resultImgUrl: null
        })

        wx.chooseImage({
          success: (dRes) => {
            wx.showLoading({
                title: '上传中',
            });

            const fileName = dRes.tempFilePaths[0]
            const dotPosition = fileName.lastIndexOf('.')
            const extension = fileName.slice(dotPosition)
            const cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000)}${extension}`
            wx.cloud.uploadFile({
              cloudPath,
              filePath: dRes.tempFilePaths[0],
              success: (res) => {
                console.log(res)
                this.setData({
                  fileID: res.fileID,
                  hasUploaded: true
                }, () => {
                  wx.hideLoading()
                  // this.getTempFileURL();
                })
              },
              fail: () => {
                wx.hideLoading();
                wx.showToast({
                  title: '上传失败',
                  icon: 'none',
                })
              },
            })
          },
        })
      },

      async callFunction() {
        wx.showLoading({
            title: '融合中',
            icon: 'none',
        });

        try {
          let result = await tcbService.callService({
            service: 'ai',
            action: 'FaceFusion',
            data: {
              FileID: this.data.fileID
            }
          })
          wx.hideLoading();

          if (!result.code && result.data.Image) {
            this.setData({
              resultImgUrl: result.data.Image
            })
          }
          else {
            wx.showToast({
              title: '识别失败',
              icon: 'none',
            })
          }
        }
        catch (e) {
          wx.hideLoading();
          wx.showToast({
            title: '识别失败',
            icon: 'none',
          })
          console.log(e);
        }
      },
    },

    properties: {
        uploadText: {
          type: String,
          value: '上传图片',
        },
        recognizeText: {
          type: String,
          value: '识别图片',
        },
        customImgUrl: {
          type: String,
          value: customImgUrl,
        },
        templateImgUrl: String,
        hideTemplate: {
          type: Boolean,
          value: false
        }
    },
});
