import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import auth from './store/auth'
// import test from './store/test'
import store from './store'
import axiosConfig from './helpers/axios'

axiosConfig()

const app = createApp(App).use(store).use(router)
app.mount('#app')
