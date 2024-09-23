const NEVER_SHOW_KEY = 'never_show_cloud_template_init_dialog';

Component({
  properties: {
    show: {
      type: Boolean,
      value: true,
    },
    url: {
      type: String,
      value: '',
    },
  },

  data: { checked: false },

  methods: {
    close() {
      if (this.data.checked) {
        wx.setStorageSync(NEVER_SHOW_KEY, 'true');
      }
    },
    copy() {
      wx.setClipboardData({
        data: this.data.url,
      });
    },
    neverShowChanged({ detail: { checked } }) {
      this.setData({ checked });
    },
  },

  lifetimes: {
    attached: function () {
      const ifNever = wx.getStorageSync(NEVER_SHOW_KEY);
      this.setData({
        show: ifNever !== 'true',
      });
    },
  },
});
