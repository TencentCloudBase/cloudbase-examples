// components/agent-ui/markdownPreview/index.js
import { markdownToWxml } from './utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    markdown: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    text: {}
  },
  observers: {
    'markdown': function (value) {
      const wxml = markdownToWxml(value)
      this.setData({ text: wxml })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})