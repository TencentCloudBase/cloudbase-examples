const app = getApp();
const lessonTmplId = '';

Page({
  data: {

  },
  onSubscribe: function(e) {
    let date = new Date(Date.parse(new Date())+5000);
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
      // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
      tmplIds: [lessonTmplId],
      success(res) {
        // 申请订阅成功
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          wx.showLoading({
            title: '订阅中',
            mask:true
          })
          /*【开始】-----------------【代码观看位置A-1】-----------------【开始】*/
          wx.cloud.callFunction({
            name: 'subscribe',
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
          /*【结束】-----------------【代码观看位置A-1】-----------------【结束】*/
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
