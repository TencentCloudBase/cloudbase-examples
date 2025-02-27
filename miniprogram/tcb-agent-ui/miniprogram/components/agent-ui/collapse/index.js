// components/agent-ui/collapsibleCard/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    initStatus: {
      type: Boolean,
      value: false
    },
    showBgColor:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    collapsedStatus: false
  },
  lifetimes: {
    attached() {
      this.setData({ collapsedStatus: this.properties.initStatus })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeCollapsedStatus: function () {
      this.setData({ collapsedStatus: !this.data.collapsedStatus })
    }
  },
  options: {
    multipleSlots: true
  }
})