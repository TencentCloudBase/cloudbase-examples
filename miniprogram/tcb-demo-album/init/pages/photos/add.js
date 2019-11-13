// pages/photos/addPhoto.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentPhoto: false,
        albumIndex: -1,
        albums: [],
        photosOrigin: [],
        photosNew: [],
        newphotos_url:[],
        index: ''
    },

    // 获取原相册的的内容
    onLoad (options) {
        this.setData({
            albumIndex: options.id,
            photosOrigin: app.globalData.allData.albums[options.id].photos
        })
    },

    // 提交表单
    formSubmit (e) {
        wx.showLoading({ title: '加载中' })

        // 并发上传图片
        const uploadTasks = this.data.photosNew.map(item => this.uploadPhoto(item.src))
        Promise.all(uploadTasks).then(result => {
            this.addPhotos(result, e.detail.value.desc)
            wx.hideLoading()
        }).catch(() => {
            wx.hideLoading()
            wx.showToast({ title: '上传图片错误', icon: 'error' })
        })
    },

    // 选择图片
    chooseImage: function () {
        const items = this.data.photosNew

        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                let tempFilePaths = res.tempFilePaths

                for (const tempFilePath of tempFilePaths) {
                    items.push({
                        src: tempFilePath
                    })
                }

                this.setData({ photosNew: items })
            }
        })
    },

    // 上传图片
    uploadPhoto (filePath) {
        // 在此插入上传图片代码
    },

    // 预览图片
    previewImage (e) {
        const current = e.target.dataset.src
        const photos = this.data.photosNew.map(photo => photo.src)

        wx.previewImage({
            current: current.src,
            urls: photos
        })
    },

    // 删除图片
    cancel (e) {
        const index = e.currentTarget.dataset.index
        const photos = this.data.photosNew.filter((p, idx) => idx !== index)

        this.setData({
            photosNew: photos
        })
    },

    // 添加图片信息到数据库
    addPhotos (photos, comment) {
        const db = wx.cloud.database()
        // 从全局数据中读出用户信息里的照片列表
        const oldPhotos = app.globalData.allData.albums[this.data.albumIndex].photos
        const albumPhotos = photos.map(photo => ({
            fileID: photo.fileID,
            comments: comment
        }))

        // 合并老照片的数组和新照片的数组
        app.globalData.allData.albums[this.data.albumIndex].photos = [...oldPhotos, ...albumPhotos]

        // 在此插入储存图片信息代码
    }
})
