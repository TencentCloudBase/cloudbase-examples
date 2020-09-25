<a href="https://github.com/TencentCloudBase/cloudbase-templates"><img src="https://main.qcloudimg.com/raw/7b50431d8cef29d9ebb82c4ff2e6032c.png"></a>

# 云开发应用示例：网页 snapshot

用 puppeteer 将任意在线网页实时在线转成 PDF/图片，同时支持一键发布云端。

## 使用

[在线演示地址](https://tcb.tcloudbaseapp.com/snapshot/)

你也可以通过下面的按钮使用[cloudbase framework]快速部署本项目到你自己的[云开发]账号上。

[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2FTencentCloudBase%2FCloudbase-Examples&workDir=web%2Fsnapshots&appName=snapshots)

## 目录说明
```
.
├── README.md
├── cloudbaserc.json    # 云开发配置文件
├── dest                # 静态文件编译后目录
│   └── index.html      
├── functions           # 云函数存放目录
│   └── snapshots       # snapshots 服务目录
├── package.json
└── statics             # 静态文件源码目录
    └── index.ejs       # 入口 html 模板
```
## 本地开发调试

1. 下载本仓库到本地，并在当前目录启用命令行终端。
2. 安装开发依赖：命令行运行`npm i` or `yarn`。
3. 使用你习惯的编辑器来做些前端或者服务函数的编辑或者查看。
4. 本地运行：命令行运行 `npm run dev`，访问本地地址，默认为 `http://127.0.0.1:3000/snapshot`。
5. 发布云端：命令行运行 `npm run deploy -- -e YOUR_ENV_HERE`。

### 相关链接

- [云开发]
- [cloudbase framework]
- [puppetter]

[云开发]: https://cloudbase.net/
[cloudbase framework]: https://github.com/TencentCloudBase/cloudbase-framework
[puppetter]: https://github.com/puppeteer/puppeteer
