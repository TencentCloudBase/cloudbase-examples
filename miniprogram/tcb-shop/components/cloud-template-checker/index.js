Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    text: {
      type: String,
      value: ""
    },
    url: {
      type: String,
      value: ""
    }
  },

  methods: {
    check() {
      this.triggerEvent("check");
    },
    copy() {
      wx.setClipboardData({
        data: this.data.url,
      });
    },
  },

  lifetimes: {
    attached: function () {
      this.check();
    },
  },
});
