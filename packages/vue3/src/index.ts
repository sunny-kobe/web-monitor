const WebSaw = {
    install(app, options) {
        console.log('SimpleTracing plugin installed with options:', options)
        app.config.globalProperties.$webSaw = (message: string) => {
            console.log(`Tracing: ${message}`)
        }
    }
}


export default WebSaw