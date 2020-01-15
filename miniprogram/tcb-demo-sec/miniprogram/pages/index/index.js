const app = getApp()
Page({
  textin(e){
    this.text = e.detail.value;
  },
  textcheck:function(){
    let text = this.text;
    if(text==""||text==null){
      return;
    }
    wx.showLoading({
      title: '检查中',
      mask:true
    })
    wx.cloud.callFunction({
      name:"textsec",
      data:{
        text:text
      },
      success(e){
        wx.hideLoading();
        wx.showToast({
          title: '内容安全'
        })
      },
      fail(e){
        wx.hideLoading();
        wx.showModal({
          title: '风险提示',
          content: '这是不安全的内容',
          showCancel:false
        })
      }
    })
  },

  imgcheck:function(){
    let that=this;
    wx.chooseImage({
      count: 1,
      success (res) {
        that.setData({
          showimg:res.tempFilePaths[0]
        })
        that.upload(res.tempFilePaths[0]);
      }
    })
  },
  upload(img){
    let that=this;
    wx.showLoading({
      title:"上传文件中"
    })
    wx.cloud.uploadFile({
      cloudPath: Number(Math.random().toString().substr(3,3) + Date.now()).toString(36)+'.png',
      filePath: img,
      success: res => {
        that.imgcheckcall(res.fileID);
      }
    })
  },
  imgcheckcall(ID){
    wx.showLoading({
      title:"检查中"
    })
    wx.cloud.callFunction({
      name:"imagesec",
      data:{
        img:ID
      },
      success(e){
        wx.hideLoading();
        wx.showToast({
          title: '内容安全'
        })
      },
      fail(e){
        wx.hideLoading();
        wx.showModal({
          title: '风险提示',
          content: '这是不安全的内容',
          showCancel:false
        })
      },
      complete(){
        wx.cloud.deleteFile({
          fileList:[ID]
        })
      }
    })
  }
})
