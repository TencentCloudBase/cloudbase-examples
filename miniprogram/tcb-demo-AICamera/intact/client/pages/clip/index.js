/* global getApp, Page */
import { uploadImage } from "../../utils/index";
import regeneratorRuntime from "../../libs/runtime";
Page({
  data: {
    title: "智能裁剪",
    desc: "处理完的图像可裁剪多种分辨率",
    clipSizes: [[320, 240]],
    thumb:
      "https://10.url.cn/eth/ajNVdqHZLLBn1TC6loURIX2GB5GB36NBNZtycXDXKGARFHnJwhHD8URMvyibLIRBTJrdcONEsVHc/"
  },
  onLoad() {
    let app = getApp();
    let sysInfo = wx.getSystemInfoSync();
    this.setData({
      sysInfo,
      fileID: app.globalData.fileID,
      rect: app.globalData.rect,
      temUrl: app.globalData.temUrl,
      filterTemUrl: app.globalData.filterTemUrl
    });
    let filterTemUrl = this.data.filterTemUrl;
    wx.getImageInfo({
      src: filterTemUrl,
      success: ({ width, height }) => {
        this.setData(
          {
            filterImageInfo: {
              width,
              height
            }
          },
          () => {
            this.drawFilterOrigin(filterTemUrl, width, height);
            this.clip(filterTemUrl, {
              ...this.data.rect,
              imageWidth: width,
              imageHeight: height
            });
          }
        );
      },
      fail: e => console.log(e)
    });
  },
  handleFinish(e) {
    if (!e.detail) {
      return;
    }
    console.log(e.detail);
  },
  drawFilterOrigin(url, width, height) {
    let ctx = wx.createCanvasContext(`filter`, this);
    ctx.drawImage(
      url,
      0,
      0,
      width,
      height,
      0,
      0,
      width / this.data.sysInfo.pixelRatio,
      height / this.data.sysInfo.pixelRatio
    );
    ctx.draw();
  },
  clip(url, { imageWidth, imageHeight, rectX, rectWidth, rectY, rectHeight }) {
    let minWidth = Math.max(
      ...this.data.clipSizes.map(([width, height]) => {
        return width;
      })
    );
    let minHeight = Math.max(
      ...this.data.clipSizes.map(([width, height]) => {
        return height;
      })
    );
    if (imageWidth < minWidth || imageWidth < minHeight) {
      wx.showToast({
        title: `请选择 宽度 >= ${minWidth}px，高度 >= ${minHeight}px 的图片`,
        icon: "none"
      });
      return;
    }

    this.data.clipSizes.forEach(([clipWidth, clipHeight]) => {
      let middleWidth = rectX + rectWidth / 2;
      let middleHeight = rectY + rectHeight / 2;
      let clipAspectRatio = clipWidth / clipHeight;
      let imageAspectRatio = imageWidth / imageHeight;
      let top = 0,
        left = 0;
      let right = 1,
        bottom = 1;
      if (imageAspectRatio < clipAspectRatio) {
        // 宽边对齐，上下移动
        let halfHeight = imageAspectRatio / clipAspectRatio / 2;
        top = middleHeight - halfHeight;
        bottom = middleHeight + halfHeight;
        if (top < 0) {
          bottom = halfHeight * 2;
          top = 0;
        } else if (bottom > 1) {
          top = 1 - halfHeight * 2;
          bottom = 1;
        }
      } else {
        // 高边对齐，左右移动
        // do something
      }

      this.setData({
        clipPxData: {
          x: Math.floor(left * imageWidth),
          y: Math.floor(top * imageHeight),
          width: Math.floor((right - left) * imageWidth),
          height: Math.floor((bottom - top) * imageHeight)
        }
      });

      let context = wx.createCanvasContext(`canvas-${clipAspectRatio}`);
      // drawImage 绘制图像到 canvas 作展示
      // do something
      
    });
  },
  async handleSaveTap() {
    let {
      clipPxData,
      sysInfo: { pixelRatio }
    } = this.data;
    try {
      wx.showLoading({
        title: "保存中"
      });

      let tempFilePath = await new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          canvasId: "filter",
          x: clipPxData.x / pixelRatio,
          y: clipPxData.y / pixelRatio,
          width: clipPxData.width / pixelRatio,
          height: clipPxData.height / pixelRatio,
          destWidth: clipPxData.width,
          destHeight: clipPxData.height,
          success: ({ tempFilePath }) => {
            console.log(tempFilePath);
            resolve(tempFilePath);
          }
        });
      });

      // 将生成的文件上传到云端，在 db 里存下处理前后 fileID，记录下时间戳
      // do something

      wx.hideLoading();
      wx.showToast({
        title: "保存成功",
        icon: "none"
      });
    } catch (e) {
      console.log(e);
      wx.hideLoading();
      wx.showToast({
        title: "保存失败",
        icon: "none"
      });
    }
  }
});
