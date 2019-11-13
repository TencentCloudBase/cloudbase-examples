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
      let { data } = await collection
        .orderBy("createdTime", "desc")
        .limit(20)
        .get();
      this.setData({
        list: data.reduce((list, { origin, output }) => {
          list.push(origin);
          list.push(output);
          return list;
        }, [])
      });
    } catch (e) {
      console.log(e);
      wx.showToast({
        title: "查询失败",
        icon: "none"
      });
    }
  }
});
