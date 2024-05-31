// packages/error/src/index.ts
import CoreSDK from '@websaw/core';

class ErrorMonitoring extends CoreSDK {
    constructor(config: SDKConfig) {
        super(config);
        this.initErrorHandler();
    }

    private initErrorHandler() {
        window.addEventListener('error', (event) => {
            this.log('Error captured: ' + event.message);
            this.sendRequest('/error', { message: event.message, stack: event.error?.stack });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.log('Unhandled rejection: ' + event.reason);
            this.sendRequest('/error', { message: event.reason });
        });
    }
}

export default ErrorMonitoring;
