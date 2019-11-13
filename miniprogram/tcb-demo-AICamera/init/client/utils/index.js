export function uploadImage(fileName) {
  return new Promise((resolve, reject) => {
    const dotPosition = fileName.lastIndexOf(".");
    const extension = fileName.slice(dotPosition);
    const cloudPath = `${Date.now()}-${Math.floor(
      Math.random(0, 1) * 10000
    )}${extension}`;
    wx.cloud.uploadFile({
      cloudPath,
      filePath: fileName,
      success: res => {
        resolve(res);
      },
      fail: () => {
        wx.hideLoading();
        reject();
      }
    });
  });
}
