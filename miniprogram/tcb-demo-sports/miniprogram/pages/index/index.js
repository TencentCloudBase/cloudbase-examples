const app = getApp();
import * as echarts from '../../ec-canvas/echarts';
var that=null;
var today=null;

Page({
  data:{
    ec: {
      lazyLoad: true 
    },
    today:parseInt(new Date(new Date().toLocaleDateString()).getTime()/1000),
    chartload:false
  },
  onLoad(options){
    that = this;
    let old = wx.getStorageSync('RunData');
    if(old!=""||old!=null){
      this.setData(old);
    }
  },
  onShow(){
    this.init();
  },
  onReady(){
    this.Loadcharts(()=>{});
  },
  onPullDownRefresh(){
    this.init();
  },
  init(){
    wx.showNavigationBarLoading();
    app.initRun({
      success(res){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        that.setData(app.globalData.rundata);
        if(app.globalData.rundata.runauth==true){
          console.log('更新运动数据')
          that.GetRunData();
        }
        else{
          that.setData({
            chartload:false
          })
        }
      },
      fail(e){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
      }
    })
  },
  Scope(scope,doit,fail){
    wx.getSetting({
      success(setres) {
        if (!setres.authSetting[scope]) {
          console.log('2')
          wx.authorize({
            scope: scope,
            success () {
              doit()
            },
            fail(e){
              wx.hideNavigationBarLoading();
              wx.hideLoading();
              fail();
            }
          })
        }
        else{
          doit()
        }
      }
    })
  },
  toGetRunData(){
    wx.showLoading({
      title: '载入运动数据',
    })
    this.GetRunData();
  },
  GetRunData(){
    this.Scope("scope.werun",function(){
      wx.getWeRunData({
        success (authres) {
          const cloudID = authres.cloudID
          that.GetRunDataCall(wx.cloud.CloudID(cloudID),function(callres){
            that.setData({
              rundata:callres.result,
              runauth:true
            })
            that.LoadRunData(callres.result);
            wx.hideNavigationBarLoading();
          })
        }
      })
    },function(){
      wx.setStorageSync('RunFlag', false);
      wx.showModal({t:'',
        title:'提示',
        content:'应用需要你的运动步数数据用于趋势记录和生成你的分享图，不会用于其他场景和服务。没有数据你也可以浏览他人的分享，但是你不能发起分享。',
        confirmText:'重新授权',
        success(e){
          if(e.confirm){
            wx.openSetting({
              success (res) {
                if(res.authSetting['scope.werun']==true){
                  wx.showNavigationBarLoading()
                  that.GetRunData();
                }
                else{
                  that.GetRunDataCall(null,()=>{
                    that.init();
                  });
                }
              }
            })
          }
          if(e.cancel){
            that.GetRunDataCall(null,()=>{
              that.init();
            });
          }
        }
      })
      that.setData({
        RunFlag:false
      })
    })
  },
  GetRunDataCall(mess,succ){
    wx.cloud.callFunction({
      name:"getRun",
      data:{
        mess:mess
      },
      success(callres){
        succ(callres);
      },
      fail(calle){
        console.log(calle);
      },
      complete(){
        wx.hideLoading()
      }
    })
  },
  LoadRunData(rundata){
    let now=new Date(new Date().toLocaleDateString());
    let Rdata=[];
    let Rdate=[];
    let Rmin=0;
    for(let i =6;i>=0;i--){
      let tim = new Date(now.getTime()-86400000*i);
      let runtemp = rundata[parseInt(tim.getTime()/1000)];
      let runitem = runtemp?runtemp.step:0;
      if(runitem!=null&&runitem<Rmin) Rmin=runitem;
      Rdata.push(runitem);
      Rdate.push(i==6?(tim.getMonth())+1+'.'+tim.getDate():tim.getDate());
    }
    this.setOption({
      date:Rdate,
      data:Rdata,
      min:Rmin
    });
  },
  Loadcharts(succ){
    this.ecComponent = this.selectComponent('#mychart-dom-line');
    if(this.ecComponent!=null){
      this.ecComponent.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        this.chart = chart;
        this.setData({
          chartload:true
        })
        succ();
        return chart;
      });
    }
  },
  setOption(obj){
    var option = {
      color: ["#ff2245"],
      grid: {
        show:false,
        left:10,
        right:10,
        top:20,
        bottom:20
      },
      xAxis: {
        show: true,
        type: 'category',
        data: obj.date,
        axisLabel:{
          color:"#ffffff",
          interval:0
        },
        axisLine:{
          show:false
        },
        axisTick:{
          show:false
        }
      },
      yAxis: {
        show:false,
        min:obj.min
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{c}',
        backgroundColor:'rgba(250,250,250,0.2)'
      },
      series: [{
        type: 'line',
        smooth: true,
        data: obj.data,
      }]
    };
    if(this.data.chartload){
      console.log('装载')
      this.chart.setOption(option);
    }
    else{
      this.Loadcharts(()=>{
        this.chart.setOption(option);
      })
    }
  },
  onShareAppMessage(){
    return{
      title:this.data.runtext!=""?this.data.runtext:'TM运动-记录你的每一天',
      imageUrl:this.data.runimg?this.data.runimg:"../../image/share.png"
    }
  },
  tocreate(e){
    wx.navigateTo({
      url: '../edit/edit',
    })  
  },
  toother(e){
    wx.setStorageSync('tempuser', this.data.other[e.currentTarget.dataset.i]);
    wx.navigateTo({
      url: '../show/show'
    })
  }
})