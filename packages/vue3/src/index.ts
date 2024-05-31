import CoreSDK from '@websaw/core';
const WebSaw = {
    install(app, options) {
        console.log('SimpleTracing plugin installed with options:', options)
        let config = new CoreSDK(options);
        app.config.globalProperties.$webSaw = config;
    }
}


export default WebSaw