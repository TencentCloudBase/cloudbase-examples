/* global getApp, Page */
Page({
    data: {
      title: '身份证识别'
    },
    handleFinish(e) {
        if (!e.detail) { return }
        console.log(e.detail);
    },
});
