<template>
    <div class="page-wrapper">
      <form ref="formRef" class="findid-form" @submit.prevent="submitForm">
        <div class="logo">
          <router-link to="/app/home">MOODI:ARY</router-link>
        </div>
  
        <div class="form-contents">
          <p><span>무디어리</span>에서 아이디 찾기</p>
  
          <div class="form-inputs">
            <!-- 이름 입력 -->
            <div class="form-group">
              <input v-model="name" type="text" placeholder="이름" required />
            </div>
  
            <!-- 전화번호 입력 -->
            <div class="form-group">
              <input
                v-model="phone"
                type="tel"
                placeholder="휴대폰 번호(010-xxxx-xxxx)"
                required
              />
            </div>
  
            <!-- 질문 선택 -->
            <div class="form-group">
              <select
                v-model="selectedQuestion"
                @change="validateQuestion"
                required
                class="select-box"
                :class="{ 'input-error': questionError }"
              >
                <option value="" disabled>
                  아이디 찾기 질문을 선택하세요
                </option>
                <option
                  v-for="(question, idx) in securityQuestions"
                  :key="idx"
                  :value="idx + 1"
                >
                  {{ question }}
                </option>
              </select>
              <p v-if="questionError" class="error">{{ questionError }}</p>
            </div>
  
            <!-- 답변 입력 -->
            <div class="form-group">
              <input
                v-model="answer"
                type="text"
                placeholder="답변"
                required
                :class="{ 'input-error': answerError }"
              />
              <p v-if="answerError" class="error">{{ answerError }}</p>
            </div>
          </div>
        </div>
  
        <button type="submit" class="button submit-button">아이디 찾기</button>
  
        <div class="login-link">
          기억나서 로그인하기?
          <router-link to="/login" class="underline">로그인</router-link>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const formRef = ref(null)
  const name = ref('')
  const phone = ref('')
  const selectedQuestion = ref('')
  const answer = ref('')
  const questionError = ref('')
  const answerError = ref('')
  
  const securityQuestions = [
    '당신의 어릴 적 별명은 무엇입니까?',
    '어머니의 성함은 무엇입니까?',
    '당신이 태어난 도시 이름은 무엇입니까?',
    '첫 번째로 키운 반려동물의 이름은 무엇입니까?',
    '당신이 졸업한 초등학교 이름은 무엇입니까?',
    '졸업한 고등학교 이름은 무엇입니까?',
    '처음 근무했던 회사 이름은 무엇입니까?',
    '기억에 남는 선생님의 이름은 무엇입니까?',
    '인생에서 처음 본 영화는 무엇입니까?',
    '나의 꿈의 직업은 무엇입니까?'
  ]
  
  // 선택 검증
  const validateQuestion = () => {
    questionError.value = selectedQuestion.value ? '' : '질문을 선택해 주세요.'
  }
  const validateAnswer = () => {
    answerError.value = answer.value.trim() ? '' : '답변을 입력해 주세요.'
  }
  
  // 실제 서버 호출
  const submitForm = async () => {
    validateQuestion()
    validateAnswer()
  
    if (questionError.value || answerError.value) {
      triggerShake()
      return
    }
  
    // payload 준비
    const payload = {
      name: name.value.trim(),
      phoneNumber: phone.value,
      registerQuestionsId: String(selectedQuestion.value),
      answer: answer.value.trim()
    }
  
    try {
      const res = await axios.post('/user/query/email', payload)
      // 성공 시 이메일을 alert
      alert(`찾은 이메일: ${res.data.email}`)
      router.push('/login')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.email ||
        err.message ||
        '알 수 없는 오류'
      alert(`아이디 찾기에 실패했습니다:\n${msg}`)
    }
  }
  
  const triggerShake = () => {
    if (!formRef.value) return
    formRef.value.classList.remove('shake')
    void formRef.value.offsetWidth
    formRef.value.classList.add('shake')
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
    color: #a17c59;
    font-family: var(--font-pixel);
    font-size: 2rem;
    font-weight: 800;
    text-decoration: none;
    text-shadow: -1px -1px 0 var(--color-beige);
  }
  
  .page-wrapper {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .findid-form {
    background-color: white;
    padding: 2rem 2.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    text-align: center;
    margin: 40px auto;
  }
  
  .form-contents {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 1rem;
  }
  
  .form-inputs {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
  
  input,
  select {
    width: 100%;
    padding: 12px 16px;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    outline: none;
  }
  
  input:focus,
  select:focus {
    border-color: var(--color-green);
  }
  
  .input-error {
    border-color: red;
  }
  
  .error {
    color: red;
    font-size: 0.8rem;
    margin-top: 4px;
    text-align: left;
  }
  
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-8px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(8px);
    }
  }
  
  .shake {
    animation: shake 0.5s;
  }
  
  .login-link {
    margin-top: 1rem;
    font-size: 0.8rem;
  }
  
  .underline {
    text-decoration: underline;
  }
  </style>
  