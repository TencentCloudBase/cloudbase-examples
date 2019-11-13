export function kernel(sigma) {
  let radius = Math.ceil(sigma * 3) * 2;
  let a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
  let b = -1 / (2 * sigma * sigma);
  let kernel = [];
  let sum = 0;
  //生成高斯矩阵
  for (let i = 0, x = -radius; x <= radius; x++, i++) {
    let g = a * Math.exp(b * x * x);
    kernel[i] = g;
    sum += g;
  }
  //归一化, 保证高斯矩阵的值在[0,1]之间
  for (let i = 0, len = kernel.length; i < len; i++) {
    kernel[i] /= sum;
  }
  return kernel;
}

/**
 *
 * @param {Number} pointIndex
 * @param {*} kernel
 * @param {Number} start 行起始像素 r通道 index
 * @param {Number} end 当前行截至像素 r通道 index
 * @param {*} data
 */
export function smoothX(pointIndex, kernel, start, end, data) {
  let radius = kernel.length >> 1;
  let channels = [0, 0, 0, 0];
  let weight = 0;

  for (let index = 0; index < kernel.length; index++) {
    let cur = pointIndex - (radius - index) * channels.length;
    if (cur < start) {
      continue;
    } else if (cur > end) {
      break;
    } else {
      channels.forEach((channel, channelIndex) => {
        channels[channelIndex] += data[cur + channelIndex] * kernel[index];
      });
      weight += kernel[index];
    }
  }
  return channels.map(channel => {
    return channel / weight;
  });
}

export function smoothY(pointIndex, kernel, width, data) {
  let totalLength = data.length;
  let radius = kernel.length >> 1;
  let channels = [0, 0, 0, 0];
  let weight = 0;
  for (let index = 0; index < kernel.length; index++) {
    let cur = pointIndex - (radius - index) * width * channels.length;
    if (cur < 0) {
      continue;
    } else if (cur > totalLength) {
      break;
    } else {
      channels.forEach((channel, channelIndex) => {
        channels[channelIndex] += data[cur + channelIndex] * kernel[index];
      });
      weight += kernel[index];
    }
  }
  return channels.map(channel => {
    return channel / weight;
  });
}
