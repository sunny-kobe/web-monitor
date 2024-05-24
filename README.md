# web-monitor


## 发包流程
pnpm run changeset ———— 可以更新包的版本信息
pnpm run packages-version ———— 可以同步依赖的版本信息
pnpm run publish ———— 可以发布包到npm平台上



## 埋点统计



### packages
├── packages
|   ├── common // 公共变量
|   |   ├── package.json
|   ├── core // 核心模块
|   |   ├── package.json
|   ├── performance // 性能检测
|   |   ├── package.json
|   ├── recordscreen // 页面录屏
|   |   ├── package.json
|   |── types // ts类型
|   |   ├── package.json
|   |── utils // 公共方法
|   |   ├── package.json
├── package.json
