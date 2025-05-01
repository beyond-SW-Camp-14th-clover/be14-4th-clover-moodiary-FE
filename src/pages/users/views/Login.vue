<template>
  <div class="login-page">
    <div class="login-container">
      <div class="logo">
        <router-link to="/">MOODI:ARY</router-link>
      </div>
      <p><span>무디어리</span>에 오신 것을 환영합니다!</p>
      <p class="small-p">
        계정이 없으신가요?
        <router-link to="/signup" class="signup-link underline">회원 가입</router-link>
      </p>

      <input v-model="email" type="email" placeholder="Email address" />
      <input v-model="password" type="password" placeholder="Password" />

      <p class="forgot small-p" @click="goToFindId">아이디를 잊으셨나요?</p>
      <p class="forgot small-p" @click="showForgotModal = true">비밀번호를 잊으셨나요?</p>

      <button class="submit-button" @click="loginUser">로그인</button>
    </div>

    <div class="modal-overlay" v-if="showForgotModal" @click.self="showForgotModal = false">
      <div class="modal-content">
        <h2>비밀번호 재설정</h2>
        <input v-model="resetEmail" type="email" placeholder="가입한 이메일을 입력하세요" />
        <div class="modal-actions">
          <button class="submit-button" @click="submitReset">보내기</button>
          <button class="cancel-button" @click="showForgotModal = false">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const showForgotModal = ref(false)
const resetEmail = ref('')
const router = useRouter()
const authStore = useAuthStore()

async function loginUser() {
  try {
    const res = await axios.post('/user/command/login', {
      email: email.value,
      password: password.value
    })
    const token = res.data.token

    // 1) 로컬스토리지에 저장
    localStorage.setItem('token', token)
    // 2) axios 기본 헤더 설정
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    // 3) Pinia 스토어에 토큰 등록
    authStore.setToken(token)

    router.push('/app/home')
  } catch (err) {
    alert('로그인 실패: ' + (err.response?.data?.message || err.message))
  }
}

function goToFindId() {
  router.push('/findid')
}

async function submitReset() {
  try {
    await axios.post('/user/command/request-password-reset', {
      email: resetEmail.value
    })
    alert(`비밀번호 재설정 링크를 ${resetEmail.value}로 보냈습니다.`)
    showForgotModal.value = false
  } catch (err) {
    alert('메일 전송 실패: ' + (err.response?.data?.message || err.message))
  }
}

</script>

<style scoped>
* {
  font-family: var(--font-pixel);
}

span {
  font-size: 20px;
}

.logo a {
  width: 250px;
  color: #A17C59;
  font-family: var(--font-pixel);
  font-size: 2rem;
  font-weight: 800;
  text-decoration: none;
  text-shadow: -1px -1px 0 var(--color-beige);
}

.login-page {
  background-color: var(--color-beige);
  height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  background-color: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: var(--font-omyu);
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;
  margin: 0;
  line-height: 1.4;
}

.login-container p {
  margin: 0;
}

input {
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 10px;
  width: 100%;
}

.signup-link {
  color: var(--color-green);
  font-weight: bold;
}

.forgot {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  text-decoration: underline dotted;
}

.submit-button {
  all: unset;
  background-color: #A17C59;
  color: white;
  padding: 12px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  width: 100%;
  margin-top: 8px;
}

.submit-button:hover {
  background-color: #8b4e3b;
}

.cancel-button {
  all: unset;
  background: none;
  padding: 12px;
  color: #666;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  width: 48%;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px 40px;
  border-radius: 20px;
  text-align: center;
  font-family: var(--font-omyu);
  animation: pop 0.3s ease;
  width: 350px;
}

.modal-content h2 {
  font-size: 20px;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

@keyframes pop {
  from {
    transform: scale(0.8);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>