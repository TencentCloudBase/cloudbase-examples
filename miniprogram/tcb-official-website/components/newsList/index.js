Component({

  /**
   * 组件的属性列表
   */
  properties: {
    number:{
      type: Number,
      value:0
    },
    title:{
      type:String,
      value:""
    },
    time:{
      type:String,
      value:""
    },
    image:{
      type:String,
      value:""
    },
    id:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async goDetail(event){
      wx.navigateTo({
        url: `/pages/detail/index?type=news&id=${this.id}&title=${event.currentTarget.dataset.title}`
      })
    }  
  },
})