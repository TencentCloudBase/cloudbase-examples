export function uploadImage(fileName) {
  return new Promise((resolve, reject) => {
    const dotPosition = fileName.lastIndexOf(".");
    const extension = fileName.slice(dotPosition);
    const cloudPath = `${Date.now()}-${Math.floor(
      Math.random(0, 1) * 10000
    )}${extension}`;

    // 上传文件到云端， 成功回调 resolve， 失败 reject
    // do something
   
  });
}
