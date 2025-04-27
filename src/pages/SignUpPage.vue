<template>
    <form ref="formRef" class="signup-form" @submit.prevent="submitForm">
        <div class="emoji">😊</div>

        <div class="form-contents">
            <p><span>무디어리</span>에 오신 것을 환영합니다!</p>

            <div class="form-inputs">
                <!-- 이메일 -->
                <div class="form-group">
                    <input v-model="email" @input="validateEmail" type="text" placeholder="Email address" required
                        :class="{ 'input-error': emailError }" />
                    <p v-if="emailError" class="error">{{ emailError }}</p>
                </div>

                <!-- 비밀번호 -->
                <div class="form-group">
                    <input v-model="password" :type="passwordInputType" placeholder="Password" required
                        @mousedown="passwordInputType = 'text'" @mouseup="passwordInputType = 'password'"
                        @mouseleave="passwordInputType = 'password'" @input="validatePassword"
                        :class="{ 'input-error': passwordError }" />
                    <div v-if="password.length > 0" class="password-checklist">
                        <p :class="{ success: passwordChecks.lowercaseAndNumber }">- 소문자+숫자 조합</p>
                        <p :class="{ success: passwordChecks.specialChar }">- 특수문자 포함 가능</p>
                        <p :class="{ success: passwordChecks.lengthValid }">- 8자 이상 16자 이하</p>
                    </div>
                </div>

                <!-- 비밀번호 확인 -->
                <div class="form-group">
                    <input v-model="confirmPassword" :type="confirmPasswordInputType" placeholder="Confirm Password"
                        required @mousedown="confirmPasswordInputType = 'text'"
                        @mouseup="confirmPasswordInputType = 'password'"
                        @mouseleave="confirmPasswordInputType = 'password'" @input="validateConfirmPassword"
                        :class="{ 'input-error': confirmPasswordError }" />
                    <p v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</p>
                </div>

                <!-- 이름 -->
                <div class="form-group">
                    <input v-model="name" type="text" placeholder="Name" required />
                </div>

                <!-- 휴대폰 번호 -->
                <div class="form-group">
                    <input v-model="phone" @input="formatPhone" type="text" placeholder="Phone Number" required
                        :class="{ 'input-error': phoneError }" />
                    <p v-if="phoneError" class="error">{{ phoneError }}</p>
                </div>

                <!-- 아이디 찾기 질문 -->
                <div class="form-group">
                    <select v-model="selectedQuestion" @change="validateQuestion" required class="select-box"
                        :class="{ 'input-error': questionError }">
                        <option value="" disabled>아이디 찾기 질문을 선택하세요</option>
                        <option v-for="question in securityQuestions" :key="question" :value="question">
                            {{ question }}
                        </option>
                    </select>
                    <p v-if="questionError" class="error">{{ questionError }}</p>
                </div>

                <!-- 아이디 찾기 답변 -->
                <div class="form-group">
                    <input v-model="securityAnswer" type="text" placeholder="아이디 찾기 답변" required />
                </div>
            </div>
        </div>

        <button type="submit" class="button submit-button">회원 가입</button>

        <div class="login-link">
            이미 계정이 있으신가요? <router-link to="/login" class="underline">로그인</router-link>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formRef = ref(null)

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const phone = ref('')
const selectedQuestion = ref('')
const securityAnswer = ref('')

const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const phoneError = ref('')
const questionError = ref('')

const passwordInputType = ref('password')
const confirmPasswordInputType = ref('password')

const passwordChecks = ref({
    lowercaseAndNumber: false,
    specialChar: false,
    lengthValid: false,
})

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
    '나의 꿈의 직업은 무엇입니까?',
]

// 이메일 검증
const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    emailError.value = emailRegex.test(email.value) ? '' : '올바른 이메일 형식이 아닙니다.'
}

// 비밀번호 검증
const validatePassword = () => {
    const lowercaseAndNumberRegex = /^(?=.*[a-z])(?=.*\d)/
    const specialCharRegex = /[^a-zA-Z0-9]/
    const lengthValid = password.value.length >= 8 && password.value.length <= 16

    passwordChecks.value.lowercaseAndNumber = lowercaseAndNumberRegex.test(password.value)
    passwordChecks.value.specialChar = specialCharRegex.test(password.value)
    passwordChecks.value.lengthValid = lengthValid

    passwordError.value = (passwordChecks.value.lowercaseAndNumber && passwordChecks.value.lengthValid)
        ? ''
        : '비밀번호 조건을 만족해야 합니다.'
}

// 비밀번호 확인 검증
const validateConfirmPassword = () => {
    confirmPasswordError.value = (password.value === confirmPassword.value)
        ? ''
        : '비밀번호가 일치하지 않습니다.'
}

// 폰 번호 포맷
const formatPhone = () => {
    let cleaned = phone.value.replace(/\D/g, '')
    if (!cleaned.startsWith('010')) {
        phoneError.value = '휴대폰 번호는 010으로 시작해야 합니다.'
        return
    }
    if (cleaned.length > 3 && cleaned.length <= 7) {
        phone.value = cleaned.replace(/(\d{3})(\d+)/, '$1-$2')
    } else if (cleaned.length > 7) {
        phone.value = cleaned.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
    }
    phoneError.value = ''
}

// 질문 선택 검증
const validateQuestion = () => {
    questionError.value = selectedQuestion.value ? '' : '아이디 찾기 질문을 선택해 주세요.'
}

// 폼 제출
const submitForm = () => {
    validateEmail()
    validatePassword()
    validateConfirmPassword()
    validateQuestion()

    if (emailError.value || passwordError.value || confirmPasswordError.value || phoneError.value || questionError.value) {
        triggerShake()
        return
    }

    alert('회원 가입이 완료되었습니다!')

    // 초기화
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    name.value = ''
    phone.value = ''
    selectedQuestion.value = ''
    securityAnswer.value = ''

    router.push('/login')
}

// 흔들림 효과
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

.signup-form {
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
    font-size: 0.8rem;
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
    margin-left: 4px;
    text-align: left;
}

.password-checklist {
    text-align: left;
    font-size: 0.8rem;
    margin-top: 4px;
}

.password-checklist p {
    margin: 2px 0;
    color: gray;
}

.password-checklist .success {
    color: var(--color-green);
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