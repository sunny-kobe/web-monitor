// config.ts

export interface CoreConfig {
    appId: string;
    reportUrl: string;
    debug?: boolean;
}

const defaultConfig: CoreConfig = {
    appId: '',
    reportUrl: '',
    debug: false,
};

export class Config {
    private config: CoreConfig;

    constructor(config: CoreConfig) {
        this.config = { ...defaultConfig, ...config };
        this.validateConfig();
    }

    private validateConfig() {
        if (!this.config.appId) {
            throw new Error('appId is required');
        }
        if (!this.config.reportUrl) {
            throw new Error('reportUrl is required');
        }
    }

    public get(key: keyof CoreConfig): any {
        return this.config[key];
    }

    public set(key: keyof CoreConfig, value: any): void {
        this.config[key] = value;
        this.validateConfig();
    }
}
