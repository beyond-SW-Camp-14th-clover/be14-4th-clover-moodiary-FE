<template>
    <div class="moodlog">
        <div class="moodlog-header">
            <h3>moodlog</h3>
            <button class="save-button">저장</button>
        </div>
        <div class="moodlog-content">
            <div class="moodlog-textbox">
                <textarea v-model="moodlogContent" placeholder="이번 달 나의 기록"></textarea>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const moodlogContent = ref('');

const fetchMoodlog = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const targetMonth = `${year}-${month}-01`;
    const userId = 1;

    try {
        const response = await fetch(`http://localhost:8080/mydiary/moodlog?targetMonth=${targetMonth}&userId=${userId}`);
        if (!response.ok) {
            throw new Error('서버 응답에 문제가 있습니다.');
        }
        const data = await response.json();
        console.log('moodlog 데이터:', data);
        if (data && data.content) {
            moodlogContent.value = data.content;
        }
    } catch (error) {
        console.error('moodlog 데이터를 가져오는 중 오류 발생:', error);
    }
};

onMounted(() => {
    fetchMoodlog();
});
</script>

<style scoped>
.moodlog {
    width: 345px;
    margin-top: 50px;
}

.moodlog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.moodlog-header h3 {
    font-family: var(--font-akshar);
    font-weight: 200;
    font-size: 24px;
    color: #535353;
    margin: 0;
}

.save-button {
    background-color: #FFE7C9 !important;
    color: #535353 !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 4px 12px !important;
    font-family: var(--font-akshar) !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    cursor: pointer !important;
    transition: background-color 0.3s !important;
    margin-right: 10px !important;
    outline: none !important;
    box-shadow: none !important;
    text-decoration: none !important;
    display: inline-block !important;
    line-height: normal !important;
    text-align: center !important;
    vertical-align: middle !important;
}

.save-button:hover {
    background-color: #FFC985 !important;
}

.moodlog-textbox {
    width: 350px;
    height: 168px;
    background-color: rgba(247, 242, 235, 0.5);
    border-radius: 5px;
    padding: 30px;
    box-sizing: border-box;
    margin-bottom: 20px;
}

.moodlog-textbox textarea {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    resize: none;
    font-family: 'Omyu Pretty', sans-serif;
    font-size: 16px;
    color: #535353;
    outline: none;
}

.moodlog-textbox textarea::placeholder {
    color: #535353;
    opacity: 0.5;
}
</style>