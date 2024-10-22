# 0 基础 1 天实现 scrm 客户管理

## 需求调研

预期功能界面如下:

<img src="./preview.png" style="width:32%" />
<img src="./preview1.png" style="width:32%" />
<img src="./preview2.png" style="width:32%" />
<img src="./preview3.png" style="width:32%" />
<img src="./preview4.png" style="width:32%" />

客户管理系统主要是对客户信息进行管理及分析，该系统应支持以下核心功能:

01. 客户信息管理：添加、编辑、删除和查询客户信息
02. 客户状态跟踪：记录与客户的所有交互，包括电话、邮件、会议等
03. 客户统计与分析：图表展示客户信息
04. 批量客户转移：批量转移客户到其他员工归属下
05. 动态添加标签：快速添加标签进行分类
06. 黑名单：添加到黑名单
07. 公海客户展示：展示暂未分配的公共客户
08. 权限管理：不同级别的用户访问不同级别的数据和功能

## 需求分析

结合上述需求调研，我们进行架构设计以及技术选型

### 数据架构

需要如下两张数据表，分别存储客户信息以及状态更新记录数据

#### 客户信息表

| 字段       | 编码  | 类型         | 备注                                               |
| ---------- | ----- | ------------ | -------------------------------------------------- |
| 名称       | mc    | 文本         | -                                                  |
| 性别       | xb    | 枚举         | 男/女                                              |
| 电话       | dh    | 文本（电话） | -                                                  |
| 邮箱       | yx    | 文本（邮箱） | -                                                  |
| 客户阶段   | khjd  | 枚举         | 新用户/初步沟通/意向客户/无意向客户                |
| 添加渠道   | tjqd  | 枚举         | app/微信小程序                                     |
| 所属员工   | ssyg  | 文本         | -                                                  |
| 标签       | bq    | 文本         | -                                                  |
| 状态       | zt    | 枚举         | 正常（近期联系）/灰度（长久没联系）/流失（已删除） |
| 客户类型   | khlx  | 枚举         | 个人/公司                                          |
| 备注       | bz    | 文本         | -                                                  |
| 企业名称   | qymc  | 文本         | -                                                  |
| 企业地址   | qydz  | 文本         | -                                                  |
| 是否拉黑   | sflh  | 布尔         | 是/否                                              |
| 拉黑时间   | lhsj  | 日期时间     | -                                                  |
| 拉黑原因   | lhyy  | 文本         | -                                                  |
| 拉黑操作人 | lhczr | 文本         | -                                                  |

#### 客户跟踪记录表

| 字段     | 编码 | 类型 | 备注                    |
| -------- | ---- | ---- | ----------------------- |
| 客户 ID  | khId | 文本 | -                       |
| 行为     | xw   | 文本 | 添加黑名单/移出黑名单等 |
| 具体描述 | jtms | 文本 | -                       |

### 前端架构

可以将客户信息管理、客户状态跟踪、批量客户转移、客户添加标签等功能应放在同一个模块进行操作

因此前端分为如下 4 个模块:

01. 客户列表  
   列表展示客户信息，过滤条件为 `是否拉黑: false` ， `所属员工: 不为空` .  
   支持对客户 新增、编辑、查看、删除、转移、添加标签、拉黑、导入、导出

02. 客户统计  
   图表展示 客户总数、今日新增客户数、公海客户数、黑名单数、客户总数趋势、新增客户数趋势、客户状态分布、客户阶段分布等信息
03. 黑名单  
   列表展示已拉黑客户信息，过滤条件为 `是否拉黑: true` .  
   支持对客户 查看、编辑、移出、删除、导入、导出 

04. 公海池  
    列表展示未分配员工的客户信息，过滤条件为 `是否拉黑: false` ， `所属员工: 空` .  
    支持对客户 查看、领取、转移、删除、导入、导出

### 技术选型

客户管理场景比较多变，没有办法进行统一，针对每位使用方均会有对应的定制开发场景

因此这里选择使用 `微搭低代码平台` 快速搭建该系统

微搭是一个云开发的高性能低代码开发平台，支持快速创建数据源以及应用场景，而且内置链接腾讯 SaaS 生态，能快速对接微信生态、企业微信能力，并支持接入 AI 大模型，将产品与 AI 完美结合

