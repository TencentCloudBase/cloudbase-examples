export async function getCloudImageTempUrl(images) {
  const handledIndexToOriginIndex = new Map();
  const shouldBeHandledImages = [];
  images.forEach((x, index) => {
    if (!x.startsWith('cloud')) return;

    const handleIndex = shouldBeHandledImages.length;
    shouldBeHandledImages.push(x);
    handledIndexToOriginIndex.set(handleIndex, index);
  });

  const handledImages = (
    await wx.cloud.getTempFileURL({
      fileList: shouldBeHandledImages,
    })
  ).fileList.map((x) => x.tempFileURL);

  const ret = [...images];
  handledImages.forEach((image, handleIndex) => (ret[handledIndexToOriginIndex.get(handleIndex)] = image));

  return ret;
}

export async function getSingleCloudImageTempUrl(image) {
  if (!image.startsWith('cloud')) return image;
  return (
    await wx.cloud.getTempFileURL({
      fileList: [image],
    })
  ).fileList[0].tempFileURL;
}
