// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/base.css'
import './assets/styles/fonts.css'

import axios from 'axios'


// axios 기본 엔드포인트 설정
axios.defaults.baseURL = 'http://localhost:8080'  // 실제 백엔드 URL로 변경

// 로컬스토리지에 저장된 토큰이 있으면 모든 요청에 Authorization 헤더 붙이기
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const app = createApp(App)
const pinia = createPinia()

app.config.globalProperties.$axios = axios
app.use(router)
app.use(pinia)
app.mount('#app')
