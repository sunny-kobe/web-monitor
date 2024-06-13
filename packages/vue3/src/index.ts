import { CoreSDK } from '@websaw/core'
import { ClickEventModule, ClickEvent } from '@websaw/event'
// import type { App } from 'vue';  // 仅引入类型

// 定义插件选项的接口
interface ClickEventPluginOptions {
    coreConfig: any;  // 核心SDK的配置
    callback: (event: ClickEvent) => void;
}

const WebSaw = {
    install(app: any, options: any) {
        // 初始化核心SDK
        const coreSDK = new CoreSDK(options.coreConfig);

        // 创建并注册ClickEventModule模块
        const clickEventModule = new ClickEventModule({
            config: coreSDK.getConfig(),
            eventBus: coreSDK.getEventBus(),
        }, options.callback);

        coreSDK.registerModule(clickEventModule);

        // 核心SDK初始化
        coreSDK.init();

        // 挂载Vue应用时的钩子
        app.mixin({
            beforeUnmount() {
                coreSDK.destroy();
            }
        });
    }
}




export default WebSaw