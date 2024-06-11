// baseModule.ts

import { Config } from './config';
import { EventBus } from './eventBus';

// 定义BaseModule构造函数的参数类型，包含配置和事件总线
export interface BaseModuleOptions {
    config: Config;
    eventBus: EventBus;
}

// BaseModule类，所有功能模块的基类
export class BaseModule {
    protected config: Config;       // 模块的配置
    protected eventBus: EventBus;   // 模块的事件总线
    private isInitialized: boolean = false; // 模块是否已初始化

    // 构造函数，接收配置和事件总线，并赋值给成员变量
    constructor(options: BaseModuleOptions) {
        this.config = options.config;
        this.eventBus = options.eventBus;
    }

    // 初始化方法，防止重复初始化，并输出日志
    public init(): void {
        if (this.isInitialized) {
            throw new Error('Module already initialized');
        }
        this.isInitialized = true;
        this.log('Module initialized');
    }

    // 销毁方法，重置初始化状态，并输出日志
    public destroy(): void {
        this.isInitialized = false;
        this.log('Module destroyed');
    }

    // 日志方法，根据配置项中的debug选项决定是否输出日志
    protected log(message: string): void {
        if (this.config.get('debug')) {
            console.log(`[${this.constructor.name}] ${message}`);
        }
    }
}
