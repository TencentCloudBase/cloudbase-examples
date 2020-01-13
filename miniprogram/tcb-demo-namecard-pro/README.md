# 【智能名片识别小程序】微信公开课Pro 小程序云开发项目实战

## 项目介绍

此处为项目完整代码，可以直接进行部署使用，请根据以下步骤进行部署

- 初始化云开发环境，如果有多个云开发环境造成wx.cloud.init错误，则在app.js处进行环境定义。
- 在云开发环境中创建一个数据库，名称为list
- 开通腾讯云的名片识别接口服务，并在腾讯云账户中获取AppId、SecretId、SecretKey，填入cloudfunctions/parseNameCard/config.js
  [开通地址](https://console.cloud.tencent.com/ocr/namecard)
  [获取地址](https://console.cloud.tencent.com/cam/capi)
- 将cloudfunctions文件夹内的4个云函数创建并部署（需要注意parseNameCard有image-node-sdk引用）
- 重新编译执行，即可完整体验整个小程序功能

## 项目源码下载
- [源码下载](https://github.com/TencentCloudBase/Cloudbase-Examples/releases/download/WeChat/tcb-demo-namecard-pro.zip)

## 实战作者
- 腾讯云·云开发团队（[bestony](https://github.com/bestony)、[lidongyx](https://github.com/lidongyx)、[Zira](https://github.com/wasfzxt)）

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

