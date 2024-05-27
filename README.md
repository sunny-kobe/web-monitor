# web-monitor


## 发包流程
pnpm run changeset ———— 可以更新包的版本信息
pnpm run packages-version ———— 可以同步各自依赖的版本信息
pnpm run publish ———— 可以发布包到npm平台上


## 添加本地包
pnpm add @websaw/common@workspace:^1.0.0 --filter vue3-project

## 删除
pnpm remove @websaw/pk1 --filter vue3-project


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
