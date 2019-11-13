const regeneratorRuntime = require('../common/regenerator-runtime.js')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue: ''
    },

    keyInput (e) {
        this.setData({ inputValue: e.detail.value })
    },

    /**
     * 新建相册
     */
    async formSubmit (e) {
        let albName = this.data.inputValue

        //初始化数据库
        const db = wx.cloud.database({})

        app.globalData.allData.albums.push({ albumName: albName, photos: [] })

        let result = await db.collection('user').doc(app.globalData.id).update({
            data: { albums: db.command.set(app.globalData.allData.albums) }
        })

        wx.navigateBack({ url: "/pages/index/index" })
    }
})
