/**
 * @param  {string} src 图片的网络地址
 * @return {object} Promise对象
 */
export const getImageInfo = src => new Promise((resolve, reject) => {
    wx.getImageInfo({
        src,
        success: ({
            path,
            width,
            height
        }) => {
            resolve({
                path,
                width,
                height
            })
        },
        fail: reject
    })
})
