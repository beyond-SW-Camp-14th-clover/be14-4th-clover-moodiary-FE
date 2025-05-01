<template>
    <div>
      <div class="my-page-inner">
        <form @submit.prevent="updateUser">
          <h1>내 정보</h1><br />
          <div class="my-page-info-row">
            <h1>이름: </h1>
            <input v-model="form.name" type="text" required />
          </div><br />
          <div class="my-page-info-row">
            <h1>이메일: </h1>
            <input v-model="form.email" type="email" required disabled />
          </div><br />
          <div class="my-page-info-row">
            <h1>전화번호: </h1>
            <input v-model="form.phoneNumber" type="text" required />
          </div><br />
  
          <div class="btn-row">
            <button type="submit" class="submit-btn">수정하기</button>
            <button type="button" class="delete-btn" @click="showModal = true">탈퇴하기</button>
          </div>
        </form>
      </div>
  
      <!-- 비밀번호 확인 모달 -->
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <h2>비밀번호 확인</h2>
          <input v-model="password" type="password" placeholder="비밀번호를 입력하세요" />
          <div class="modal-actions">
            <button class="confirm-btn" @click="confirmDelete">확인</button>
            <button class="cancel-btn" @click="showModal = false">취소</button>
          </div>
          <p class="error-msg" v-if="error">{{ error }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth.js';
  import { useRouter } from 'vue-router'
  
  const store = useAuthStore()
  const router = useRouter()
  
  const dummy_user = {
    id: 0,
    name: "꼼곰보",
    email: "rhtjddus@gmail.com",
    phoneNumber: "010-1234-5678",
  }
  
  const form = ref({ ...dummy_user })
  const message = ref('')
  const password = ref('')
  const error = ref('')
  const showModal = ref(false)
  
  const fetchUser = async () => {
    try {
      const res = await axios.get(`/user/query/me`, {
        headers: { 'Authorization': `Bearer ${store.token}` }
      })
      form.value = res.data
    } catch (err) {
      message.value = '사용자 정보를 불러오지 못했습니다. 더미 데이터를 표시합니다.'
      form.value = { ...dummy_user }
    }
  }
  
  const updateUser = async () => {
    try {
      await axios.put(`/user/command/update`, form.value)
      alert('수정이 완료되었습니다.')
    } catch (err) {
      alert('수정 실패')
    }
  }
  
  const confirmDelete = async () => {
    try {
      // 1. 비밀번호 검증
      await axios.post(`/user/command/login`, {
        email: form.value.email,
        password: password.value
      })
  
      // 2. 회원 탈퇴 요청
      await axios.post(`/user/command/delete`, null, {
        headers: { 'Authorization': `Bearer ${store.token}` }
      })
  
      alert('회원 탈퇴가 완료되었습니다.')
      store.clear()
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      router.push('/')
    } catch (err) {
      error.value = '비밀번호가 일치하지 않습니다.'
    }
  }
  
  onMounted(fetchUser)
  </script>
  
  <style scoped>
  .my-page-inner {
    padding: 20px 10%;
  }
  .my-page-info-row {
    display: flex;
    justify-content: space-between;
  }
  input {
    padding: 12px 24px;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 10px;
    width: 70%;
    font-family: var(--font-omyu);
  }
  .btn-row {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 20px;
  }
  .submit-btn {
    all: unset;
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
  }
  .delete-btn {
    all: unset;
    background-color: #b94c4c;
    color: white;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 360px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  .modal input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin-top: 12px;
    border: 2px solid #ccc;
    border-radius: 8px;
  }
  .modal-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
  .confirm-btn, .cancel-btn {
    all: unset;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    width: 48%;
    text-align: center;
  }
  .confirm-btn {
    background-color: #a17c59;
    color: white;
  }
  .cancel-btn {
    background-color: #eee;
  }
  .error-msg {
    margin-top: 12px;
    color: red;
    font-size: 14px;
  }
  </style>
  