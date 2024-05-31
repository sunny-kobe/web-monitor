// packages/core/src/index.ts
import { SDKConfig } from '@websaw/types';

class CoreSDK {
    protected config: SDKConfig;

    constructor(config: SDKConfig) {
        this.config = config;
        if (config.debug) {
            console.log('SDK initialized with config:', config);
        }
    }

    protected log(message: string) {
        if (this.config.debug) {
            console.log('Log:', message);
        }
    }

    protected sendRequest(endpoint: string, data: any) {
        fetch(this.config.apiUrl + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }
}

export default CoreSDK;
