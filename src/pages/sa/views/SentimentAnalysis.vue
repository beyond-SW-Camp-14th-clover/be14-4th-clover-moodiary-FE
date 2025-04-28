<template>
    <div class="page-wrapper">
        <h1 class="page-title">감정 분석</h1>

        <div class="input-section">
            <input type="date" v-model="selectedDate" @change="fetchDiary" class="date-picker" />
            <div v-if="diaryContent" class="diary-preview">
                <h2>선택한 날짜의 일기</h2>
                <p>{{ diaryContent }}</p>
            </div>
            <button class="submit-button" :disabled="!diaryContent || isLoading" @click="analyzeEmotion">
                감정 분석하기
            </button>
        </div>

        <div v-if="isLoading" class="loading">
            <div class="spinner"></div>
            분석 중입니다...
        </div>

        <div v-if="parsedResult && !isLoading" class="result-section">
            <div class="score-summary">
                <h2>총 감정 점수 요약</h2>
                <ul>
                    <li class="positive">긍정 감정 점수: {{ parsedResult.positive }}%</li>
                    <li class="neutral">보통 감정 점수: {{ parsedResult.neutral }}%</li>
                    <li class="negative">부정 감정 점수: {{ parsedResult.negative }}%</li>
                    <li>총합 감정 점수: {{ parsedResult.total }}/100</li>
                </ul>
            </div>

            <div class="emotion-summary">
                <h2>감정 요약</h2>
                <ul>
                    <li v-for="(emotion, index) in parsedResult.emotionSummary" :key="index">
                        {{ emotion }}
                    </li>
                </ul>
            </div>

            <div class="one-line-summary">
                <h2>한 줄 요약</h2>
                <p>{{ parsedResult.oneLineSummary }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const selectedDate = ref('')
const diaryContent = ref('')
const parsedResult = ref(null)
const isLoading = ref(false)

const fetchDiary = async () => {
    parsedResult.value = null
    if (!selectedDate.value) return

    try {
        const response = await axios.get(`/api/diary?date=${selectedDate.value}`)
        diaryContent.value = response.data.content
    } catch (error) {
        console.error('일기 불러오기 실패:', error)
        diaryContent.value = ''
        alert('일기를 불러오는 데 실패했습니다.')
    }
}

const analyzeEmotion = async () => {
    if (!diaryContent.value) return
    isLoading.value = true
    parsedResult.value = null

    try {
        const gptResponse = await axios.post('/api/gpt', { prompt: diaryContent.value })
        const parsed = JSON.parse(gptResponse.data.response)
        const responseText = parsed.response
        parsedResult.value = parseEmotionResponse(responseText)

    } catch (error) {
        console.error('감정 분석 실패:', error)
        alert('감정 분석에 실패했습니다. 다시 시도해 주세요.')
    } finally {
        isLoading.value = false
    }
}

function parseEmotionResponse(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean)

    const result = {
        positive: 0,
        neutral: 0,
        negative: 0,
        total: 0,
        emotionSummary: [],
        oneLineSummary: ''
    }

    let parsingEmotionList = false
    let parsingOneLine = false

    for (const line of lines) {
        if (line.startsWith('긍정 감정 점수')) {
            result.positive = parseInt(line.split(':')[1].trim())
        } else if (line.startsWith('보통 감정 점수')) {
            result.neutral = parseInt(line.split(':')[1].trim())
        } else if (line.startsWith('부정 감정 점수')) {
            result.negative = parseInt(line.split(':')[1].trim())
        } else if (line.startsWith('총합 감정 점수')) {
            result.total = parseInt(line.split(':')[1].split('/')[0].trim())
        } else if (line.startsWith('감정 요약')) {
            parsingEmotionList = true
        } else if (line.startsWith('한 줄 요약')) {
            parsingEmotionList = false
            parsingOneLine = true
        } else {
            if (parsingEmotionList && line.startsWith('-')) {
                result.emotionSummary.push(line.replace('-', '').trim())
            }
            if (parsingOneLine && line.length > 0) {
                result.oneLineSummary = line.trim()
            }
        }
    }

    return result
}
</script>

<style scoped>
.page-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: var(--color-beige);
}

.page-title {
    font-family: var(--font-pixel);
    font-size: 2rem;
    color: var(--color-brown);
    margin-bottom: 2rem;
}

.input-section {
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

.date-picker {
    width: 200px;
    padding: 10px;
    font-family: var(--font-omyu);
    border: 2px solid var(--color-brown);
    border-radius: 8px;
    background-color: #fff8ed;
}

.diary-preview {
    background-color: #fff8ed;
    padding: 1rem;
    border: 2px solid var(--color-brown);
    border-radius: 8px;
}

.result-section {
    width: 100%;
    max-width: 700px;
}

.score-summary,
.emotion-summary,
.one-line-summary {
    margin-bottom: 2rem;
}

ul {
    list-style: disc;
    padding-left: 20px;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: var(--font-pixel);
    color: var(--color-green);
    margin-top: 2rem;
    font-size: 1.2rem;
}

.spinner {
    width: 30px;
    height: 30px;
    border: 4px solid var(--color-green);
    border-top: 4px solid var(--color-beige);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

p {
    font-family: var(--font-omyu);
    font-size: 1rem;
    color: var(--color-brown);
}

.positive {
    color: green;
}

.neutral {
    color: gray;
}

.negative {
    color: red;
}
</style>