import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080' 

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/base.css'
import './assets/styles/fonts.css'

import { useAuthStore } from '@/stores/auth'   


const token = localStorage.getItem('token')
const userJson = localStorage.getItem('user')   

const app = createApp(App)
const pinia = createPinia()


app.use(pinia)      
app.use(router)
app.config.globalProperties.$axios = axios

const authStore = useAuthStore()  
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  authStore.setToken(token)
}

if (userJson && userJson !== 'undefined') {
  try {
    const user = JSON.parse(userJson)
    authStore.setUser(user)
    console.log('✅ 유저 복원 성공:', user)
  } catch (e) {
    console.error('❌ 유저 정보 파싱 실패:', e)
  }
}

app.mount('#app')
