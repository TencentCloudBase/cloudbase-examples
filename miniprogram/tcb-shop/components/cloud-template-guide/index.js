import { cloudbaseTemplateConfig } from '../../config/index';

Component({
  properties: {
    show: {
      type: Boolean,
      value: cloudbaseTemplateConfig.useMock,
    },
    title: {
      type: String,
      value: '替换为真实数据',
    },
    text: {
      type: String,
      value: '当前为体验数据，切换为真实数据请复制下方链接并在浏览器中打开，通过指引帮您快速替换',
    },
    url: {
      type: String,
      value:
        'https://tcb.cloud.tencent.com/cloud-template/detail?appName=electronic-business&from=wxide_tcb_shop',
    },
  },

  data: {
    dialogShow: false,
  },

  methods: {
    open() {
      this.setData({ dialogShow: true });
    },
    close() {
      this.setData({ dialogShow: false });
    },
    copy() {
      wx.setClipboardData({
        data: this.data.url,
      });
    },
  },
});
