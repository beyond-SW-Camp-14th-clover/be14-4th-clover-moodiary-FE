<template>
    <Teleport to="body">
      <div v-if="show" class="modal-overlay" @click.self="close">
        <div class="modal-container">
          <!-- 여기부터는 기존 login-container 그대로 -->
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
          <!-- /기존 login-container -->
  
          <!-- 비밀번호 재설정 모달 (기존 그대로) -->
          <div
            class="modal-overlay"
            v-if="showForgotModal"
            @click.self="showForgotModal = false"
          >
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
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { useAuthStore } from '@/stores/auth'
  
  const props = defineProps({
    show: Boolean
  })
  const emit = defineEmits(['update:show'])
  
  // 로그인 폼 상태
  const email = ref('')
  const password = ref('')
  
  // 비밀번호 재설정 모달 상태
  const showForgotModal = ref(false)
  const resetEmail = ref('')
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  function close() {
    emit('update:show', false)
  }
  
  async function loginUser() {
    try {
      const res = await axios.post('/user/command/login', {
        email: email.value,
        password: password.value
      })
      const token = res.data.token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      authStore.setToken(token)
      close()
      router.push('/app/home')
    } catch (err) {
      alert('로그인 실패: ' + (err.response?.data?.message || err.message))
    }
  }
  
  function goToFindId() {
    router.push('/findid')
  }
  
  function submitReset() {
    alert(`비밀번호 재설정 링크를 ${resetEmail.value}로 보냈습니다.`)
    showForgotModal.value = false
  }
  </script>
  
  <style scoped>
  /* 모달 오버레이 */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
  }
  /* 모달 컨테이너는 내부에 login-container를 감싸줍니다 */
  .modal-container {
    position: relative;
  }
  
  /* --- 아래부터는 기존 로그인 페이지 스타일 --- */
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
    line-height: 1.4;
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
  .small-p {
    font-size: 0.8rem;
  }
  .signup-link {
    color: var(--color-green);
    font-weight: bold;
  }
  input {
    padding: 12px;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 10px;
    width: 100%;
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
  }
  .submit-button:hover {
    background-color: #8b4e3b;
  }
  /* 비밀번호 재설정 모달 */
  .modal-content {
    background: white;
    padding: 30px 40px;
    border-radius: 20px;
    text-align: center;
    font-family: var(--font-omyu);
    animation: pop 0.3s ease;
    width: 350px;
  }
  .cancel-button {
    all: unset;
    color: #666;
    cursor: pointer;
    text-align: center;
    width: 48%;
  }
  .modal-actions {
    display: flex;
    justify-content: space-between;
  }
  @keyframes pop {
    from { transform: scale(0.8); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  </style>
  