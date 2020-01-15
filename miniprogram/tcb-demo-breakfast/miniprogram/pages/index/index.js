const app = getApp();
var that = this;
const doneSID = 'Xw4e3cMQ3Bp2Fm2B4xaPZ213BicUK1CeozGoBUrcBDA'
const stateSID = 'gkuwX69tU4YsS6Up6Lhhh3G8eSzh1SgN4zSifDfYk0c';

Page({
  data:{
    sale:false,
    model:0
  },
  onLoad(){
    that = this;
  },
  onShow(){
    this.init();
  },
  init(){
    wx.cloud.callFunction({
      name:'initfood',
      success(res){
        console.log(res.result)
        let mess = {}
        if(res.result==-1) mess.model=3;//加载失败
        else if(res.result==1) mess.model=4;//被禁止
        else{
          if(res.result.state==null){
            mess.model=1;
            mess.desc='早餐价格：'+res.result.Food.price+'元';
            mess.tips=res.result.Food.tips;
            mess.fooddes=res.result.Food.food;
            mess.foodimg=res.result.Food.img;
          }
          else{
            mess.model=2;
            mess.state=res.result.state;
            mess.submittime=res.result.submittime;
            mess.SID=res.result.SID;
            mess.statetime=res.result.statetime;
            mess.donetime=res.result.donetime;
            mess.tel = res.result.Food.tel;
          }
        }
        that.setData(mess);
      },
      fail(e){
        console.log(e);
      }
    })
  },
  select(e){
    this.setData({
      sale:true
    })
  },
  submit(e){
    if(e.detail.errMsg=="getUserInfo:ok"){
      this.uInfo = e.detail.userInfo;
      wx.chooseAddress({
        success (res) {
          that.uAddress = res;
          console.log(res);
          let name = res.userName;
          let tel = res.telNumber;

          if(res.cityName=="深圳市"&&res.countyName=="南山区"){
            let address = res.provinceName + res.cityName + res.countyName + res.detailInfo;
            
            that.setData({
              taddress:address,
              tname:name,
              ttel:tel,
              sale:false,
              conf:true,
              nosubmit:false
            })
          }
          else{
            that.setData({
              taddress:"当前地址不在配送范围内，只限深圳市南山区，感谢理解！",
              tname:name,
              ttel:tel,
              sale:false,
              conf:true,
              nosubmit:true
            })
          }
        }
      })
    }
  },
  cancel(){
    wx.showLoading({
      title:'取消中'
    })
    wx.cloud.callFunction({
      name:'cancelfood',
      success(){
        that.init();
        wx.showToast({
          title: '取消成功',
        })
      }
    })
  },
  reset(){
    that.setData({
      sale:true,
      conf:false
    })
  },
  confirm(){
    wx.requestSubscribeMessage({
      tmplIds: [stateSID,doneSID],
      success(res) {
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          console.log(res);
          that.setData({conf:false})
          wx.showLoading({
            title: '订餐中',
            mask:true
          })
          let doneMess = (res[doneSID]=='accept');
          let stateMess = (res[stateSID]=='accept');
          wx.cloud.callFunction({
            name: 'submitfood',
            data: {
              Info:that.uInfo,
              Address:that.uAddress,
              stateMess:stateMess,
              doneMess:doneMess
            },
            success(res){
              wx.hideLoading();
              that.init();
              wx.showToast({
                title: '订餐成功'
              });
            },
            fail(e){
              wx.hideLoading();
              wx.showModal({
                title:'网络错误',
                content:'订餐请求发起失败，请检查网络后重新尝试！',
                showCancel:false
              })
            }
          })
        }
      },
    });
  },
  handleContact(e){
    console.log(e);
  }
})
