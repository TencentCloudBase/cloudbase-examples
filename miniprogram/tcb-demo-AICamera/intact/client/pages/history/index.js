/* global getApp, Page */
import regeneratorRuntime from "../../libs/runtime";

Page({
  data: {
    title: "历史记录",
    desc: "显示最近 20 次记录，原图 - 处理图像 顺序排列",
    list: []
  },
  async onLoad() {
    let db = wx.cloud.database();
    let collection = db.collection("pictures");
    if (!collection) {
      return;
    }
    try {
      // 查找 20 条数据并根据创建时间倒序排列，将所有的原始图片、处理图片的 fileID 存在 list 中
      // do something
      
    } catch (e) {
      console.log(e);
      wx.showToast({
        title: "查询失败",
        icon: "none"
      });
    }
  }
});
