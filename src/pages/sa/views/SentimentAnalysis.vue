<template>
    <div class="page-wrapper">
        <div class="date-header">
            <div class="date-display">{{ selectedDate }}</div>
        </div>

        <div class="one-line-summary">
            <h2>한 줄 요약</h2>
            <div class="summary-card">
                {{ parsedResult.oneLineSummary }}
            </div>
        </div>

        <div class="analysis-section">
            <div class="score-card">
                <h3>감정 분석 결과</h3>
                <ul>
                    <li>긍정 감정 점수: {{ parsedResult.positive }}%</li>
                    <li>보통 감정 점수: {{ parsedResult.neutral }}%</li>
                    <li>부정 감정 점수: {{ parsedResult.negative }}%</li>
                    <li>총합 감정 점수: {{ parsedResult.total }}/100</li>
                </ul>
            </div>

            <div class="emotion-card">
                <h3>감정 요약</h3>
                <ul>
                    <li v-for="(emotion, index) in parsedResult.emotionSummary" :key="index">
                        {{ emotion }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="recommendation-section">
            <h3>행동 추천</h3>
            <ul>
                <li v-for="(action, index) in recommendedActions" :key="index">{{ action }}</li>
            </ul>
        </div>

        <div class="button-group">
            <button class="action-button">수정</button>
            <button class="action-button">삭제</button>
            <button class="action-button">취소</button>
            <button class="confirm-button">일기 확정</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedDate = ref('2025년 4월 25일 금요일')

const parsedResult = ref({
    positive: 60,
    neutral: 24,
    negative: 16,
    total: 72,
    emotionSummary: ['기쁨', '슬픔', '지침'],
    oneLineSummary: '변화의 문턱에서 피어난 초여름의 청량함'
})

const recommendedActions = ref(['행동 1', '행동 2', '행동 3'])
</script>

<style scoped>
.page-wrapper {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-beige);
}

.date-header {
    margin-bottom: 1.5rem;
}

.date-display {
    font-family: var(--font-pixel);
    font-size: 1.5rem;
    color: var(--color-brown);
}

.one-line-summary {
    margin-bottom: 2rem;
    width: 100%;
    max-width: 600px;
    text-align: center;
}

.summary-card {
    background: #fff;
    border: 2px solid var(--color-brown);
    border-radius: 10px;
    padding: 1rem;
    font-family: var(--font-omyu);
    font-size: 1.2rem;
}

.analysis-section {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
}

.score-card,
.emotion-card {
    flex: 1;
    background: #fff8b1;
    border: 2px solid var(--color-brown);
    border-radius: 10px;
    padding: 1rem;
}

.emotion-card {
    background: #f9f9f9;
}

.recommendation-section {
    background: #f9f9f9;
    border: 2px solid var(--color-brown);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 700px;
}

ul {
    padding-left: 20px;
}

.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.action-button,
.confirm-button {
    all: unset;
    padding: 0.5rem 1.5rem;
    font-family: var(--font-pixel);
    font-size: 1rem;
    border: 2px solid var(--color-brown);
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    background: var(--color-beige);
}

.confirm-button {
    background: white;
}

.action-button:hover,
.confirm-button:hover {
    background: var(--color-green);
    color: white;
}
</style>