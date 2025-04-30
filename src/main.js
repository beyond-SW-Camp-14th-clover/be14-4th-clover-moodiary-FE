import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/base.css'
import './assets/styles/fonts.css'
import axios from 'axios'

const app = createApp(App);
const pinia = createPinia()

// axios 기본 설정
axios.defaults.baseURL = 'http://localhost:8080'

app.use(router);
app.use(pinia)
app.mount('#app');
