//获取应用实例
const app = getApp();
const mapping = require('../common/mapping.js');

Page({
  data: {
    fileID: null,
    coverImage: '',
    formData: []
  },

  /**
   * 上传文件
   */
  uploadFile() {
    
  },

  /**
   * 获取图片链接
   */
  getTempFileURL() {
    
  },

  /**
   * 调用接口解析名片
   */
  parseNameCard() {
    
  },

  /**
   * 将获取的名片数据进行处理
   * @param {Object} data
   */
  transformMapping(data) {
    let record = {};
    let returnData = [];

    data.map((item) => {
      let name = null;
      if (mapping.hasOwnProperty(item.item)) {
        name = mapping[item.item];
        // 写入英文名
        item.name = name;
      }

      return item;
    });

    // 过滤重复的字段
    data.forEach((item) => {
      if (!record.hasOwnProperty(item.item)) {
        returnData.push(item);
        record[item.item] = true;
      }
    });

    return returnData;
  },

  /**
   * 上传名片
   */
  addNameCard(e) {
    
  }
})
