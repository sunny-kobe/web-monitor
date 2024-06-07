// packages/event/src/index.ts
import { BaseModule, CoreSDK } from '@websaw/core';

class EventTracking extends BaseModule {

    public init(): void {
        super.init();
        // 初始化事件跟踪逻辑
        this.eventBus.on('trackEvent', this.trackEvent.bind(this));
    }

    private trackEvent(event: any): void {
        // 事件处理逻辑
        console.log('Tracking event:', event);
    }
}

// 使用核心模块
const coreConfig = {
    appId: 'your-app-id',
    reportUrl: 'https://your-report-url.com',
};

const coreSDK = new CoreSDK(coreConfig);
const eventTrackingModule = new EventTracking({
    config: coreSDK.getConfig(),
    eventBus: coreSDK.getEventBus(),
});

coreSDK.registerModule(eventTrackingModule);
