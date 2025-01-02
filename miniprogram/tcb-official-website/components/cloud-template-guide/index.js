import { cloudbaseTemplateConfig } from '../../config/index';

Component({
  properties: {
    show: {
      type: Boolean,
      value: cloudbaseTemplateConfig.useMock,
    },
    title: {
      type: String,
      value: '安装模板后端',
    },
    text: {
      type: String,
      value: '当前为前端模拟数据，如需使用模板后端，请打开下方链接，跟随指引进行安装',
    },
    url: {
      type: String,
      value:
        'https://tcb.cloud.tencent.com/cloud-template/detail?appName=cloudbase_official_website&from=wxide_tcb_official_website',
    },
  },

  data: {
    dialogShow: false,
  },

  methods: {
    open () {
      this.setData({ dialogShow: true });
    },
    close () {
      this.setData({ dialogShow: false });
    },
    copy () {
      wx.setClipboardData({
        data: this.data.url,
      });
    },
  },
});
