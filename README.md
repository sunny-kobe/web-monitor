# web-monitor


## 发包流程
pnpm run changeset ———— 可以更新包的版本信息
pnpm run packages-version ———— 可以同步各自依赖的版本信息
pnpm run publish ———— 可以发布包到npm平台上


## 添加本地包
pnpm add @websaw/vue3@workspace:^ --filter vue3-project
pnpm add @websaw/core@workspace:^ --filter @websaw/event
pnpm add element-plus --filter vue3-project


## 删除
pnpm remove @websaw/core --filter vue3-project


## 埋点统计
核心模块（CoreSDK）：管理配置、事件总线和功能模块。
基础模块（BaseModule）：提供初始化和销毁功能，确保模块只能初始化一次。
功能模块（ClickEventModule）：继承基础模块，实现具体的功能（如点击事件跟踪）。
Vue3 插件：将SDK集成到Vue3应用中，方便使用和管理。

我现在在设计一个前端埋点监控SDK，架构为pnpm+menerepo，这是我项目的一些信息
### packages
项目名——web-monitor
├── packages
|   ├── common // 公共变量
|   |   ├── package.json
|   ├── core // 核心模块
│   ├── ├── config.ts
│   ├── ├── eventBus.ts
│   ├── ├── baseModule.ts
│   ├── ├── index.ts
|   |   ├── package.json
|   ├── event-tracking // 埋点功能
|   |   ├── package.json
|   ├── error-monitoring // 错误监控功能
|   |   ├── package.json
|   ├── performance // 性能检测
|   |   ├── package.json
|   |── types // ts类型
|   |   ├── package.json
|   |── utils // 公共方法
|   |   ├── package.json
├── example // 示例项目
├── package.json


### 流程图-mermaid
graph TD
    A[Example App] --> B[Event Tracking Module]
    A[Example App] --> C[Error Monitoring Module]
    A[Example App] --> D[Performance Monitoring Module]

    subgraph "Core Module"
        E[Core SDK]
    end

    subgraph "Common Utilities"
        F[Common Variables]
        G[Type Definitions]
        H[Utility Functions]
    end

    B[Event Tracking Module] -->|Inherits from| E[Core SDK]
    C[Error Monitoring Module] -->|Inherits from| E[Core SDK]
    D[Performance Monitoring Module] -->|Inherits from| E[Core SDK]

    E[Core SDK] --> F[Common Variables]
    E[Core SDK] --> G[Type Definitions]
    E[Core SDK] --> H[Utility Functions]

    B[Event Tracking Module] --> F[Common Variables]
    B[Event Tracking Module] --> G[Type Definitions]
    B[Event Tracking Module] --> H[Utility Functions]

    C[Error Monitoring Module] --> F[Common Variables]
    C[Error Monitoring Module] --> G[Type Definitions]
    C[Error Monitoring Module] --> H[Utility Functions]

    D[Performance Monitoring Module] --> F[Common Variables]
    D[Performance Monitoring Module] --> G[Type Definitions]
    D[Performance Monitoring Module] --> H[Utility Functions]

