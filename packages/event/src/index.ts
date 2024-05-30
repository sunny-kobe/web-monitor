// packages/event-tracking/src/index.ts
import CoreSDK from '@web-monitor/core';

class EventTracking extends CoreSDK {
    public trackEvent(event: string, data: any) {
        this.log(`Tracking event: ${event}`);
        this.sendRequest('/track', { event, data });
    }
}

export default EventTracking;
