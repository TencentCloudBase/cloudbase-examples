# 云开发 · 头像小程序 Demo

## 简介

本项目为云开发·头像合成小程序，可以用于在小程序端生成包含不同边框的头像。

## 需求

1. 开通了小程序云开发的小程序。
2. 腾讯云账号

## 具体使用说明

### 1. Clone 本项目到本地并导入

将本项目 clone 到本地，并使用你自己的小程序账号导入项目。



### 2. 创建数据万象 Bucket

访问 [腾讯云数据万象控制台](https://console.cloud.tencent.com/ci/bucket),创建一个 Bucket

![](https://postimg.aliavv.com/mbp/d15ya.png)

![](https://postimg.aliavv.com/mbp/hq5h0.png)

创建时，选择「**新建**」，并填写名称、所属地区等信息，具体配置如下。

![](https://postimg.aliavv.com/mbp/fn3tb.png)

创建完成后，点击你刚刚创建的 Bucket，将项目根目录中 `avatar-outer` 目录的文件上传到 Bucket 。具体效果如图。

![](https://postimg.aliavv.com/mbp/5fe20.png)

### 3. 配置云函数

接下来，我们来配置云函数。在项目根目录中的`cloudfunctions/image`目录下的 `config.js` 中存放着需要配置的几个项目，具体如下

```js
module.exports = {
  COS_SECRETID: '', // COS 的 Secret ID ,从 https://console.cloud.tencent.com/capi 获取
  COS_SECRETKEY: '', //  COS 的 Secret Key， 从 https://console.cloud.tencent.com/capi 获取
  DOMAIN: '', // 数据万象的域名 ，从 Bucket 详情页面获取
  BUCKET: '', // Bucket 名称 ，你自己创建的 Bucket ，可以在 https://console.cloud.tencent.com/ci/bucket 找到
  REGION: '' // 节点名，比如 ap-shanghai 、ap-guangzhou、ap-chengdu
}
```

获取方式如下：

- **COS_SECRETID** 与 **COS_SECRETKEY** 可以在 [腾讯云访问密钥](https://console.cloud.tencent.com/cam/capi) 中获取。

- **REGION** 和 **BUCKET** 可以从你所创建的 Bucket 详情页获取。如果你所属地区是上海，则此项目填写 `ap-shanghai`

  ![](https://postimg.aliavv.com/mbp/0ivlh.png)

- **DOMAIN** 则可以从域名管理处获取。![](https://postimg.aliavv.com/mbp/lqnse.png)

### 4. 部署云函数

配置完成后， 你需要上传，并部署云函数（选择云端安装依赖）。

![](https://postimg.aliavv.com/mbp/ty7hp.png)



### 5. 效果

![](https://postimg.aliavv.com/mbp/gt6ux.gif)


### 6. FAQ

#### 6.1 如何替换风格或新增风格
做好相应的边框，上传到数据万象的根目录，以`headX.png`来命名，其中 X 为 1，2，3，4等数字。