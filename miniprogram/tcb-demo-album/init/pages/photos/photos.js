// pages/photos/photos.js
const regeneratorRuntime = require('../common/regenerator-runtime.js')
const app= getApp()

Page({

    // 相册 ID
    albumId: undefined,

    // 页面的初始数据
    data: {
        albumIndex: '',
        photos: [],
        photoIds: []
    },

    onLoad (options) {
        // 因为 this.setState 是异步的
        // 如果吧 albumid 存在 data 中
        // 可能会出现 onShow 取不到的情况
        this.albumId = options.id
    },

    onShow () {
        this.getPhotos()
    },

    // 长按事件
    longpress (e) {
        const imgIndex = e.currentTarget.dataset.index

        // 展示操作菜单
        wx.showActionSheet({
            itemList: ['删除照片'],
            success: res => {
                if (res.tapIndex === 0) {
                    this.deleteFile(imgIndex)
                }
            }
        })
    },

    // 删除照片
    async deleteFile (idx) {
        const fileId = this.data.photoIds[idx]

        // 此处插入删除文件代码
    },

    async saveImageDelele (fileId) {
        const photos = app.globalData.allData.albums[this.albumId].photos
        const newFileIds = this.data.photoIds.filter(id => id !== fileId)
        const newPhotos = photos.filter(photo => !!~newFileIds.indexOf(photo.fileID))

        app.globalData.allData.albums[this.albumId].photos = newPhotos

        // 获取数据库实例例
        const db = wx.cloud.database({})
        // 写⼊入集合
        db.collection('user').doc(app.globalData.id).update({
            data: {
                albums: db.command.set(app.globalData.allData.albums)
            }
        }).then(result => {
            console.log('写⼊入成功', result)
            wx.navigateBack()
        })
    },

    // 获取相册中的数据
    async getPhotos () {
        // 初始化数据库
        const db = wx.cloud.database({})

        // 从数据库取出用户信息
        // 用户信息中有相册信息
        const userinfo = await db.collection('user').doc(app.globalData.id).get()
        const albums = userinfo.data.albums
        const photos = albums[this.albumId].photos

        // 设置全局变量
        app.globalData.allData.albums[this.albumId].photos = photos

        // 获取照片列表
        const fileList = photos.map(photo => photo.fileID)

        // 根据照片列表拉取照片的实际地址
        const photoIds = []
        const realUrlsRes = await wx.cloud.getTempFileURL({ fileList })
        const realUrls = realUrlsRes.fileList.map(file => {
            photoIds.push(file.fileID)
            return file.tempFileURL
        })

        this.setData({
            albumIndex: this.albumId,
            photos: realUrls,
            photoIds
        })
    },

    // 预览图片
    async previewImage (e) {
        // 获取被点击的图片的 index
        const currentIndex = e.currentTarget.dataset.index

        // 获取当前被点击的图片的实际地址
        const currentUrl = this.data.photos[currentIndex]

        wx.previewImage({
            current: currentUrl,
            urls: this.data.photos
        })
    }
})
