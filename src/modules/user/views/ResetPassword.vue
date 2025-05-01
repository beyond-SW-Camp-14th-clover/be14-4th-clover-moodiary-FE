<template>
    <div class="reset-page">
      <div class="reset-container">
        <h2>🔐 비밀번호 재설정</h2>
        <input v-model="newPassword" type="password" placeholder="새 비밀번호 입력" />
        <input v-model="confirmPassword" type="password" placeholder="비밀번호 확인" />
  
        <p v-if="error" class="error-msg">{{ error }}</p>
  
        <button @click="submitReset" class="submit-btn">재설정 완료</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import axios from 'axios'
  
  const newPassword = ref('')
  const confirmPassword = ref('')
  const error = ref('')
  const router = useRouter()
  const route = useRoute()
  
  const submitReset = async () => {
    if (newPassword.value !== confirmPassword.value) {
      error.value = '비밀번호가 일치하지 않습니다.'
      return
    }
  
    try {
      await axios.post('/user/command/reset-password', {
        token: route.query.token,
        newPassword: newPassword.value
      })
      alert('비밀번호가 성공적으로 변경되었습니다.')
      router.push('/login')
    } catch (e) {
      error.value = e.response?.data?.message || '오류가 발생했습니다.'
    }
  }
  </script>
  
  <style scoped>
  .reset-page {
    background-color: var(--color-beige);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .reset-container {
    background-color: white;
    padding: 40px;
    border-radius: 16px;
    width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    font-family: var(--font-omyu);
    text-align: center;
  }
  
  input {
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    border: 2px solid #ccc;
    border-radius: 10px;
    font-size: 16px;
  }
  
  .submit-btn {
    all: unset;
    margin-top: 20px;
    background-color: #A17C59;
    color: white;
    padding: 12px;
    width: 100%;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .error-msg {
    color: red;
    font-size: 14px;
    margin-top: 8px;
  }
  </style>
  