<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="https://qcloudimg.tencent-cloud.cn/raw/f97dc74fbf9af5d7b2b3d8bc0a4e91d4.png" alt="Logo" width="180">

  <h1 align="center">云开发电商模板</h1>

  <p align="center">
  一键创建零售商城
    <br />
  </p>
</div>

## 说明

云开发电商模板提供了一键创建零售商城小程序的能力。

## 快速上手

1. 安装本模版
2. 导入云开发电商模板小程序

![](https://qcloudimg.tencent-cloud.cn/raw/5f1962e709c28af3252c0acb583e989b.png)

3. 填入开通了云开发环境的小程序的 appId

![](https://qcloudimg.tencent-cloud.cn/raw/800f05945779cb940ef6851d96419f6e.png)

4. 在 `app.js` 中，填入云开发环境 id

![](https://qcloudimg.tencent-cloud.cn/raw/1da510c60d9d552119ed7aa79c7a6826.png)

5. 前往[小程序微信支付模版](https://tcb.cloud.tencent.com/cloud-admin#/cloud-template/detail?appName=wx-pay-v2&solutionId=solution-1sbaF7cyIqcgRj&appType=basic)，填入该模版所需参数

![]( https://qcloudimg.tencent-cloud.cn/raw/9a11a564b8985883194f19cdd11c3f2b.png)

6. 安装依赖
  6.1 在命令行执行 `npm install`
  6.2 点击菜单栏中的「工具 -> 构建 npm」
  6.3. 详情可参考[npm 支持 | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html#%E4%BD%BF%E7%94%A8-npm-%E5%8C%85)
7. 编译启动小程序，开始体验
8. 正式发布前，移除云开发引导弹窗
  8.1 删除 `components/cloud-template-dialog/` 文件夹
  
  ![]( https://qcloudimg.tencent-cloud.cn/raw/fcc15824e38fbfacc1afee040c648099.png)
  
  8.2 删除 `pages/home/home.wxml` 中对云开发引导弹窗的引用
  
  ![]( https://qcloudimg.tencent-cloud.cn/raw/cb2a20e0f840eaee236a964fac734f28.png)
  
  8.3 删除 `pages/home/home.json` 中对云开发引导弹窗的引用
  
  ![](https://qcloudimg.tencent-cloud.cn/raw/7c0c32bbb494bc3b0877891d302c096c.png)

## 页面介绍

### 首页

![](https://qcloudimg.tencent-cloud.cn/raw/89cf8dedbd3edfdbda31920447bddd51.png)

首页由三部分组成：

● 搜索栏

● 轮播图

● 商品列表

#### 搜索栏

点击搜索栏，可以输入搜索商品，并展示搜索到的商品列表：

![](https://qcloudimg.tencent-cloud.cn/raw/94e2ee9666aed0f8147affa180c879c7.png)

#### 轮播图

轮播图可循环展示配置好的图片。

![](https://qcloudimg.tencent-cloud.cn/raw/b42bc12d0fa4fe350b83154ace0a613c.png)

#### 商品列表

首页商品列表会列出所有的商品，点击单个商品后，会跳转至对应的商品详情页。

首页商品列表：

![](https://qcloudimg.tencent-cloud.cn/raw/98fca5271899639e1393753e52523fce.png)

点击商品后跳转商品详情页：

![](https://qcloudimg.tencent-cloud.cn/raw/54c50176b1af344b23fb61e22e611265.png)

### 分类页

分类页会以侧边栏展示商品的一级分类，主内容展示商品的二级分类。

![](https://qcloudimg.tencent-cloud.cn/raw/1ff658bb467a4e8febf34be13ecf80da.png)

点击二级分类后，会展示当前分类下的商品列表。同样，在此商品列表点击商品后，会跳转至对应商品详情页。

水果分类下的商品列表：

![](https://qcloudimg.tencent-cloud.cn/raw/927b12f16467f1def96e877c50b1a7e8.png)


### 商品详情页

![](https://qcloudimg.tencent-cloud.cn/raw/ef651d54d5e57d2aacaa50bc283ccfb5.png)

商品详情页由多个部分组成：

● 商品轮播图

● 商品信息

● 规格选择栏

● 评价预览

● 商品详情

● 底部动作栏

#### 商品轮播图

商品轮播图可循环展示该商品的多个图片：

![](https://qcloudimg.tencent-cloud.cn/raw/5b59639efcc112ce592b72f6cd77fcb8.png)

#### 商品信息

商品信息会展示商品的名称与最低价格：

![](https://qcloudimg.tencent-cloud.cn/raw/5d23000c19ccb652ce9eab0afd1fd2e7.png)

#### 规格选择栏

点击规格选择栏后，可在跳出的弹窗中选择商品对应的规格，并选择购买数量。确定商品规格和购买数量后，可加入购物车或选择立即购买：

![](https://qcloudimg.tencent-cloud.cn/raw/f7aecbc84c8d691a8e6c97070b4af71b.png)

#### 评价预览

当商品存在评价时，会展示评价预览，包括评论数、好评率，以及一条评价：

![](https://qcloudimg.tencent-cloud.cn/raw/dd5e089f0be8b10dd900d65566bb2778.png)

#### 商品详情

商品详情用于展示商品的详细信息，这部分的内容以富文本的形式呈现：

![](https://qcloudimg.tencent-cloud.cn/raw/81271f5c219fb5c475493af8e8751d99.png)

#### 底部动作栏

底部动作栏提供了四个按钮，包括首页和购物车页的跳转按钮，点击后会跳转至相应页面；还有加入购物车与立即购买按钮，点击后能唤出规格选择弹窗，选择完商品后就能够执行对应的操作：

底部动作栏：

![](https://qcloudimg.tencent-cloud.cn/raw/862684258b666755e5ea1dae45bdecfe.png)

点击后唤出规格选择弹窗：

![](https://qcloudimg.tencent-cloud.cn/raw/de44ca5df5e297415d1863eb6cac7c1e.png)

### 购物车页

![](https://qcloudimg.tencent-cloud.cn/raw/eec6aa7cbdf1aefae293a68e867f8501.png)

购物车页可以查看购物车项。对于每个购物车项，可以进行删除、修改数量的操作。选中购物车项后，可以点击「去结算」按钮前往订单确认页进行订单创建并购买。

左滑购物车项进行删除：

![](https://qcloudimg.tencent-cloud.cn/raw/21311abac70b47bc352734e4e6da0485.png)

选中购物车项后可进行结算：

![](https://qcloudimg.tencent-cloud.cn/raw/a2af456542cd7afae411cffaaac9d501.png)

点击「去结算」按钮后跳转至订单确认页：

![](https://qcloudimg.tencent-cloud.cn/raw/c5e01f1c2cb4ef6eae6bd0fce0574a95.png)

### 订单确认页

![](https://qcloudimg.tencent-cloud.cn/raw/8789c377b15e0a222475b5253cd45c0a.png)

订单确认页提供以下功能：

● 地址选择栏

● 订单信息展示

● 提交订单并支付

#### 地址选择栏

地址选择栏展示当前订单的配送地址。如果未选择地址，将无法提交订单。点击地址选择栏后可跳转至地址列表，对地址进行增加、删除、修改和选择的操作。选择完地址后，会返回至此页，届时可继续进行订单提交。

地址选择栏：

![](https://qcloudimg.tencent-cloud.cn/raw/febf20b5ae98eacd2b69a93ecbba684e.png)

地址列表：

![](https://qcloudimg.tencent-cloud.cn/raw/c4d74f2749a9029c7a731071165fdd9f.png)

选择完地址后，跳回订单确认页：

![](https://qcloudimg.tencent-cloud.cn/raw/4faedcef881787e25926e69f50ec18cd.png)

#### 订单信息展示

在订单确认页会展示当前创建的订单的详细内容，包括订单项、总价等信息。

![](https://qcloudimg.tencent-cloud.cn/raw/268fe7c66225fe45d8ace3fd933e6b31.png)

#### 提交订单并支付

在选择完地址后，点击提交订单，即可创建订单，并弹出支付弹窗。若支付流程失败，可在订单列表中查询到待支付的订单，重新支付。

![](https://qcloudimg.tencent-cloud.cn/raw/e81466d3fe35a15a1add1467e3b9114a.png)

### 用户中心页

用户中心页展示用户信息、订单列表和地址列表。

![](https://qcloudimg.tencent-cloud.cn/raw/f7e8527c81b88c69bb800f3afbaa9e62.png)

## 数据模型

云开发电商模板附带了一系列的数据模型。对于数据模型的能力说明，请查看[云开发数据模型](https://docs.cloudbase.net/model/introduce)。

本模版附带的数据模型有：

|名称|标识|描述|
|---|---|---|
|电商SPU|shop_spu|一件商品，对应电商概念中的 SPU，即 Standard Product Unit。|
|电商SPU分类|shop_spu_cate|商品分类，每个商品分类都可以有自己的子分类、父分类和对应的商品。|
|电商SPU属性名|shop_attr_name|商品的属性名，如数量。|
|电商SPU属性值|shop_attr_value|商品的属性值，如数量对应的值可能为「1 件」、「10 件」。|
|电商SPU评价|shop_comment|用户对商品做出的评价。|
|电商SKU|shop_sku|一件有具体属性的商品销售单位。每个 SPU 都可以对应多个 SKU。举例来说，A 品牌的平板电脑为 SPU，其对应的 SKU 为 A 品牌的 16GB 内存、白色的平板电脑。|
|电商购物车项|shop_cart_item||
|电商订单|shop_order||
|电商订单项|shop_order_item||
|电商收货信息|shop_delivery_info||
|电商首页轮播图|shop_home_swiper_image||

## 应用配置说明

### 配置商品

#### 配置SPU

在「电商SPU」数据模型中，填入 SPU 数据。这里我们添加一行「荔枝」的 SPU 数据：

![](https://qcloudimg.tencent-cloud.cn/raw/adda72dbcf9f96d41236c128cb11522e.png)

#### 配置SKU

添加完 SPU 后，我们还需要为其添加 SKU 数据。SKU 可以理解为具有具体规格/属性的 SPU，比如荔枝的属性可以有数量、大小等等。不同数量、不同大小的荔枝会有不同的价格、不同的库存。

首先，我们为荔枝配置属性选项。

在「电商SPU属性名」数据模型中，我们添加一行「大小」属性：

![](https://qcloudimg.tencent-cloud.cn/raw/dd45aedca3c2235dce20c749faf6a890.png)

添加完属性名后，我们还需要为此属性名配置属性值。

我们在「电商SPU属性值」配置两个属性值，分别是大、小：

![](https://qcloudimg.tencent-cloud.cn/raw/e42f566f0622d4825da0d56acc085e25.png)

![](https://qcloudimg.tencent-cloud.cn/raw/5a7b0b51e9062366f5412ef851b2d606.png)

至此，我们配置好了「大小」这个属性名，这个属性名下有两个可选的属性值，分别为「大」和「小」。

现在，我们可以为「荔枝」SPU 添加 SKU 了，分别是「大荔枝」和「小荔枝」，他们的价格户不相同：

![](https://qcloudimg.tencent-cloud.cn/raw/a829aae86242a37c5130a0d1e0568d8d.png)

![](https://qcloudimg.tencent-cloud.cn/raw/a5a6975a715e92f3abf9296cc53a279b.png)

#### 配置商品分类

每个 SPU 可以有多个分类，分类下也可以有子分类。现在我们来为荔枝添加二级分类，分别是「美食」->「水果」。

我们在「电商SPU分类」数据模型中添加「美食」分类：

![](https://qcloudimg.tencent-cloud.cn/raw/b511ddf9b3069097f5c95f19779392f4.png)

然后再添加「水果」分类，添加时把父分类选为「美食」，并在 SPU 中添加「荔枝」：

![](https://qcloudimg.tencent-cloud.cn/raw/2a3c6522f9af616740e57a7db80ef94f.png)

### 配置首页轮播图

首页轮播图会展示「电商首页轮播图」数据模型的第一行数据中的图片：

![](https://qcloudimg.tencent-cloud.cn/raw/73b6b4c119ea526506f683a4cf1f8c13.png)
