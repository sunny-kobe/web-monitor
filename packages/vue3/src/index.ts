import { CoreSDK } from '@websaw/core'
import { ClickEventModule, type ClickEvent } from '@websaw/event'
// import type { App } from 'vue';  // 仅引入类型

// 定义插件选项的接口
interface ClickEventPluginOptions {
    coreConfig: any;  // 核心SDK的配置
    callback: (event: ClickEvent) => void;
}

const WebSaw = {
    install(app: any, options: ClickEventPluginOptions) {
        // 初始化核心SDK
        const coreSDK = new CoreSDK(options.coreConfig);

        // 创建并注册ClickEventModule模块
        const clickEventModule = new ClickEventModule({
            config: coreSDK.getConfig(),
            eventBus: coreSDK.getEventBus(),
        }, options.callback);

        coreSDK.registerModule(clickEventModule);

        // 在插件内部监听 clickEvent 事件
        coreSDK.getEventBus().on('clickEvent', (event: ClickEvent) => {
            console.log('Click event received in plugin:', event);
        });

        // 核心SDK初始化
        coreSDK.init();

        // 将核心SDK和模块挂载到全局属性，方便调试和访问
        app.config.globalProperties.$coreSDK = coreSDK;
        app.config.globalProperties.$clickEventModule = clickEventModule;

        // 在应用销毁时销毁coreSDK
        app.unmount = () => {
            console.log('App unmounted');
            coreSDK.destroy();
        };
    }
}




export default WebSaw