// packages/core/src/index.ts
// import type { InitOptions } from '@websaw/type';

// function init(options: InitOptions) {
//     console.log(options);
// }


// export {
//     init
// };
// export type { InitOptions };
// export default { init };

// index.ts

import { Config, CoreConfig } from './config';
import { EventBus } from './eventBus';
import { BaseModule } from './baseModule';

/**
 * CoreSDK类代表了web监控系统的核心SDK。
 * 它提供注册和注销模块的功能,
 * 访问配置设置，管理事件总线，初始化/销毁模块。.
 */
export class CoreSDK {
    private config: Config;     // 核心SDK的配置
    private eventBus: EventBus; // 核心SDK的事件总线
    private modules: BaseModule[] = []; // 已注册的模块列表

    /**
     * 构造函数，接收核心配置，初始化配置和事件总线，并输出调试日志.
     * @param coreConfig The configuration for the core SDK.
     */
    constructor(coreConfig: CoreConfig) {
        this.config = new Config(coreConfig);
        this.eventBus = new EventBus();
        if (this.config.get('debug')) {
            console.log('CoreSDK初始化配置:', this.config);
        }
    }

    /**
     * 注册模块方法，接收模块实例，初始化模块，并添加到模块列表
     * @param module The module instance to register.
     */
    public registerModule(module: BaseModule): void {
        this.modules.push(module);
        module.init();
        this.log(`模块注册: ${module.constructor.name}`);
    }

    /**
     * 注销模块方法，接收模块实例，销毁模块，并从模块列表中移除
     * @param module The module instance to unregister.
    */
    public unregisterModule(module: BaseModule): void {
        module.destroy();
        this.modules = this.modules.filter(m => m !== module);
        this.log(`Module unregistered: ${module.constructor.name}`);
    }

    /**
     * 获取配置的方法.
     * @returns 返回核心SDK的配置实例.
     */
    public getConfig(): Config {
        return this.config;
    }

    /**
    * 获取事件总线的方法
    * @returns 核心SDK的事件总线实例.
    */
    public getEventBus(): EventBus {
        return this.eventBus;
    }

    /**
    * 初始化所有已注册模块的方法
    */
    public init(): void {
        this.modules.forEach(module => module.init());
        this.log('CoreSDK initialized all modules');
    }

    // 销毁所有已注册模块的方法
    public destroy(): void {
        this.modules.forEach(module => module.destroy());
        this.log('CoreSDK destroyed all modules');
    }

    /**
     * 日志方法，根据配置项中的debug选项决定是否输出日志
     * @param message The message to log.
     */
    private log(message: string): void {
        if (this.config.get('debug')) {
            console.log(`[CoreSDK] ${message}`);
        }
    }
}

export * from './config';
export * from './eventBus';
export * from './baseModule';
