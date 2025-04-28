<template>
    <div class="page-wrapper">
        <form ref="formRef" class="signup-form" @submit.prevent="submitForm">
            <div class="emoji">😊</div>

            <div class="form-contents">
                <p><span>무디어리</span>에 오신 것을 환영합니다!</p>

                <div class="form-inputs">
                    <!-- 이메일 -->
                    <div class="form-group">
                        <input ref="emailRef" v-model="email" @input="(e) => { validateEmail(); moveCursorToEnd(e) }"
                            @keydown.enter="handleEnter(passwordRef)" type="text" placeholder="Email address" required
                            :class="{ 'input-error': emailError }" />
                        <p v-if="emailError" class="error">{{ emailError }}</p>
                    </div>

                    <!-- 비밀번호 -->
                    <div class="form-group">
                        <input ref="passwordRef" v-model="password" :type="passwordInputType" placeholder="Password"
                            required @input="handlePasswordInput" @focus="focusPasswordInput"
                            @keydown.enter="handleEnter(confirmPasswordRef)" @mousedown="showPassword"
                            @mouseup="hidePassword" @mouseleave="hidePassword"
                            :class="{ 'input-error': passwordError }" />
                        <div v-if="password.length > 0" class="password-checklist">
                            <p :class="{ success: passwordChecks.lowercaseAndNumber }">- 소문자+숫자 조합</p>
                            <p :class="{ success: passwordChecks.lengthValid }">- 8자 이상 16자 이하</p>
                            <p :class="{ success: passwordChecks.specialChar }">- 특수문자 포함 가능(optional)</p>
                        </div>
                    </div>

                    <!-- 비밀번호 확인 -->
                    <div class="form-group">
                        <input ref="confirmPasswordRef" v-model="confirmPassword" :type="confirmPasswordInputType"
                            placeholder="Confirm Password" required @input="handleConfirmPasswordInput"
                            @focus="focusConfirmPasswordInput" @keydown.enter="handleEnter(nameRef)"
                            @mousedown="showConfirmPassword" @mouseup="hideConfirmPassword"
                            @mouseleave="hideConfirmPassword" :class="{ 'input-error': confirmPasswordError }" />
                        <p v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</p>
                    </div>

                    <!-- 이름 -->
                    <div class="form-group">
                        <input ref="nameRef" v-model="name" type="text" placeholder="Name" required
                            @input="moveCursorToEnd" @keydown.enter="handleEnter(phoneRef)" />
                    </div>

                    <!-- 휴대폰 번호 -->
                    <div class="form-group">
                        <input ref="phoneRef" v-model="phone" @input="handlePhoneInput"
                            @keydown.enter="handleEnter(securityAnswerRef)" type="text" placeholder="Phone Number"
                            required :class="{ 'input-error': phoneError }" />
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
                        <input ref="securityAnswerRef" v-model="securityAnswer" type="text" placeholder="아이디 찾기 답변"
                            required @input="moveCursorToEnd" @keydown.enter="submitForm" />
                    </div>
                </div>
            </div>

            <button type="submit" class="button submit-button">회원 가입</button>

            <div class="login-link">
                이미 계정이 있으신가요? <router-link to="/login" class="underline">로그인</router-link>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
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

const emailRef = ref(null)
const passwordRef = ref(null)
const confirmPasswordRef = ref(null)
const nameRef = ref(null)
const phoneRef = ref(null)
const securityAnswerRef = ref(null)

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

// 엔터 입력 시 다음 input으로 포커스 이동
const handleEnter = (nextFieldRef) => {
    nextTick(() => {
        nextFieldRef?.value?.focus()
    })
}

// 커서 맨 뒤로 이동
const moveCursorToEnd = () => {
    nextTick(() => {
        const input = phoneRef.value
        if (input) {
            const length = input.value.length
            input.setSelectionRange(length, length)
        }
    })
}

// 이메일 검증
const validateEmail = () => {
    const value = email.value.trim()

    if (value === '') {
        emailError.value = '이메일을 입력해 주세요.'
        return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    emailError.value = emailRegex.test(value) ? '' : '올바른 이메일 형식이 아닙니다.'
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

// 비밀번호 입력 핸들러
const handlePasswordInput = (e) => {
    password.value = e.target.value
    validatePassword()
    moveCursorToEnd(e)
}

// 비밀번호 확인 입력 핸들러
const handleConfirmPasswordInput = (e) => {
    confirmPassword.value = e.target.value
    validateConfirmPassword()
    moveCursorToEnd(e)
}

// 비밀번호 보기/숨기기
const showPassword = (e) => {
    passwordInputType.value = 'text'
    moveCursorToEnd(e)
}
const hidePassword = (e) => {
    passwordInputType.value = 'password'
    moveCursorToEnd(e)
}
const showConfirmPassword = (e) => {
    confirmPasswordInputType.value = 'text'
    moveCursorToEnd(e)
}
const hideConfirmPassword = (e) => {
    confirmPasswordInputType.value = 'password'
    moveCursorToEnd(e)
}

// 휴대폰 번호 포맷 + validate 같이 처리
const handlePhoneInput = (e) => {
    formatPhone()        // 이벤트 기반으로 포맷
    validatePhone()       // 포맷 이후에 검증
    moveCursorToEnd()    // 커서 맨 뒤로 이동
}

// 휴대폰 번호 포맷
const formatPhone = () => {
    let cleaned = phone.value.replace(/\D/g, '') // phone.value를 직접 정제

    if (cleaned.length > 11) {
        cleaned = cleaned.slice(0, 11)
    }

    let formatted = ''

    if (cleaned.length > 3 && cleaned.length <= 7) {
        formatted = cleaned.replace(/(\d{3})(\d+)/, '$1-$2')
    } else if (cleaned.length > 7) {
        formatted = cleaned.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
    } else {
        formatted = cleaned
    }

    phone.value = formatted // 이 결과를 덮어쓰기
}

// 휴대폰 번호 검증
const validatePhone = () => {
    const cleaned = phone.value.replace(/-/g, '')

    if (cleaned.length !== 11) {
        phoneError.value = '휴대폰 번호는 11자리여야 합니다.'
        return
    }

    if (!cleaned.startsWith('010')) {
        phoneError.value = '휴대폰 번호는 010으로 시작해야 합니다.'
        return
    }

    // const phoneFormatRegex = /^010-\d{4}-\d{4}$/
    // if (!phoneFormatRegex.test(phone.value)) {
    //     phoneError.value = '휴대폰 번호는 010-1234-5678 형식이어야 합니다.'
    //     return
    // }

    phoneError.value = ''
}

// 아이디 질문 선택 검증
const validateQuestion = () => {
    questionError.value = selectedQuestion.value ? '' : '아이디 찾기 질문을 선택해 주세요.'
}

// 폼 제출
const submitForm = () => {
    validateEmail()
    validatePassword()
    validateConfirmPassword()
    validatePhone()
    validateQuestion()

    if (emailError.value || passwordError.value || confirmPasswordError.value || phoneError.value || questionError.value) {
        triggerShake()
        return
    }

    alert('회원 가입이 완료되었습니다!')

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

.page-wrapper {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
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