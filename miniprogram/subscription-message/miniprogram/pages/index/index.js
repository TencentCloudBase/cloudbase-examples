const app = getApp();
const lessonTmplId = '';

Page({
  onSubscribe: function(e) {
    if(!this.text||this.text==''){
      wx.showToast({
        title: '没有填写内容',
        icon:'none'
      })
      return;
    }
    let date = new Date();
    const item = {
      thing1: {
        value: this.text
      },
      date2: {
        value: this.formdate(date)
      }
    }
    console.log(item);
    wx.requestSubscribeMessage({
      tmplIds: [lessonTmplId],
      success(res) {
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          wx.showLoading({
            title: '订阅中',
            mask:true
          });
          wx.cloud.callFunction({
            name: 'send',
            data: {
              data: item,
              date: date,
              templateId: lessonTmplId,
            },
          }).then(() => {
            wx.hideLoading();
            wx.showToast({
              title: '订阅成功'
            });
          }).catch(() => {
            wx.showToast({
              title: '订阅失败',
              icon: 'none'
            });
          });
        }
      },
    });
  },
  textin(e){
    this.text = e.detail.value;
  },
  formdate(date){
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var date1 = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var second = date.getSeconds();
    return year + "年" + month + "月" + date1 + "日 " + hour + ":" + minutes;
  }
});