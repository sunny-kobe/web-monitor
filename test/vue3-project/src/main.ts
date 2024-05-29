import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import WebSaw from '@websaw/vue3';

const app = createApp(App)

app.use(router)
app.use(WebSaw, {
    dsn: '/trackweb',
    appName: 'cxh',
    debug: true
})

app.mount('#app')
