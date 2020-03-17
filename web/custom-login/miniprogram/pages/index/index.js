const app = getApp();
const db = wx.cloud.database();
var that = null;
Page({
  onLoad(){
    that = this;
    that.toadmin();
  },
  toadmin(){
    //TODO 管理初始化，在admin数据库中找记录
    wx.cloud.database().collection('admin').get()
    .then(res => {
        let number = -1;
        if (res.data.length != 0) {
            number = res.data[0]._id;
            that.setData({
              number: number
            })
        }
        else{
          that.addadmin();
        }
    });
  },
  addadmin(count = 1) {
    //TODO 新建管理用户码
    let that = this;
    wx.showLoading({
        title: '注册中(' + count + ')',
    });
    const id = (Math.floor(Math.random() * (8999)) + 1000).toString();
    console.log('注册id:', id);
    wx.cloud.database().collection('admin').add({
        data: {
            _id: id
        }
    }).then(res => {
        console.log(res);
        wx.hideLoading();
        that.setData({
            number: res._id
        })
    }).catch(e => {//如果有重复的，则重新执行一遍
        that.toadmin(count + 1);
        console.log(e);
    })
  }
})
