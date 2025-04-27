<template>
    <form ref="formRef" class="findid-form" @submit.prevent="submitForm">
        <div class="emoji">😊</div>

        <div class="form-contents">
            <p><span>무디여리</span>에서 아이디 찾기</p>

            <div class="form-inputs">
                <!-- 질문 선택 -->
                <div class="form-group">
                    <select v-model="selectedQuestion" @change="validateQuestion" required class="select-box"
                        :class="{ 'input-error': questionError }">
                        <option value="" disabled>비밀번호 찾기 질문을 선택하세요</option>
                        <option v-for="question in securityQuestions" :key="question" :value="question">
                            {{ question }}
                        </option>
                    </select>
                    <p v-if="questionError" class="error">{{ questionError }}</p>
                </div>

                <!-- 답변 입력 -->
                <div class="form-group">
                    <input v-model="answer" type="text" placeholder="답변" required />
                </div>
            </div>
        </div>

        <button type="submit" class="button submit-button">아이디 찾기</button>

        <div class="login-link">
            기억나어서 로그인하기? <router-link to="/login" class="underline">로그인</router-link>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formRef = ref(null)
const selectedQuestion = ref('')
const answer = ref('')
const questionError = ref('')

const securityQuestions = [
    '당신의 어린 적 별명은 무엇입니까?',
    '어마니의 성함은 무엇입니까?',
    '당신이 태어난 동아 이름은 무엇입니까?',
    '첫 번째로 키우던 반려동물의 이름은 무엇입니까?',
    '당신이 조료한 천부학교 이름은 무엇입니까?',
    '교천 고등학교 이름은 무엇입니까?',
    '첫 근무 했던 회사 이름은 무엇입니까?',
    '기억에 남는 선생님의 이름은 무엇입니까?',
    '인상에서 첫 번째로 보은 영화는 무엇입니까?',
    '나의 꿔어진 지역은 무엇입니까?',
]

const validateQuestion = () => {
    questionError.value = selectedQuestion.value ? '' : '질문을 선택해주세요.'
}

const submitForm = () => {
    validateQuestion()

    if (questionError.value) {
        triggerShake()
        return
    }

    alert('\uac80색\uacb0과!')
    router.push('/login')
}

const triggerShake = () => {
    if (formRef.value) {
        formRef.value.classList.remove('shake')
        void formRef.value.offsetWidth
        formRef.value.classList.add('shake')
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

.emoji {
    font-size: 2.5rem;
    margin-bottom: 1rem;
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
</style>