[微搭产品优势](https://cloud.tencent.com/document/product/1301/48875)

![](./preview5.png)

## 需求开发

下方介绍使用微搭进行开发流程

### 进入微搭

微搭分为公有云和私有云版本

**公有云:** 通过微搭官方平台进行搭建页面, 打包后在本地部署

**私有云:** 在本地服务器搭建微搭平台进行开发并发布(功能相比公有云有缺失)

下方介绍两个版本进入方式

#### 公有云开发

进入 [微搭官网](https://cloud.tencent.com/product/weda), 点击免费试用

![](./preview6.png)

登录后进入微搭控制台，在主页点击 从空白创建 即可进入编辑器开发页面，这里可以查看 [编辑器介绍](https://cloud.tencent.com/document/product/1301/53204)

![](./preview7.png)

#### 私有云开发

安装部署文档: [本地部署管理系统开发工具](https://doc.weixin.qq.com/doc/w3_AFcA-QZ_ACcdNX1gIYJQjisvI6Rq7?scode=AJEAIQdfAAo9a3LCgbAJEAkgb7ACc)

### 数据源开发

微搭中将所有数据集合命名为数据源，其中分为了数据模型、APIs(私有云暂只支持http、postman、openapi)、数据连接器，具体使用参考这里 [数据源概述](https://cloud.tencent.com/document/product/1301/68507)

这里我们使用微搭的数据模型进行开发 [数据模型概述](https://cloud.tencent.com/document/product/1301/68441)

  
**公有云**

点击编辑器左侧数据源标签，即可进入数据源编辑页面

![](./preview8.png)

**私有云**

点击云数据库进入数据模型新增页面

![](./preview9.png)

点击新建数据模型，名称填写为客户信息，标识为数据模型唯一标识，会自动生成，这里不做调整

![](./preview10.png)

点击 **创建** 按钮，成功后进入模型配置页面，点击编辑，添加字段，按照上述数据架构录入所有字段信息

![](./preview11.png)

其中枚举类型字段需要关联数据集，这里点击立即创建

![](./preview12.png)

然后录入对应字典数据，这里以客户类型举例，点击立即创建，输入名称为 **scrm-客户类型**，我们默认使用1/2 选项标识，分别对应个人/企业。点击确定后即可绑定该选项集到客户类型字段上

![](./preview13.png)

同理创建 **客户跟踪记录表**

![](./preview14.png)

### 页面开发

回到页面设计页签，这里我们确认有4个页面模块的开发，因此我们先新建四个空页面

01. 点击新建页面按钮

![](./preview15.png)

02. 选择表格与表单页模板，数据模型选择刚创建的客户管理，页面布局暂时选择左侧布局

![](./preview16.png)

03. 点击新建后 `微搭` 会自动帮我们创建三个页面，其中页面布局和页面主体是分开配置的，这里我们先配置出所有页面入口

![](./preview17.png)

04. 这里我们克隆客户列表两次，将克隆出的页面分别命名为黑名单、公海池

![](./preview18.png)

并将编辑客户信息、客户信息详情等二级页面分到一个组里，方便后续维护

![](./preview19.png)

05. 所有页面入口创建完毕后，我们进行页面布局的配置，点击头部切换到布局设计，选择左侧布局，点击根据页面一键生成按钮，则帮我们生成好了和上述页面管理目录结构一致的目录树

![](./preview20.png)

06. 因为详情页面不能直接展示在目录上，因此删除客户详情管理目录，ctrl+s保存，点击头部切换到页面设计，即可看到左侧目录数也更新了

![](./preview21.png)

下面进行单个模块开发

#### 客户管理

**效果如图:**

![](./preview22.png)

点击编辑器中的列表，在右侧配置中调整如下

01. 过滤条件为 `是否拉黑: false`，`所属员工: 不为空`

![](./preview23.png)

02. 排序字段选择 `更新时间`、`倒序`

![](./preview24.png)

03. 筛选器选择名称、电话、状态、标签等字段

![](./preview25.png)

04. 列排序为如图顺序

![](./preview26.png)

05. 全局按钮包含**新增、批量转移客户、批量拉黑、批量删除、导出、导入**

   其中**新增、删除、导出、导入**为默认内置的功能按钮，这里我们修改下名称即可

   选择左侧大纲树中的全局按钮，点击右侧**添加/组件**中的按钮即可添加，添加**批量转移客户、批量拉黑按钮**

![](./preview27.png)

06. 操作按钮包含 **查看、编辑、拉黑、删除**

其中**查看、编辑、删除**按钮为默认内置的操作按钮

同添加全局按钮一样，选择左侧大纲树中的操作按钮，添加拉黑按钮，并调整位置到第三位

![](./preview28.png)

07. 客户管理页面初步搭建完成，现在可以点击右上角播放按钮进行预览

![](./preview29.png)

点击新建，我们填写好信息点击保存

![](./preview30.png)

返回到列表中可以看到已经新增了一条数据

![](./preview31.png)

点击编辑也可正常回显，编辑数据后保存也可正常更新数据  
下面我们开始完善转移客户、拉黑、自定义列展示功能

##### 批量转移

点击**批量转移**时需要选择新的所属员工进行更新当前条数据  
因此用弹窗进行**所属员工**选择，确认后修改当前项数据**所属员工**信息，我们的逻辑线为：

![](./preview32.png)

**操作步骤：**

01. 新增弹窗组件，用来存放选择所属员工

![](./preview40.png)

02. 点击批量转移按钮事件中的点击事件，选择逻辑分支

![](./preview33.png)

03. 判断条件选择表达式，填入下方表达式

```js
If(!!$w.table1.selectedRecords.length, true, false)
```

![](./preview34.png)

04. 满足条件时，选择打开弹窗组件

![](./preview35.png)

05. 选择刚新增的弹窗，执行方法选择打开弹窗，modal3为新增的弹窗id

![](./preview36.png)

06. 不满足条件时，选择打开提示弹窗

![](./preview37.png)

07. 标题为 **系统提示**，内容为 **请选择需要转移的客户**

![](./preview38.png)

08. 点击右上角保存即可

09. 继续回到刚新增的modal框中，我们往其中添加一个人员字段
![](./preview39.png)

10. 配置弹窗底部确认按钮事件，选择逻辑分支，判断条件为如下表达式： merber2为刚新增的所属员工人员字段id

```js
If(!!$w.member2.value.length, true, false)
```

11. 满足条件时，调用数据源方法

![](./preview41.png)

12. 数据源选择客户管理，方法修改多条

![](./preview42.png)

我们只需要更新所属员工字段，所以data参数结构如下：

```js
({
    "ssyg": $w.app.common.transSSYG($w.member2.value),
    "params": {
        "filter": {
            "where": {
                "$and": [{
                    "$and": [{
                        "_id": {
                            "$in": $w.table1.selectedRecords.map(it => it._id)
                        }
                    }]
                }]
            },
            "relateWhere": {}
        }
    }
})
```

因为人员字段存储为数组格式，而表中的所属员工字段是字符串格式，因此这里在全局新建一个transSSYG方法用来对数组进行转换

![](./preview43.png)

具体transSSYG代码如下：

```js
export default function(arr) {
    return arr ? typeof arr === 'string' ? arr : arr.join(',') : ''
}
```

13. 查询条件为数据标识等于任意一个所选行的id集合

![](./preview44.png)

14. 成功时关闭弹窗

![](./preview45.png)

15. 继续提示成功消息

![](./preview46.png)

16. 刷新列表当前页

![](./preview47.png)

17. 点击保存，此时完成了整个转移功能开发

##### 拉黑

点击 **拉黑、批量拉黑** 时需要填写拉黑原因
因此用弹窗进行拉黑原因填写，确认后修改当前项数据 `是否拉黑:true` 、 `拉黑原因: 所填写文本内容` 、 `拉黑时间: 当前时间` 、 `拉黑操作人: 当前登录人userId` 等信息，我们的逻辑线为：

![](./preview48.png)

点击拉黑时弹窗后无法获取到点击行数据，因此需要创建一个全局变量用来存储当前点击行数据，在当前页添加一个对象变量

![](./preview49.png)

大体流程和上方批量转移功能相似，这里稍简表示开发流程

01. 新建弹窗

![](./preview50.png)

弹窗中添加一个多行文本字段用来存放拉黑原因

02. 点击**批量拉黑、拉黑**时，打开该弹窗

点击批量拉黑时先判断列表是否有选中项，若没有则提示用户需要选择拉黑客户  
若点击的是操作列的拉黑按钮，则需要设置全局变量

![](./preview51.png)

![](./preview52.png)

03. 编辑弹窗中确认按钮的点击事件

先添加判断条件判断拉黑原因是否为空, 表达式如下：  
`textarea1` 为拉黑原因文本框id

```js
If(!!$w.textarea1.value, true, false)
```

04. 若满足条件则判断全局变量 `cur_kh` 是否有值

```js
If(!!$w.page.dataset.state.cur_kh._id, true, false)
```

05. 若有值则更新单条数据，没有值则为批量拉黑，则更新多条数据  
单条更新查询条件如下：

![](./preview53.png)

单条更新入参如下：

```js
({
    "lhczr": $w.auth.currentUser.name,
    "lhsj": $w.Now(),
    "lhyy": $w.textarea1.value,
    "sflh": true,
    "params": {
        "filter": {
            "where": {
                "$and": [{
                    "$and": [{
                        "_id": {
                            "$eq": $w.page.dataset.state.cur_kh._id
                        }
                    }]
                }]
            },
            "relateWhere": {}
        }
    }
})
```

多条更新查询条件如下：

![](./preview54.png)

多条更新入参如下：

```js
({
    "sflh": true,
    "lhyy": $w.textarea1.value,
    "lhczr": $w.auth.currentUser.nickName,
    "lhsj": $w.Now(),
    "params": {
        "filter": {
            "where": {
                "$and": [{
                    "$and": [{
                        "_id": {
                            "$in": $w.table1.selectedRecords.map(it => it._id)
                        }
                    }]
                }]
            },
            "relateWhere": {}
        }
    }
})
```

06. 更新成功后调用客户跟踪记录表新增记录，单条更新成功后创建单条记录，多条更新成功后创建多条记录

![](./preview55.png)

创建单条参数结构如下：

```js
({
    "xw": "添加黑名单",
    "czr": {
        _id: $w.auth.currentUser.userId
    },
    "jtms": $w.textarea1.value,
    "khId": $w.page.dataset.state.cur_kh._id
})
```

创建多条参数结构如下：

```js
$w.table1.selectedRecords.map(it => ({
    "xw": "添加黑名单",
    "czr": {
        _id: $w.auth.currentUser.userId
    },
    "jtms": $w.textarea1.value,
    "khId": it._id
}))
```

07. 关闭弹窗时置空 cur_kh 变量

##### 自定义标签

因需要动态添加标签，且以 tag 的形式展示，因此自定义一个标签组件，在客户列表中自定义列展示，也在新增、编辑等页面展示

![](./preview56.png)

具体创建流程如下:

01. 选择标签列为自定义列

![](./preview57.png)

02. 自定义插槽添加如下节点

![](./preview58.png)

循环展示普通容器，普通容器中的文本为**标签内容**，按钮为**删除按钮**，我们给这个普通容器添加一点样式

![](./preview59.png)

循环展示下方的按钮为**新增按钮**  
数据来源为当前行标签数据，标签存储为字符串格式，因此需要转成数组格式渲染

![](./preview60.png)

循环展示数据表达式如下:
`$w.table1.cell_bq.record` 为当前行数据

```js
!!$w.table1.cell_bq.record.bq ?
    $w.table1.cell_bq.record.bq.split(",").map((it) => ({
        label: it,
        value: it,
    })) : [];
```

03. 点击新增按钮

点击时设置全局变量 `cur_kh` 为当前行数据并打开弹窗

![](./preview61.png)

弹窗中放入一个文本字段标签内容，点击确定时调用修改单条方法更新当前行数据  

更新当前行数据入参为:

`$w.page.dataset.state.cur_kh` 为当前行信息  
`$w.input1.value` 弹窗中文本内容

```js
({
    "bq": $w.page.dataset.state.cur_kh.bq ? `${$w.page.dataset.state.cur_kh.bq},${$w.input1.value}` : $w.input1.value,
    "params": {
        "filter": ({
            "where": {
                "$and": [{
                    "$and": [{
                        "_id": {
                            "$eq": $w.page.dataset.state.cur_kh._id
                        }
                    }]
                }]
            },
            "relateWhere": {}
        })
    }
})
```

并调用客户跟踪记录表新增记录，参数结构如下：

```js
({
    "xw": "添加标签",
    "czr": {
        _id: $w.auth.currentUser.userId
    },
    "jtms": `添加【${$w.input1.value}标签`,
    "khId": $w.page.dataset.state.cur_kh._id
})
```

04. 关闭弹窗时置空 `cur_kh` 变量

05. 点击删除按钮

点击删除按钮时弹窗进行二次确认，成功后获取当前行数据进行更新即可，参数如下：
`$w.table1.cell_bq.record` 为当前行数据
`$w.index_repeater1` 为当前点击删除按钮的下标

```js
({
    "bq": $w.table1.cell_bq.record.bq.split(',').filter((_, idx) => idx !== $w.index_repeater1).join(','),
    "params": {
        "filter": ({
            "where": {
                "$and": [{
                    "$and": [{
                        "_id": {
                            "$eq": $w.table1.cell_bq.record._id
                        }
                    }]
                }]
            },
            "relateWhere": {}
        })
    }
})
```

##### 客户编辑页面

![](./preview62.png)

01. 因需要展示客户动态， 因此可以通过 tab 来分别展示基本信息、客户动态
02. 当 **是否拉黑** 为 **拉黑** 时展示拉黑原因模块展示拉黑相关信息

![](./preview63.png)

03. 当 **客户类型** 为 **公司** 时展示公司模块表单可录入公司信息

![](./preview64.png)

04. 客户动态用数据列表展示选择数据模型为 **客户跟踪记录**

![](./preview65.png)

数据筛选条件如下：

![](./preview66.png)

05. 所属员工字段改为人员字段，因人员字段可以接收字符串格式数据展示，但是存储的数据格式为数组，因此在保存时需要对该字段转为字符串，将表单的提交事件参数改为如下：

```js
({
    ...$w.form2.submitParams,
    _id: $w.page.dataset.params._id,
    data: {
        ...$w.form2.submitParams.data,
        ssyg: $w.app.common.transSSYG($w.form2.submitParams.data.ssyg)
    },
})
```

06. 标签字段在详情页中也与列表项中一致

![](./preview67.png)

创建一个容器，用文本字段代替label标签，用循环展示组件展示标签内容，后方添加一个按钮用来新增  
循环展示组件的内容和外部列表的标签列一致

![](./preview68.png)

循环展示组件数据为当前表单项的标签字段数据，因表单中标签数据为字符串，因此需要转成数组赋值给循环组件

![](./preview69.png)

表达式内容如下：

```js
!!$w.form2.value.bq ? $w.form2.value.bq.split(',').map(it => ({
    "label": it,
    "value": it,
})) : []
```

点击新增按钮时，需要弹窗填写新增标签内容，同外部列表操作方式一致
在当前页面中新增一个弹窗容器

![](./preview70.png)

点击新增按钮打开弹窗，弹窗中放置一个文本字段

![](./preview71.png)

点击弹窗确认按钮时，判断标签内容是否填写，判断成功后执行js脚本，将当前表单的标签字段值重新赋值，加上新增标签内容

![](./preview72.png)

js脚本如下：
`$w.input4.value` 为弹窗中文本内容

```js
({
    event
}) => {
    const bq = $w.input4.value
    if ($w.form2.value.bq) {
        $w.input1.setValue({
            value: `${$w.form2.value.bq},${bq}`
        })
    } else {
        $w.input1.setValue({
            value: bq
        })
    }
}
```

##### 客户新增页面

因新增页面不展示客户动态，因此复制编辑页面一份，删除 tab 组件，只保留主表单子段  
修改表单场景为新增

![](./preview73.png)

提交事件参数调整如下：

```js
({
    ...$w.form2.submitParams,
    data: {
        ...$w.form2.submitParams.data,
        ssyg: $w.app.common.transSSYG($w.form2.submitParams.data.ssyg)
    }
})
```

##### 客户详情页面

详情页面和编辑页面一致，因此可以共用编辑页面，列表点击查看跳转详情页面时选择编辑页面， `formType` 传递为 `read`

![](./preview74.png)

编辑页面中的提交按钮，标签删除、新增按钮均需判断当前表单是否不为只读场景

![](./preview75.png)

是否可见表达式如下：

```js
$w.page.dataset.params.formType !== "read"
```

#### 客户统计

**效果如图：**

![](./preview76.png)

图表展示如下维度客户信息

| 名称             | 图表类型 | 数据源               |
|------------------|----------|----------------------|
| 客户总数         | 统计卡片 | 客户信息/统计        |
| 今日新增客户数   | 统计卡片 | 客户信息/统计        |
| 公海客户数       | 统计卡片 | 客户信息/统计        |
| 黑名单数         | 统计卡片 | 客户信息/统计        |
| 客户总数趋势     | 折线图   | 自定义APIs           |
| 新增客户数趋势   | 折线图   | 客户信息             |
| 客户状态分布     | 饼图     | 事件流/自定义变量    |
| 客户阶段分布     | 饼图     | 事件流/自定义变量    |

##### 客户总数

01. 使用统计卡片组件进行渲染，数据源选择统计

![](./preview77.png)

02. 筛选规则我们去掉拉黑用户

![](./preview78.png)

03. 字段选择我们选择所有人，统计方式选择计数即可

![](./preview79.png)

##### 今日新增客户数

01. 同客户总数，数据源选择客户信息统计

02. 过滤条件为：`创建事件大于今天0点`，`是否拉黑：false`  
今天0点时间戳 `new Date(new Date().toLocaleDateString()).getTime()`

![](./preview80.png)

##### 公海客户数

01. 同客户总数，数据源选择客户信息统计
02. 过滤条件为： `所属员工：空` ， `是否拉黑：false`

![](./preview81.png)

##### 黑名单数

01. 同客户总数，数据源选择客户信息统计

02. 过滤条件为： `是否拉黑：true`

![](./preview82.png)

##### 客户总数趋势

该图表主要展示客户信息表数据根据创建时间进行累加，因此需要对表数据进行处理，这里使用自定义APIs开发，这里新加一个APIs方法，使用自定义代码进行处理

![](./preview83.png)

![](./preview84.png)

具体自定义代码如下:

```js
const dayjs = require("dayjs");

module.exports = async function(params, context) {
    const res = await context.callModel({
        dataSourceName: "khxx_dpevgv2", // 数据模型名称
        methodName: "wedaGetRecordsV2", // 方法名
        params: {
            select: {
                createdAt: true,
            },
            orderBy: [{
                createdAt: "asc",
            }, ],
        },
    });

    const formatStemp = (time) => {
        return dayjs(time).format("YYYY-MM-DD");
    };

    const transData = ({
        x,
        y
    }) => {
        return {
            XLabel: {
                Value: x
            },
            YLabels: [{
                Name: "总数",
                Value: y
            }],
        };
    };

    const getX = (data) => {
        return data.XLabel.Value;
    };

    const getY = (data) => {
        return data.YLabels[0].Value;
    };

    const result = res.records.reduce((arr, itm) => {
        if (!arr.length) {
            arr.push(
                transData({
                    x: formatStemp(itm.createdAt),
                    y: 1,
                })
            );
        } else if (getX(arr[arr.length - 1]) === formatStemp(itm.createdAt)) {
            arr[arr.length - 1].YLabels[0].Value += 1;
        } else {
            arr.push(
                transData({
                    x: formatStemp(itm.createdAt),
                    y: getY(arr[arr.length - 1]) + 1,
                })
            );
        }
        return arr;
    }, []);

    return {
        result
    };
};
```

##### 新增客户趋势

该图标需要根据创建时间按天累计进行展示，因此直接使用折线图即可，选择x轴维度为创建时间，y轴统计方式为计数

![](./preview85.png)

##### 客户状态分布/客户阶段分布

该图表需要对数据的状态、客户阶段进行翻译 (该两字段为枚举)，然后对客户信息表数据根据状态、阶段进行统计计数  
操作步骤如下:

01. 当前页面新建对象变量:pieChatData

![](./preview86.png)

02. 当前页面新建 **事件流:setPieChatData**

03. **setPieChatData** 中第一步获取 客户信息表 全量数据
   因这里只需要 状态、客户阶段 字段，因此配置 关联表查询选择 (对象)如下:

```js
{
    "zt": true,
    "khjd": true
}
```

![](./preview87.png)

04. 获取数据成功后执行如下js代码:

```js
({
    event
}) => {
    const arr = event.detail.records;

    const transData = ({
        x,
        y
    }) => {
        return {
            XLabel: {
                Value: x
            },
            YLabels: [{
                Name: "总数",
                Value: y
            }],
        };
    };

    const formatVal = (val, code) => {
        return $w.app.utils.formatEnum(val, code, $w.app);
    };

    const getChatVal = (type, code) => {
        return Object.entries(newArr[type]).map(([key, value]) => {
            const newKey = key === "other" ? "未知" : formatVal(key, code);
            return transData({
                x: newKey,
                y: value
            });
        });
    };

    const newArr = arr.reduce(
        (obj, itm) => {
            const ztKey = itm.zt || "other";
            obj["zt"][ztKey] = obj["zt"][ztKey] ? obj["zt"][ztKey] + 1 : 1;

            const jdKey = itm.khjd || "other";
            obj["jd"][jdKey] = obj["jd"][jdKey] ? obj["jd"][jdKey] + 1 : 1;

            return obj;
        }, {
            zt: {},
            jd: {},
        }
    );

    const obj = {
        zt: getChatVal("zt", "scrm_status"),
        jd: getChatVal("jd", "scrm_followStatus"),
    };

    $w.page.dataset.state.pieChatData = obj;
};
```

05. 当前页面显示时调用 `setPieChatData`

#### 黑名单

![](./preview88.png)

该页面和客户管理页面相似，只是数据过滤条件不同，功能按钮不同，因此复制客户管理页面后进行修改  

01. 过滤条件为 `是否拉黑: true`

02. 全局按钮包含 批量移出客户、批量删除、导出、导入

03. 操作按钮包含 查看、编辑、移出、删除

##### 移出

同客户管理拉黑  
点击 **移出、批量移出** 时弹窗进行移出原因填写，确认后修改当前项数据 `是否拉黑:false` 、 `拉黑原因: 空` 、 `拉黑时间: 空` 、 `拉黑操作人: 空` 等信息
逻辑线如下：

![](./preview89.png)

#### 公海池

![](./preview90.png)

该页面和客户管理页面相似，只是数据过滤条件不同，功能按钮不同，因此复制客户管理页面后进行修改

01. 过滤条件为 `是否拉黑: false`，`所属员工:空`

02. 全局按钮包含 新建、批量删除、批量转移客户、批量领取、导出、导入

03. 操作按钮包含 查看、领取、删除

##### 批量转移

同客户管理批量转移

### 登录

进入左侧应用设置，选择访问控制，其中选择登录后访问，选择账号密码登录

![](./preview91.png)

### 退出登录

我们在这里添加一个退出登录功能，可以在文档中心查询退出登录功能如何实现

![](./preview92.png)

这里我们点进去看到可以通过点击按钮执行js脚本完成退出登录功能  
如法炮制，我们在编辑器左下角代码区的全局区域单击 **+** 号，在弹出层中选择**新建JavaScript方法**

![](./preview93.png)

在弹窗的代码编辑器中复制上述文档中提示的脚本粘贴进去，修改方法名为 **signout** 点击右上角保存

![](./preview94.png)

继续我们删除设计器左下角产品文档文本组件，修改左侧icon，并添加一个按钮，修改按钮名称以及类型

![](./preview95.png)

点击右下角事件中的点击，选择**JavaScript方法**

![](./preview96.png)

选择**自定义方法signout**

![](./preview97.png)

点击事件框右上角保存即可

### 发布

上述配置完成后，即可发布到体验版查看，[发布应用](https://cloud.tencent.com/document/product/1301/95853)

![](./preview98.png)

发布成功后会提供体验版入口，进入即可看到页面

![](./preview99.png)

### 体验版

登录页
![](./preview100.png)

首页

![](./preview101.png)

客户管理

![](./preview102.png)
