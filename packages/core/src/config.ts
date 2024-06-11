// config.ts

// 定义CoreConfig接口，包含SDK所需的配置项
export interface CoreConfig {
    appId: string;    // 应用ID
    reportUrl: string; // 数据上报URL
    debug?: boolean;   // 是否开启调试模式（可选）
}

// 定义默认配置，包含默认的appId, reportUrl和debug值
const defaultConfig: CoreConfig = {
    appId: '',
    reportUrl: '',
    debug: false,
};

// Config类，用于管理和验证配置
export class Config {
    private config: CoreConfig;

    // 构造函数，接收用户提供的配置，并与默认配置合并
    constructor(config: CoreConfig) {
        this.config = { ...defaultConfig, ...config };
        this.validateConfig();
    }

    // 验证配置项是否合法
    private validateConfig() {
        if (!this.config.appId) {
            throw new Error('appId is required');
        }
        if (!this.config.reportUrl) {
            throw new Error('reportUrl is required');
        }
    }

    // 获取配置项的值
    public get(key: keyof CoreConfig): any {
        return this.config[key];
    }

    // 设置配置项的值，并重新验证配置
    public set(key: keyof CoreConfig, value: any): void {
        this.config[key] = value;
        this.validateConfig();
    }
}
