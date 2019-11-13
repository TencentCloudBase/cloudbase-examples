import config from './config.js'

let loaded = false

if (!loaded) {
  wx.cloud.init({
    env: config.env
  })
  loaded = true
}

export const db = wx.cloud.database()

export const $ = db.command.aggregate

export function getTempFileURL(fileList) {
  if (!Array.isArray(fileList)) {
    fileList = [fileList]
  }

  const promise = new Promise((resolve) => {
    wx.cloud.getTempFileURL({
      fileList,
      success: res => {
        const { fileList } = res
        if (Array.isArray(fileList) && fileList.length) {
          resolve(fileList[0].tempFileURL)
        } else {
          resolve()
        }
      },
      fail: error => {
        console.error(error)
        resolve()
      }
    })
  })

  return promise
}