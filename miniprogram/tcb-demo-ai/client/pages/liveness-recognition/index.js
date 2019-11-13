import regeneratorRuntime from '../../libs/runtime'
import TcbService from '../../libs/tcb-service-mp-sdk/index'
const tcbService = new TcbService()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRecording: false,
    buttonType: 'primary',
    action: '录制',
    number: '',
    src: null,
    name: '',
    idcard: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},
  

  async generateNumber() {
    wx.showLoading({
      mask: true
    })

    let result = await tcbService.callService({
      service: 'ai',
      action: 'GetLiveCode'
    })

    console.log(result)

    if (result.data && result.data.LiveCode) {
      this.setData({
        number: result.data.LiveCode
      }, () => {
        wx.hideLoading()
      })
    }
    else {
      wx.hideLoading()
      wx.showToast({
        title: '获取数字失败，请重试',
        icon: 'none'
      })
    }
    
  },

  toggleRecord() {
    let isRecording = !this.data.isRecording
    let buttonType = (isRecording) ? 'warn' : 'primary'
    this.setData({
      isRecording,
      buttonType,
      action: (isRecording) ? '完成' : '录制',
      src: isRecording ? null : this.data.src
    }, () => {
      if (!isRecording) {
        this.stopRecord()
      }
      else {
        this.takeRecord()
      }
    })
  },

  async takeRecord() {
    
    await this.generateNumber()

    this.ctx = wx.createCameraContext()
    this.ctx.startRecord({
      success(res) {
        console.log(res);
      },
      fail() {
        wx.showToast({
          title: '打开摄像头失败',
          icon: 'none'
        })
      }
    })
  },

  stopRecord() {
    this.ctx.stopRecord({
      success: async (res) => {
        console.log('====video path=====')
        console.log(res.tempVideoPath);
        
        wx.showLoading({
          title: '上传中',
          mask: true
        })
        
        try {
          let result = await wx.cloud.uploadFile({
            cloudPath: Date.now() + '.mp4',
            filePath: res.tempVideoPath, // 小程序临时文件路径
          })

          console.log(result);
          if (!result.fileID) {
            throw new Error(result.errMsg);
          }

          this.setData({
            src: result.fileID
          }, () => {
            wx.hideLoading()
          })
        }
        catch (e) {
          wx.hideLoading()
          wx.showToast({
            title: '录制失败，请重试',
            icon: 'none'
          })
        }
        
      },

      fail() {
        wx.showToast({
          title: '录制失败，请重试',
          icon: 'none'
        })
      }
    });
  },

  async submit() {
    try {
      wx.showLoading({
        title: '验证中',
        icon: 'none'
      })

      let { number, src, name, idcard } = this.data

      if (!name || !idcard) {
        wx.hideLoading()
        wx.showToast({
          title: '姓名和身份证不能为空',
          icon: 'none'
        })
      }

      let result = await tcbService.callService({
        service: 'ai',
        action: 'LivenessRecognition',
        data: {
          ValidateData: number,
          VideoFileID: src,
          Name: name,
          IdCard: idcard,
          LivenessType: 'LIP'
        }
      })

      console.log(result)

      wx.hideLoading()
      if (!result.code && result.data.Sim > 70) {
        wx.showToast({
          title: '验证成功',
          mask: true
        })
      }
      else {
        throw new Error('验证失败')
      }
      
    }
    catch(e) {
      wx.hideLoading()
      wx.showToast({
        title: '验证失败',
        icon: 'none',
        mask: true
      })
    }

  },
  
  error(e) {
    console.log(e.detail)
  },

  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  getIdCard(e) {
    this.setData({
      idcard: e.detail.value
    })
  }
})