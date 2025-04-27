<template>
    <div class="signup-wrapper">
        <form class="signup-form" @submit.prevent="submitForm">
            <div class="emoji">😊</div>
            <h2>무디어리에 오신 것을 환영합니다!</h2>

            <div class="form-group">
                <input v-model="email" type="email" placeholder="Email address" required />
            </div>

            <div class="form-group">
                <input v-model="password" type="password" placeholder="Password" required />
            </div>

            <div class="form-group">
                <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
            </div>

            <div class="form-group">
                <input v-model="name" type="text" placeholder="Name" required />
            </div>

            <div class="form-group">
                <input v-model="phone" type="text" placeholder="Phone Number" required />
            </div>

            <div class="form-group">
                <input v-model="securityQuestion" type="text" placeholder="Password Recovery Question" required />
            </div>

            <div class="form-group">
                <input v-model="securityAnswer" type="text" placeholder="Password Recovery Answer" required />
            </div>

            <button type="submit" class="button submit-button regist">회원가입</button>

            <div class="login-link">
                이미 계정이 있으신가요? <router-link to="/login">로그인</router-link>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const phone = ref('')
const securityQuestion = ref('')
const securityAnswer = ref('')

const submitForm = () => {
    if (password.value !== confirmPassword.value) {
        alert('비밀번호가 일치하지 않습니다.')
        return
    }

    const userData = {
        email: email.value,
        password: password.value,
        name: name.value,
        phone: phone.value,
        securityQuestion: securityQuestion.value,
        securityAnswer: securityAnswer.value,
    }

    console.log('회원가입 데이터:', userData)
    alert('회원가입이 완료되었습니다!')

    // 여기서 실제 API 호출하거나, router.push('/login') 가능
}
</script>

<style scoped>
.signup-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    /* height → min-height */
    padding: 1rem;
}

.signup-form {
    background-color: white;
    padding: 2rem 2.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

.emoji {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

h2 {
    margin-bottom: 2rem;
    font-size: 1.5rem;
    color: var(--color-brown);
}

.form-group {
    margin-bottom: 1rem;
}

input {
    width: 100%;
    padding: 12px 16px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    outline: none;
}

input:focus {
    border-color: var(--color-green);
}

.login-link {
    margin-top: 1rem;
    font-size: 0.9rem;
}

.regist {
    font-size: 0.8rem;
}
</style>