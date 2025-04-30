<template>
    <div class="my-page">
      <!-- 노트 배경 -->
      <div class="notebook">
        <img src="@/assets/landing/open-notebook.png" alt="열린 노트" class="notebook-img" />
        <!-- 왼쪽 페이지 영역 -->
        <div class="page page-left">
          <div class="info-field">
            <label>이름</label>
            <span>{{ user.name }}</span>
          </div>
          <div class="info-field">
            <label>전화번호</label>
            <span>{{ user.phoneNumber }}</span>
          </div>
        </div>
        <!-- 오른쪽 페이지 영역 -->
        <div class="page page-right">
          <div class="info-field">
            <label>이메일</label>
            <span>{{ user.email }}</span>
          </div>
          <div class="info-field">
            <label>가입 질문 ID</label>
            <span>{{ user.registerQuestionsId }}</span>
          </div>
          <div class="info-field answer-field">
            <label>답변</label>
            <span>{{ showAnswer ? user.answer : '••••••••' }}</span>
            <button class="eye-btn" @click="showAnswer = !showAnswer">
              {{ showAnswer ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useAuthStore } from '@/stores/auth'
  
  const authStore = useAuthStore()
  const user = ref({
    name: '',
    email: '',
    phoneNumber: '',
    registerQuestionsId: '',
    answer: ''
  })
  
  const showAnswer = ref(false)
  
  async function loadUserInfo() {
    try {
      // 실제론 로그인 직후 authStore.userId 에 저장된 값을 사용하세요
      const userId = authStore.userId || 1
      const res = await axios.get(`/user/query/info/${userId}`)
      const data = res.data
      user.value.name                = data.name
      user.value.email               = data.email
      user.value.phoneNumber         = data.phoneNumber
      user.value.registerQuestionsId = data.registerQuestionsId
      user.value.answer              = data.answer
    } catch (e) {
      console.error('내 정보 로드 실패', e)
    }
  }
  
  onMounted(loadUserInfo)
  </script>
  
  <style scoped>
  .my-page {
    padding-top: 100px; /* 헤더 여유 */
    display: flex;
    justify-content: center;
  }
  
  /* 노트 컨테이너 */
  .notebook {
    position: relative;
    width: 800px;  /* 원하시는 사이즈로 조정 가능 */
    max-width: 90vw;
  }
  
  /* 노트 이미지 */
  .notebook-img {
    width: 100%;
    display: block;
  }
  
  /* 페이지 공통 위치 */
  .page {
    position: absolute;
    top: 12%; /* 노트 이미지에서 내용이 시작될 대략적인 위치 */
    width: 45%; /* 좌우 페이지 각각 45% 차지 */
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-family: var(--font-omyu);
    color: #333;
  }
  
  /* 왼쪽 페이지 */
  .page-left {
    left: 6%; /* 이미지 왼쪽에서 여백 */
  }
  
  /* 오른쪽 페이지 */
  .page-right {
    right: 6%; /* 이미지 오른쪽에서 여백 */
  }
  
  /* 각 정보 줄 */
  .info-field {
    display: flex;
    align-items: center;
  }
  
  .info-field label {
    width: 100px;
    font-weight: bold;
    color: var(--color-brown);
  }
  
  .info-field span {
    flex: 1;
  }
  
  /* 답변 토글 버튼 */
  .answer-field {
    align-items: center;
  }
  
  .eye-btn {
    all: unset;
    cursor: pointer;
    margin-left: 8px;
    font-size: 18px;
  }
  </style>
  