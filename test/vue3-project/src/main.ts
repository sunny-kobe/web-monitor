import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/global.scss'
import WebSaw from '@websaw/vue3';

const app = createApp(App)

app.use(router)
app.use(WebSaw, {
    coreConfig: {
        appId: 'your-app-id',
        reportUrl: 'https://your-report-url.com',
        debug: true,
    },
    callback: (event) => {
        console.log('Click event detected:', event);
    }
})

app.mount('#app')
