/* global getApp, Page */
Page({
    data: {
      title: '人脸融合'
    },
    handleFinish(e) {
        if (!e.detail) { return }
        console.log(e.detail);
    },
});
