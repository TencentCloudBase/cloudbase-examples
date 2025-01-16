# 云函数2.0示例项目-TS函数项目

该示例代码演示如何通过 `TypeScript` 编写 `云函数2.0` 项目代码。包括项目结构示例，以及如何调试。

如何调试代码可参考：<https://docs.cloudbase.net/cbrf/how-to-debug-functions-code#%E8%B0%83%E8%AF%95-typescript-%E4%BB%A3%E7%A0%81>

JavaScript 示例代码见：<https://github.com/TencentCloudBase/func-v2-template>

## 项目结构说明

```tree
.
├── README.md # 项目说明
├── cloudrunfunctions # 云函数2.0项目代码目录，每个目录对应一个函数
│   ├── README.md # 云函数说明
│   ├── func-a # 云函数 `func-a` 代码目录
│   └── func-b # 云函数 `func-b` 代码目录
├── node_modules  # node_modules [可能有]
├── package.json  # package.json [可能有]
├── tsconfig.json # tsconfig.json [可能有]
```

以上，为一个简单项目结构示例，项目中还可能包含很多其他类型的文件，其他文件的组织根据项目需要进行即可
