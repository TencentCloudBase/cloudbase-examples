import * as echarts from '../../ec-canvas/echarts';
var that = null;
Page({
  data:{
    starbtn:false,
    starflag:false,
    starload:false
  },
  onLoad(){
    that=this;
    let data=wx.getStorageSync('tempuser');
    this.setData(data);
    this.option = this.loadoptions({
      date:data.rundata.Rdate,
      data:data.rundata.Rdata,
      min:0
    });
    wx.setNavigationBarTitle({
      title: data.nickname+'的运动',
    })
    this.init(data._id);
  },
  init(id){
    wx.cloud.callFunction({
      name:'tostar',
      data:{
        ta:id
      },
      success(res){
        that.setData({
          starbtn:res.result.status==2?false:true,
          starflag:res.result.status==1?true:false,
          starnum:res.result.num
        })
      }
    })
  },
  onReady(){
    this.Loadcharts(()=>{
      this.chart.setOption(this.option);
    });
  },
  Loadcharts(succ){
    this.ecComponent = this.selectComponent('#mychart-dom-line2');
    this.ecComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.chart = chart;
      succ();
      return chart;
    });
  },
  loadoptions(obj){
    return {
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
  },
  topreview(){
    wx.previewImage({
      urls: [this.data.perimg],
    })
  },
  tostar(){
    this.setData({
      starload:true
    })
    wx.cloud.callFunction({
      name:"setstar",
      data:{
        ta:that.data._id,
        flag:that.data.starflag
      },
      success(res){
        that.setData({
          starbtn:res.result.status==2?false:true,
          starflag:res.result.status==1?true:false,
          starnum:res.result.num,
          starload:false
        })
      },
      fail(e){
        console.log(e);
        that.setData({
          starload:false
        })
      }
    })
  }
})