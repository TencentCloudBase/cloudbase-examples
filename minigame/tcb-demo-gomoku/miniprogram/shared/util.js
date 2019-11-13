let winWidth = 0,
  winHeight = 0

export async function getWindowRect() {
  const promise = new Promise(resolve => {
    if (winHeight || winWidth) {
      resolve({ winHeight, winWidth})
    }

    wx.getSystemInfo({
      success: function (res) {
        winHeight = res.windowHeight
        winWidth = res.windowWidth
        resolve({ winHeight, winWidth })
      },
      fail: function (err) {
        console.err(err)
      }
    })
  })
  
  return promise
}

export const getWindowRectSync = (() => {
  let winWidth = 0,
    winHeight = 0

  return () => {
    if (winHeight || winWidth) {
      return { winHeight, winWidth }
    }
    try {
      const sysInfo = wx.getSystemInfoSync()
      winWidth = sysInfo.windowWidth
      winHeight = sysInfo.windowHeight
    } catch (error) {
      console.log('获取屏幕信息失败: ', error.message)
    } finally {
      return { winHeight, winWidth }
    }
  }
})()

/**
 * 生成指定长度的由0～9数字组成的随机字符串
 * 
 * @param {Number} length 字符串长度
 * @return {String}
 */
export function genRandomNumber(length) {
  length = length || 5
  let str = ''
  for (let i = 0; i < length; ++i) {
    str += Math.floor(Math.random() * 10)
  }
  return str
}

/**
 * pollyfile: querystring.encode()
 * 
 * @param {Object} params 路由参数列表
 * @return {String}
 */
export function querystring(params) {
  let result = ''
  Reflect.ownKeys(params)
    .forEach(key => {
      result += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`
    })
  return result.slice(0, result.length - 1)
}

/**
 * pollyfill: Array.flat()
 * 
 * @param {Array} arr 高纬矩阵
 * @return {Array}
 */
export function localFlat(arr) {
  return arr.reduce((arr, val) => arr.concat(val), [])
}

/**
 * 转化棋盘形式的表现形式：数组 => 字符串
 * 
 * @param {Array} arr 棋盘矩阵
 * @return {String} 
 */
export function encodeArray(arr) {
  return localFlat(arr).join(',')
}

/**
 * 转化棋盘形式的表现形式：字符串 => 数组
 * 
 * @param {String} str 字符串化的棋盘
 * @param {Array} shape 棋盘形状
 * @return {Array}
 */
export function decodeArray(str, shape) {
  const arr = str.split(',')
    .map(item => parseInt(item, 10))

  const [row, col] = shape
  const result = new Array(row)
  for (let i = 0; i < row; ++i) {
    result[i] = new Array(col)
    for (let j = 0; j < col; ++j) {
      result[i][j] = arr.shift()
    }
  }

  return result
}

/**
 * 比较棋盘的不同落子，返回坐标
 * 
 * @param {Array} arr1 棋盘矩阵
 * @param {Array} arr2 棋盘矩阵
 * @param {Array} shape 棋盘形状
 * @param {Array} 
 */
export function diffArray(arr1, arr2, shape) {
  const [row, col] = shape
  for (let i = 0; i < row; ++i) {
    for (let j = 0; j < col; ++j) {
      if (arr1[i][j] !== arr2[i][j]) {
        return [i, j]
      }
    }
  }
  return [-1, -1]
}

/**
 * 判断新棋盘相较于旧棋盘，是否有更新
 * 
 * @param {Array} older 旧棋盘矩阵
 * @param {Array} newer 新棋盘矩阵
 * @param {Array} shape 棋盘形状
 * @return {Boolean}
 */
export function isNewerArray(older, newer, shape) {
  const [row, col] = shape
  let newerNum = 0, olderNum = 0
  for (let i = 0; i < row; ++i) {
    for (let j = 0; j < col; ++j) {
      if (newer[i][j] === -1 || newer[i][j] === 1) {
        ++newerNum
      }
      if (older[i][j] === -1 || older[i][j] === 1) {
        ++olderNum
      }
    }
  }
  return newerNum > olderNum
}

/**
 * AsyncFunction中进行睡眠
 * 
 * @param {Number} ms 睡眠时间
 */
export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}