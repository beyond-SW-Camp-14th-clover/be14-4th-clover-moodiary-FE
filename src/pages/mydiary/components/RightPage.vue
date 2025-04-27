<template>
    <div class="right-page">
        <textarea class="free-writing" placeholder="자유롭게 오늘의 이야기를 적어 보세요 :)" v-model="memo"></textarea>
        <p class="footer-note">오늘의 기록을 칭찬해 주세요 ✨</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const memo = ref('')
</script>

<style scoped>
.right-page {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.free-writing {
    flex: 1;
    width: 100%;
    font-family: 'HandwritingFont', sans-serif;
    font-size: 16px;
    line-height: 2;
    background-color: transparent;
    border: none;
    resize: none;
    outline: none;
}

.footer-note {
    margin-top: 20px;
    font-size: 14px;
    color: #666;
    text-align: right;
    font-family: 'OMYuPretty';
}
</style>