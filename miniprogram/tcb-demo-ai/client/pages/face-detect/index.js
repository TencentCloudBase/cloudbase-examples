/* global getApp, Page */
Page({
    data: {
      title: '人脸检测与分析'
    },
    handleFinish(e) {
        if (!e.detail) { return }
        console.log(e.detail);
    },
});
