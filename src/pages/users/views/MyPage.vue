<template>
    <div class="">
        <div v-if="!isLogin" class="main content" style="text-align: center">
            <h1>로그인해야 내 정보를 볼 수 있습니다!</h1>
            <br><br><br>
            <router-link to="/login" class="button submit-button">로그인하러 가기</router-link>
        </div>
        <div v-if="isLogin" class="main content" style="text-align: center; margin-left: 30%; margin-right: 30%;">
            <div class="button-area">
                <router-link to="info" class="my-page-button">
                    <h1>내 정보</h1>
                </router-link>
                <router-link to="pet" class="my-page-button">
                    <h1>펫 변경</h1>
                </router-link>
                <router-link to="recommend" class="my-page-button">
                    <h1>추천 설정</h1>
                </router-link>
            </div>
            <router-view class="my-page-inner" :userId="userId"/>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/auth.js';

    // 설명. 링크로 들어오는 경우에 대비해 로그인 여부 받아오기
    const store = useAuthStore();
    const isLogin = ref(store.isLogin);
</script>

<style scoped>
    .my-page-button {
        flex: 1;
        background-color: var(--color-brown);
        border: 5px solid #8c6239;
        color: white;
        padding-left: 15px;
        padding-right: 15px;
    }

    .button-area {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .my-page-inner {
        border: 5px solid #8C6239;
        background-color: #F9E4BC;
    }
</style>