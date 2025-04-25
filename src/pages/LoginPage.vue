<template>
    <div class="login-page">
        <div class="login-container">
            <div class="emoji">😊</div>
            <p><span>무디어리</span>에 오신 것을 환영합니다!</p>
            <p class="small-p">
                계정이 없으신가요?
                <router-link to="/signup" class="signup-link">회원 가입</router-link>
            </p>

            <input v-model="email" type="email" placeholder="Email address" />
            <input v-model="password" type="password" placeholder="Password" />

            <p class="forgot small-p" @click="showForgotModal = true">비밀번호를 잊으셨나요?</p>

            <router-link to="/" class="button submit-button">로그인</router-link>
        </div>

        <!-- 비밀번호 찾기 모달 -->
        <div class="modal-overlay" v-if="showForgotModal" @click.self="showForgotModal = false">
            <div class="modal-content">
                <h2>비밀번호 재설정</h2>
                <input v-model="resetEmail" type="email" placeholder="가입한 이메일을 입력하세요" />
                <div class="modal-actions">
                    <button class="submit-button" @click="submitReset">보내기</button>
                    <button @click="showForgotModal = false">닫기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showForgotModal = ref(false)
const resetEmail = ref('')

function submitReset() {
    alert(`비밀번호 재설정 링크를 ${resetEmail.value}로 보냈습니다.`)
    showForgotModal.value = false
}
</script>

<style scoped>
* {
    font-family: var(--font-pixel);
}

span {
    font-size: 20px;
}

.small-p {
    font-size: 0.8rem;
}

.login-page {
    background-color: var(--color-beige);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container {
    background-color: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    font-family: var(--font-omyu);
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    text-align: center;
}

.emoji {
    font-size: 40px;
}

input {
    padding: 12px;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 10px;
    width: 100%;
}

.signup-link {
    color: var(--color-green);
    text-decoration: underline dotted;
    font-weight: bold;
}

.forgot {
    font-size: 14px;
    color: #666;
    cursor: pointer;
    text-decoration: underline dotted;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px 40px;
    border-radius: 20px;
    text-align: center;
    font-family: var(--font-omyu);
    animation: pop 0.3s ease;
    width: 350px;
}

.modal-content h2 {
    font-size: 20px;
    margin-bottom: 16px;
}

.modal-content input {
    margin-bottom: 16px;
}

.modal-content button {
    margin: 5px;
}

.modal-actions {
    display: flex;
    justify-content: space-between;
}

@keyframes pop {
    from {
        transform: scale(0.8);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>