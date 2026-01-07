import NaiveUI from 'naive-ui'
import { createApp } from 'vue'
import App from './App.vue'

const vueApp = createApp(App)
vueApp.use(NaiveUI)
vueApp.mount('#app')
