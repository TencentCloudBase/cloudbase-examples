/* global getApp, Page */
import regeneratorRuntime from "../../libs/runtime";
import { smoothX, smoothY, kernel } from "./util";

let originImageData = null;
let resultImageData = null;

Page({
  data: {
    title: "滤镜",
    desc: "图片简单滤镜处理",
    containerWidth: 600,
    containerHeight: 0,
    thumb:
      "https://10.url.cn/eth/ajNVdqHZLLBn1TC6loURIX2GB5GB36NBNZtycXDXKGARFHnJwhHD8URMvyibLIRBTJrdcONEsVHc/",
    originLoaded: false,
    pending: false
  },
  onLoad() {
    let app = getApp();
    let { windowWidth } = wx.getSystemInfoSync();
    this.setData({
      temUrl: app.globalData.temUrl,
      fileID: app.globalData.fileID,
      rect: app.globalData.rect
    });

    // // 画布容器高度，单位 rpx
    let containerHeight = Math.floor(
      (this.data.rect.imageHeight / this.data.rect.imageWidth) *
        this.data.containerWidth
    );

    // 画布宽高，单位 px
    let canvasWidthPx = Math.floor(
      (windowWidth / 750) * this.data.containerWidth
    );
    let canvasHeightPx = Math.floor((windowWidth / 750) * containerHeight);
    this.setData({ canvasWidthPx, canvasHeightPx, containerHeight });

    // 加载
    this.pending(true);
    let ctx = wx.createCanvasContext(`canvas`, this);
    ctx.drawImage(
      this.data.temUrl,
      0,
      0,
      this.data.rect.imageWidth,
      this.data.rect.imageHeight,
      0,
      0,
      canvasWidthPx,
      canvasHeightPx
    );
    ctx.draw(false, () => {
      setTimeout(() => {
        // 获取画布上的像素信息
        wx.canvasGetImageData({
          canvasId: "canvas",
          x: 0,
          y: 0,
          width: canvasWidthPx,
          height: canvasHeightPx,
          success: ({ width, height, data }) => {
            originImageData = {
              width,
              height,
              data
            };
            resultImageData = {
              width,
              height,
              data
            };
            this.setData({
              originLoaded: true
            });
          },
          fail: e => {
            console.log(e);
          },
          complete: () => {
            this.pending(false);
          }
        });
      }, 200);
    });
  },
  handleOriginTap() {
    this.pending(true);

    wx.canvasPutImageData({
      canvasId: "canvas",
      x: 0,
      y: 0,
      ...originImageData,
      success: () => {
        resultImageData = originImageData;
      },
      fail: e => {
        console.log(e);
      },
      complete: () => {
        // 绘制完成
        this.pending(false);
      }
    });
  },
  handleOldTap(res) {
    let { width, height } = originImageData;

    // 开始像素处理
    this.pending(true);
    let data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < data.length; i += 4) {
      let r = originImageData.data[i];
      let g = originImageData.data[i + 1];
      let b = originImageData.data[i + 2];
      data[i] = 0.393 * r + 0.769 * g + 0.189 * b;
      data[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
      data[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
      data[i + 3] = originImageData.data[i + 3];
    }

    // 将平滑后的人脸像素输出到画布
    wx.canvasPutImageData({
      canvasId: "canvas",
      x: 0,
      y: 0,
      width: width,
      height: height,
      data: data,
      success: data => {
        resultImageData = { width, height, data: data };
      },
      fail: e => {
        console.log(e);
      },
      complete: () => {
        // 绘制完成
        this.pending(false);
      }
    });
  },
  handleSmoothTap() {
    let { rectWidth, imageWidth } = this.data.rect;
    let { width, height } = originImageData;

    // 开始像素处理
    this.pending(true);

    let gKernel = kernel(6);
    let smoothData = new Uint8ClampedArray(width * height * 4);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let pointIndex = (x + y * width) * 4;
        let chanels = smoothX(
          pointIndex,
          gKernel,
          y * width * 4,
          ((1 + y) * width - 1) * 4,
          originImageData.data
        );
        chanels.forEach((chanel, index) => {
          smoothData[pointIndex + index] = chanel;
        });
      }
    }
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let pointIndex = (x + y * width) * 4;
        let chanels = smoothY(pointIndex, gKernel, width, smoothData);
        chanels.forEach((chanel, index) => {
          smoothData[pointIndex + index] = chanel;
        });
      }
    }

    // 将平滑后的人脸像素输出到画布
    wx.canvasPutImageData({
      canvasId: "canvas",
      x: 0,
      y: 0,
      width: width,
      height: height,
      data: smoothData,
      success: data => {
        resultImageData = { width, height, data: smoothData };
      },
      fail: e => {
        console.log(e);
      },
      complete: () => {
        // 绘制完成
        this.pending(false);
      }
    });
  },
  handleClipTap() {
    let app = getApp();
    app.globalData.filterImageInfo = {
      width: resultImageData.width,
      height: resultImageData.height
    };
    
    let { pixelRatio } = wx.getSystemInfoSync();
    wx.canvasToTempFilePath({
      canvasId: "canvas",
      width: resultImageData.width,
      height: resultImageData.height,
      destWidth: resultImageData.width * pixelRatio,
      destHeight: resultImageData.height * pixelRatio,
      success: ({ tempFilePath }) => {
        app.globalData.filterTemUrl = tempFilePath;
        console.log(tempFilePath);
        wx.navigateTo({
          url: "/pages/clip/index"
        });
      }
    });
  },
  pending(bool) {
    this.setData({ pending: !!bool });
    if (bool) {
      wx.showLoading();
    } else {
      wx.hideLoading();
    }
  }
});
