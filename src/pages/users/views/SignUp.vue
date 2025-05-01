<template>
    <div class="page-wrapper">
        <form ref="formRef" class="signup-form" @submit.prevent="submitForm">
            <div class="logo">
                <router-link to="/">MOODI:ARY</router-link>
            </div>

            <div class="form-contents">
                <p><span>무디어리</span>에 오신 것을 환영합니다!</p>

                <div class="form-inputs">
                    <!-- 이메일 -->
                    <div class="form-group">
                        <input ref="emailRef" v-model="email" type="text" placeholder="Email address" required
                            @input="handleEmailInput" @focus="() => moveCursorToEnd(emailRef)"
                            @keydown.enter="handleEnter(passwordRef)" :class="{ 'input-error': emailError }" />
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
                            @input="() => moveCursorToEnd(nameRef)" @focus="() => moveCursorToEnd(nameRef)"
                            @keydown.enter="handleEnter(phoneRef)" />
                    </div>

                    <!-- 휴대폰 번호 -->
                    <div class="form-group">
                        <input ref="phoneRef" v-model="phone" type="text" placeholder="Phone Number" required
                            @input="handlePhoneInput" @focus="() => moveCursorToEnd(phoneRef)"
                            @keydown.enter="handleEnter(securityAnswerRef)" :class="{ 'input-error': phoneError }" />
                        <p v-if="phoneError" class="error">{{ phoneError }}</p>
                    </div>

                    <!-- 아이디 찾기 질문 -->
                    <div class="form-group">
                        <select v-model="selectedQuestion" required @change="validateQuestion"
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
                            required @input="() => moveCursorToEnd(securityAnswerRef)"
                            @focus="() => moveCursorToEnd(securityAnswerRef)" @keydown.enter="submitForm" />
                    </div>
                </div>
            </div>

            <button type="submit" class="button submit-button" :disabled="!isFormValid">
                회원 가입
            </button>

            <div class="login-link">
                이미 계정이 있으신가요?
                <router-link to="/login" class="underline">로그인</router-link>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)

// form fields
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const phone = ref('')
const selectedQuestion = ref('')
const securityAnswer = ref('')

// errors
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const phoneError = ref('')
const questionError = ref('')

// input types for visibility toggle
const passwordInputType = ref('password')
const confirmPasswordInputType = ref('password')

// refs for cursor/focus control
const emailRef = ref(null)
const passwordRef = ref(null)
const confirmPasswordRef = ref(null)
const nameRef = ref(null)
const phoneRef = ref(null)
const securityAnswerRef = ref(null)

// password checklist
const passwordChecks = ref({
    lowercaseAndNumber: false,
    specialChar: false,
    lengthValid: false
})

// security questions list
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

// focus helper
const handleEnter = nextFieldRef => {
    nextTick(() => nextFieldRef?.value?.focus())
}
const moveCursorToEnd = refEl => {
    nextTick(() => {
        const input = refEl?.value
        if (input) {
            const len = input.value.length
            input.setSelectionRange(len, len)
        }
    })
}

// validators & formatters
const handleEmailInput = () => { validateEmail(); moveCursorToEnd(emailRef) }
function validateEmail() {
    const val = email.value.trim()
    if (!val) return (emailError.value = '이메일을 입력해 주세요.')
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    emailError.value = re.test(val) ? '' : '올바른 이메일 형식이 아닙니다.'
}

const handlePasswordInput = () => { validatePassword(); moveCursorToEnd(passwordRef) }
function validatePassword() {
    const lowerNum = /^(?=.*[a-z])(?=.*\d)/.test(password.value)
    const special = /[^A-Za-z0-9]/.test(password.value)
    const lenValid = password.value.length >= 8 && password.value.length <= 16
    passwordChecks.value = { lowercaseAndNumber: lowerNum, specialChar: special, lengthValid: lenValid }
    passwordError.value = lowerNum && lenValid ? '' : '비밀번호 조건을 만족해야 합니다.'
}

const handleConfirmPasswordInput = () => { validateConfirmPassword(); moveCursorToEnd(confirmPasswordRef) }
function validateConfirmPassword() {
    confirmPasswordError.value = password.value === confirmPassword.value ? '' : '비밀번호가 일치하지 않습니다.'
}

// show/hide password
const showPassword = () => (passwordInputType.value = 'text')
const hidePassword = () => (passwordInputType.value = 'password')
const showConfirmPassword = () => (confirmPasswordInputType.value = 'text')
const hideConfirmPassword = () => (confirmPasswordInputType.value = 'password')

const handlePhoneInput = () => { formatPhone(); validatePhone(); moveCursorToEnd(phoneRef) }
function formatPhone() {
    let cleaned = phone.value.replace(/\D/g, '')
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11)
    if (cleaned.length > 7) phone.value = cleaned.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
    else if (cleaned.length > 3) phone.value = cleaned.replace(/(\d{3})(\d+)/, '$1-$2')
    else phone.value = cleaned
}
function validatePhone() {
    const num = phone.value.replace(/-/g, '')
    if (!num.startsWith('010')) return (phoneError.value = '휴대폰 번호는 010으로 시작해야 합니다.')
    if (num.length !== 11) return (phoneError.value = '휴대폰 번호는 11자리여야 합니다.')
    phoneError.value = ''
}

function validateQuestion() {
    questionError.value = selectedQuestion.value ? '' : '아이디 찾기 질문을 선택해 주세요.'
}

// shake animation
function triggerShake() {
    const el = formRef.value
    if (!el) return
    el.classList.remove('shake')
    void el.offsetWidth
    el.classList.add('shake')
}

// 전체 form valid 상태
const isFormValid = computed(() =>
    email.value &&
    password.value &&
    confirmPassword.value &&
    name.value &&
    phone.value &&
    selectedQuestion.value &&
    securityAnswer.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value &&
    !phoneError.value &&
    !questionError.value
)

// submit handler
async function submitForm() {
    // 1) client-side validation
    validateEmail()
    validatePassword()
    validateConfirmPassword()
    validatePhone()
    validateQuestion()
    if (emailError.value || passwordError.value || confirmPasswordError.value || phoneError.value || questionError.value) {
        triggerShake()
        return
    }

    // 2) 서버 호출
    try {
        await axios.post('/user/command/register', {
            email: email.value,
            password: password.value,
            name: name.value,
            // phoneNumber: phone.value.replace(/-/g, ''),
            phoneNumber: phone.value,
            registerQuestionsId: securityQuestions.indexOf(selectedQuestion.value) + 1,
            answer: securityAnswer.value
        })
        alert('회원 가입이 완료되었습니다!')
        // 3) 초기화 & redirect
        email.value = ''
        password.value = ''
        confirmPassword.value = ''
        name.value = ''
        phone.value = ''
        selectedQuestion.value = ''
        securityAnswer.value = ''
        router.push('/login')
    } catch (err) {
        console.error(err)
        alert('회원가입 실패: ' + (err.response?.data?.message || err.message))
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

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>