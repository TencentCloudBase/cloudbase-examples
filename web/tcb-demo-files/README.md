# FILE-S跨平台文件转储工具

本工具完全使用**腾讯云云开发**提供的服务进行部署

展示URL：[https://f.dnuise.cn](https://f.dnuise.cn)

### 项目描述

File-S文件转储服务用于无障碍跨平台文件传输，用户可以免登录存放和收取文件；应用于一些临时文件使用场景下的文件传输服务。
- 打印店场景：手机内的文件发送给打印机电脑
- 大文件传输：超过聊天工具限制大小的文件传输
- 无连接传输：两个端没有工具链接的文件传输场景
- 群发大文件：无线上关系网络情况下的文件群发

云开发出色的跨端支持能力，可以覆盖WEB端平台，微信小程序，QQ小程序，移动APP等多个端应用。让用户摆脱平台间的隔阂，无缝连接文件传输。

FILE-S文件转储服务支持6小时的文件存储时长，支持取后即删；配备密码设定，让你的文件更加安全。

同时在取文件时加载腾讯验证码，最大程度的防止恶意人员穷举攻击。

文件存储使用云开发文件存储服务，超大容量，无文件大小限制，20M带宽文件上下载速度。

### 技术使用

- 后端服务使用腾讯云云开发提供的一体化解决方案，包括云函数、云数据库、云存储能力

- 前端使用原生JavaScript，配合腾讯云云开发提供的JS-SDK完成后端服务的对接

- 前端静态资源部署在腾讯云云开发的静态网站托管服务上

### 项目地址

GitHub: [tcb-demo-files](https://github.com/TencentCloudBase/Cloudbase-Examples/tree/master/web/tcb-demo-files)

### 前提准备

- 在正式开始部署本项目前，请访问[Web端入门须知](https://tencentcloudbase.github.io/2020-02-14-init)、[开发准备文档](https://tencentcloudbase.github.io/2020-02-14-prepare)，掌握了解云开发Web端的基本概念和学习使用云开发CLI工具以及环境创建流程。

### 部署步骤

##### 一、创建云开发环境

- 访问[腾讯云云开发控制台](https://console.cloud.tencent.com/tcb),新建【按量计费云开发环境】，记住云开发环境ID。
- 进入[静态网站控制页](https://console.cloud.tencent.com/tcb/hosting)，开通静态网站托管服务
- 进入[数据库控制页](https://console.cloud.tencent.com/tcb/database)，添加3个集合；集合名字分别为dustbin、file、manage
- 进入[用户管理控制页](https://console.cloud.tencent.com/tcb/user)-登录设置的登录方式中，勾选[匿名登录]()

##### 二、导入初始化数据

- 找到项目目录下cloudfunctions/asset/manage-database.json文件，此为数据库集合manage的初始数据结构
- 进入环境控制台的【数据库】，点击进入[manage集合](https://console.cloud.tencent.com/tcb/database/collection/manage),导入manage-database.json文件

##### 三、配置项目

- 用代码工具打开项目目录，将以下文件中标注有【云开发环境ID】处替换成**自己的云开发环境ID**
-- cloudfunctions/cloudbaserc.js 第2行
-- webviews/js/index.js 第1行

- 前往[腾讯验证码官网](https://007.qq.com/captcha)创建验证码应用，获得aid和AppSecretKey；并打开cloudfunctions/functions/getFile/index.js，在第3行TCaptchaID中填充自己项目的aid和AppSecretKey；另外在webviews/index.html大约119行，id为**TencentCaptcha**的button元素，将属性**data-appid**填写为【应用验证码aid】。

- 前往[静态网站控制台](https://console.cloud.tencent.com/tcb/hosting)-设置，复制域名信息下的默认域名；粘贴至cloudfunctions/functions/getFile/index.js第9行AllowOriginList数组中第1项。

##### 四、NPM依赖配置安装
- 确定本机已经安装了nodejs和npm，如果没有安装请自行下载安装
- 命令行进入cloudfunctions/functions下的每个文件目录，每个目录均执行一遍以下代码：
``` bash
$ npm install
```

##### 五、上传并部署云函数

- 使用CloudBase CLI工具登录后，进入cloudfunctions/目录，依次执行以下代码：
**注意：envID 替换成自己的云开发环境ID**
``` bash
$ cloudbase functions:deploy -e envID delete
$ cloudbase functions:deploy -e envID downFile
$ cloudbase functions:deploy -e envID getFile
$ cloudbase functions:deploy -e envID myfile
$ cloudbase functions:deploy -e envID upload
$ cloudbase service:create -e envID -p getFile -f getFile
$ cloudbase functions:trigger:create -e envID delete
```
- 上面最后两行是为 getFile云函数创建HTTP服务 和 为delete创建触发器

##### 六、部署静态网站服务

- 使用CloudBase CLI工具登录后，进入根目录，依次执行以下代码：
**注意：envID 替换成自己的云开发环境ID**
``` bash
$ cloudbase hosting:deploy -e envID webviews
```

到这里，整个项目就部署完毕，你可以访问静态网站服务默认域名访问使用了。如果你要对外使用，需要将域名换成自己已经备案的域名。

### 自定义域名

云开发提供了完备的web端资源服务，但是一个对外公开使用的web项目需要有自己的备案域名，需要受到监管。**所以，在正式对外推出之前，需要将云开发提供的默认域名替换成自己已经备案的域名**

- 前往[静态网站控制台](https://console.cloud.tencent.com/tcb/hosting)-设置，在【域名信息】下点击[添加域名]()按钮，填写已经备案的域名。域名需要配有SSL证书，腾讯云下域名会自动监测证书；如果是非腾讯云旗下域名，则需要上传SSL证书。

- 需要等待域名添加状态为【已启动】后，才可以去域名解析中配置CNAME。

- 前往[用户管理控制台](https://console.cloud.tencent.com/tcb/user)-登录设置，在WEB安全域名中删除云开发的默认域名，只保留自定义域名。

- cloudfunctions/functions/getFile/index.js第9行AllowOriginList数组中，将默认域名更换成自定义域名，保存；使用CloudBase CLI到cloudfunctions目录下，执行下面代码更新：
**注意：envID 替换成自己的云开发环境ID**
``` bash
$ cloudbase functions:code:update -e envID getFile
```

### 其他说明

1.为了全面展示腾讯云云开发的各项能力，有些地方代码不自然，可以根据自己的技术水准做升级
2.util-min.js是作者自己封装的JS方法库的一小部分，用于做原生JS应用的快速开发，目前无法做到开源水平，小打小闹。
3.此项目为云开发原生JS-Demo，所以任何框架和库都没用，会计划对各大框架做云开发Demo，也欢迎各位大神前来贡献。
4.如果对于此项目有任何疑惑可以在Github项目下new issues