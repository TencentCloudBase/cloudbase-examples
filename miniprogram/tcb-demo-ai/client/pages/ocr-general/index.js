/* global getApp, Page */
Page({
    data: {
      title: '通用印刷体识别'
    },
    handleFinish(e) {
        if (!e.detail) { return }
        console.log(e.detail);
    },
});
