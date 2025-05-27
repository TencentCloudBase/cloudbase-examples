# CloudBase React 模板

基于 React、Vite 和腾讯云开发（CloudBase）的现代化 Web 应用模板，为开发者提供了快速构建全栈应用的能力。


[![Powered by CloudBase AI-Deploy MCP](https://img.shields.io/badge/Powered%20by-CloudBase%20AI--Deploy%20MCP-blue?style=flat-square)](https://github.com/TencentCloudBase/cloudbase-ai-deploy-mcp)  

> 本项目基于 [**CloudBase AI-Deploy MCP**](https://github.com/TencentCloudBase/cloudbase-ai-deploy-mcp) 开发，支持AI生成全栈代码、一键部署至腾讯云开发（免服务器）、智能日志修复。  
源代码开源（MIT协议）：[Github仓库](https://github.com/TencentCloudBase/cloudbase-ai-deploy-mcp)，支持 web 、小程序全栈应用等

## 项目特点

- 🚀 基于 Vite 构建，提供极速的开发体验
- ⚛️ 使用 React 18 和 React Router 6 构建现代化 UI
- 🎨 集成 Tailwind CSS 和 DaisyUI 组件库，快速构建漂亮的界面
- 🔄 使用 Framer Motion 实现流畅的动画效果
- 🎁 深度集成腾讯云开发 CloudBase，提供一站式后端云服务

## 项目架构

### 前端架构

- **框架**：React 18
- **构建工具**：Vite
- **路由**：React Router 6（使用 HashRouter）
- **样式**：Tailwind CSS + DaisyUI
- **动画**：Framer Motion

### 云开发资源

本项目使用了以下腾讯云开发（CloudBase）资源：

- **身份认证**：用于用户登录和身份验证
- **云数据库**：可用于存储应用数据
- **云函数**：可用于实现业务逻辑
- **云存储**：可用于存储文件
- **静态网站托管**：用于部署前端应用

## 开始使用

### 前提条件

- 安装 Node.js (版本 14 或更高)
- 腾讯云开发账号 (可在[腾讯云开发官网](https://tcb.cloud.tencent.com/)注册)

### 安装依赖

```bash
npm install
```

### 配置云开发环境

1. 打开 `src/utils/cloudbase.js` 文件
2. 将 `ENV_ID` 变量的值修改为您的云开发环境 ID

### 本地开发

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 部署指南

### 部署到云开发静态网站托管

1. 构建项目：`npm run build`
2. 登录腾讯云开发控制台
3. 进入您的环境 -> 静态网站托管
4. 上传 `dist` 目录中的文件

## 目录结构

```
├── public/               # 静态资源
├── src/
│   ├── components/       # 可复用组件
│   ├── pages/            # 页面组件
│   ├── utils/            # 工具函数和云开发初始化
│   ├── App.jsx           # 应用入口
│   ├── main.jsx          # 渲染入口
│   └── index.css         # 全局样式
├── index.html            # HTML 模板
├── tailwind.config.js    # Tailwind 配置
├── postcss.config.js     # PostCSS 配置
├── vite.config.js        # Vite 配置
└── package.json          # 项目依赖
```

## 开始开发

首页位于 `src/pages/HomePage.jsx`，是应用的默认入口页面。您可以根据项目需求自定义首页内容。


## 路由系统说明

本项目使用 React Router 6 作为路由系统，并采用 HashRouter 实现路由管理，这样可以更好地兼容静态网站托管服务，避免刷新页面时出现 404 错误。


### 当前路由结构

```jsx
<Router>
  <div className="flex flex-col min-h-screen">
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 可以在这里添加新的路由 */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </main>
    <Footer />
  </div>
</Router>
```

### 如何添加新页面和路由

1. 在 `src/pages` 目录下创建新页面组件，例如 `ProductPage.jsx`：

```jsx
import React from 'react';

const ProductPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">产品页面</h1>
      <p>这是产品页面的内容</p>
    </div>
  );
};

export default ProductPage;
```

2. 在 `App.jsx` 中导入新页面并添加路由：

```jsx
import ProductPage from './pages/ProductPage';

// 在 Routes 中添加新路由
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/products" element={<ProductPage />} />
  <Route path="*" element={<HomePage />} />
</Routes>
```

3. 使用 Link 组件在页面中添加导航链接：

```jsx
import { Link } from 'react-router-dom';

// 在页面中添加链接
<Link to="/products" className="btn btn-primary">前往产品页面</Link>
```

### 使用路由参数

对于需要动态参数的路由，可以使用参数路径：

```jsx
// 在 App.jsx 中定义带参数的路由
<Route path="/product/:id" element={<ProductDetailPage />} />

// 在 ProductDetailPage.jsx 中获取参数
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">产品详情</h1>
      <p>产品ID: {id}</p>
    </div>
  );
};
```

### 路由导航

除了使用 `<Link>` 组件，还可以使用编程式导航：

```jsx
import { useNavigate } from 'react-router-dom';

const ComponentWithNavigation = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/products');
    // 或者带参数: navigate('/product/123');
    // 或者返回上一页: navigate(-1);
  };
  
  return (
    <button onClick={handleClick} className="btn btn-primary">
      前往产品页面
    </button>
  );
};
```



## 云开发功能说明

### 初始化云开发

本模板在 `src/utils/cloudbase.js` 中集中管理云开发的初始化和匿名登录功能。这个工具文件提供了以下功能：

```javascript
import cloudbase from './utils/cloudbase';

// 方式一：使用默认实例
const app = cloudbase.app;  // 获取默认初始化的实例

// 方式二：自定义配置初始化
const customApp = cloudbase.init({
  env: '您的环境ID',  // 替换为实际的环境ID
  timeout: 10000     // 可选，设置超时时间
});

// 确保用户已登录（如未登录会执行匿名登录）
cloudbase.ensureLogin().then(loginState => {
  console.log('登录成功:', loginState);
  
  // 获取登录范围（确认是否为匿名登录）
  app.auth().loginScope().then(scope => {
    console.log('登录范围:', scope);  // 'anonymous' 表示匿名登录
  });
  
  // 使用其他云开发功能
  const db = app.database();
  const collection = db.collection('todos');
  
  // 调用云函数
  app.callFunction({
    name: 'functionName',
    data: { /* 参数 */ }
  });
  
  // 上传文件
  app.uploadFile({
    cloudPath: 'images/example.jpg',
    filePath: /* 文件对象 */,
    onUploadProgress: progress => console.log('上传进度:', progress)
  });
});

// 退出登录（注意：匿名登录无法退出）
cloudbase.logout().then(() => {
  console.log('已退出登录');
}).catch(error => {
  console.error('退出登录失败:', error);
});
```

### 重要说明

1. 在使用前请先在 `src/utils/cloudbase.js` 文件中将 `ENV_ID` 变量的值修改为您的云开发环境 ID。
2. 本模板默认使用匿名登录，这适合快速开发和测试，但在生产环境中可能需要更严格的身份验证。
3. 所有云开发功能都通过初始化的应用实例直接调用，无需二次封装。
4. `ensureLogin` 方法会检查当前登录状态，如果已登录则返回当前登录状态，否则会进行匿名登录。
5. 匿名登录状态无法使用 `logout` 方法退出，只有其他登录方式（如微信登录、邮箱登录等）可以退出。

### 身份认证

确保用户已登录（如未登录则执行匿名登录）：

```javascript
cloudbase.ensureLogin().then(loginState => {
  console.log('用户ID:', loginState.user.uid);
});
```

退出登录（非匿名登录状态下）：

```javascript
cloudbase.logout().then(() => {
  console.log('已成功退出登录');
});
```

### 云数据库访问

```javascript
const db = cloudbase.app.database();
const collection = db.collection('todos');

// 查询数据
collection.get().then(res => {
  console.log('查询结果:', res.data);
});

// 添加数据
collection.add({
  title: '新任务',
  completed: false,
  createTime: new Date()
}).then(res => {
  console.log('添加成功:', res);
});
```

### 云函数调用

```javascript
cloudbase.app.callFunction({
  name: 'functionName',
  data: {
    // 函数参数
    param1: 'value1',
    param2: 'value2'
  }
}).then(res => {
  console.log('函数执行结果:', res.result);
});
```

### 云存储

```javascript
// 上传文件
cloudbase.app.uploadFile({
  cloudPath: 'images/avatar.jpg', // 云端存储路径
  filePath: fileObject, // 本地文件对象
  onUploadProgress: progressEvent => {
    console.log('上传进度:', progressEvent);
  }
}).then(result => {
  console.log('文件ID:', result.fileID);
});

// 获取文件下载链接
cloudbase.app.getTempFileURL({
  fileList: ['cloud://环境ID.图片路径']
}).then(res => {
  console.log('文件临时链接:', res.fileList[0].tempFileURL);
});
```

## 贡献指南

欢迎贡献代码、报告问题或提出改进建议！

## 许可证

MIT
