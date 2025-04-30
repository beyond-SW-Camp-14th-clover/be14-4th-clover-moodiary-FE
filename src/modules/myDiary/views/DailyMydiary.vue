<template>
    <div class="diary-page">
        <div class="book-container">
            <!-- 왼쪽 섹션 -->
            <div class="left-section">
                <div class="page-content">
                    <div class="scrollable-content">
                        <div class="top-row">
                            <div class="score-section">
                                <h3>감정 분석 결과</h3>
                                <div class="score-box">
                                    <p>긍정 감정 점수: {{ diary?.positiveScore || 48 }}</p>
                                    <p>보통 감정 점수: {{ diary?.neutralScore || 26 }}</p>
                                    <p>부정 감정 점수: {{ diary?.negativeScore || 26 }}</p>
                                </div>
                            </div>
                            <div class="recommended-section">
                                <h3>추천 일기 제목</h3>
                                <div class="recommended-title-box">
                                    <div class="title-placeholder">
                                        추천 제목이 여기에 표시됩니다
                                    </div>
                                </div>
                            </div>
                            <div class="total-score-section">
                                <h3>종합</h3>
                                <div class="total-score-box">
                                    <p class="total-score" :style="{ color: totalScoreColor }">{{ diary?.positiveScore || 48 }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="emotion-section">
                            <h3>감정 요약</h3>
                            <ul class="emotion-list">
                                <li>일상 속의 소소한 기쁨</li>
                                <li>사람들과의 따뜻한 교감</li>
                                <li>여유롭고 즐거운 여가 시간</li>
                            </ul>
                        </div>

                        <div class="action-section">
                            <h3>행동 추천</h3>
                            <ul class="action-list">
                                <li>행동 1</li>
                                <li>행동 2</li>
                                <li>행동 3</li>
                            </ul>
                        </div>
                    </div>
                    <div class="button-container">
                        <div class="button-group">
                            <button class="action-button">수정</button>
                            <button class="action-button">삭제</button>
                            <button class="action-button">취소</button>
                            <button class="action-button highlight">일기 확정</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 오른쪽 섹션 -->
            <div class="right-section">
                <div class="write-wrapper" v-if="diary">
                    <div class="title-row">
                        <h2>✍️ {{ selectedDate.getFullYear() }} {{ selectedDate.getMonth() + 1 }}월 {{ selectedDate.getDate() }}일 {{ ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][selectedDate.getDay()] }}, 오늘의 일기</h2>
                    </div>
                    
                    <div class="write-form">
                        <div class="title-section">
                            <div class="title-input">{{ diary.title }}</div>
                        </div>

                        <div class="textarea-wrapper">
                            <div class="emotion-tag-header">
                                <h3>감정 태그: </h3>
                                <div class="emotion-tags">
                                    <span 
                                        v-for="(tag, index) in diary.hashtags" 
                                        :key="index" 
                                        class="emotion-tag"
                                    >
                                        #{{ tag }}
                                    </span>
                                </div>
                            </div>
                            <div class="notebook-textarea">{{ diary.content }}</div>

                            <div class="sticker-layer">
                                <div
                                    v-for="(sticker, i) in diary.stickers"
                                    :key="i"
                                    class="sticker-wrapper"
                                    :style="{ left: sticker.x + 'px', top: sticker.y + 'px', width: sticker.width + 'px', height: sticker.height + 'px', zIndex: i }"
                                >
                                    <img
                                        :src="sticker.url"
                                        class="sticker"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="no-diary">
                    <p>작성된 일기가 없습니다.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const selectedDate = ref(new Date(route.query.date || new Date()))
const diary = ref(null)

const totalScoreColor = computed(() => {
    const score = diary.value?.positiveScore || 48
    if (score <= 33) return '#CA2B2B'
    if (score <= 66) return '#DA930E'
    return '#346FD2'
})

const fetchDiary = async () => {
    try {
        const response = await axios.get(`/api/diary/${selectedDate.value.toISOString().split('T')[0]}`)
        diary.value = response.data
    } catch (error) {
        console.error('일기를 불러오는데 실패했습니다:', error)
    }
}

onMounted(() => {
    fetchDiary()
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

.diary-page {
    height: 100%;
    perspective: 1500px;
    margin-top: -20px;
    
    .book-container {
        display: flex;
        max-width: 1200px;
        margin: 0 auto;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        min-height: 70vh;
        position: relative;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            width: 1px;
            height: 100%;
            background: #e0e0e0;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }
    }

    .left-section, .right-section {
        flex: 1;
        position: relative;
    }

    .left-section {
        background: #fff;
        border-right: 1px solid #e0e0e0;
        padding: 2rem;
        height: 70vh;
        display: flex;
        flex-direction: column;

        .page-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .scrollable-content {
            flex: 1;
            overflow-y: auto;
            padding-right: 1rem;
            margin-right: -1rem;
            margin-bottom: 5rem;

            &::-webkit-scrollbar {
                width: 8px;
            }

            &::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            &::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        }

        .button-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            padding: 1rem 0;
            border-top: 1px solid #e0e0e0;
            margin-top: 0;
        }

        .top-row {
            display: flex;
            align-items: flex-start;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .score-section, .recommended-section, .total-score-section, .emotion-section, .action-section {
            h3 {
                font-size: 1.2rem;
                color: #333;
                margin-bottom: 1rem;
                line-height: 1.2;
            }
        }

        .score-box {
            background-color: #F6E475;
            padding: 1.5rem;
            border-radius: 0;
            width: 150px;
            height: 150px;

            p {
                margin: 0.5rem 0;
                font-size: 1rem;
                color: #333;
            }
        }

        .recommended-title-box {
            background-color: #F6D4CB;
            padding: 1.5rem;
            border-radius: 0;
            width: 250px;
            height: 150px;

            .title-placeholder {
                margin: 0.5rem 0;
                font-size: 1rem;
                color: #333;
            }
        }

        .total-score-section {
            h3 {
                text-align: center;
                width: 60px;
            }
        }

        .total-score-box {
            background-color: #F7F7F7;
            padding: 1rem;
            border-radius: 5px;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;

            .total-score {
                margin: 0;
                font-size: 1.2rem;
                font-weight: bold;
                color: #333;
            }
        }

        .emotion-list, .action-list {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin: 0;

            li {
                margin: 0.5rem 0;
                color: #333;
            }
        }

        .button-group {
            display: flex;
            gap: 1.5rem;
            margin-top: auto;
            flex-wrap: wrap;
            justify-content: center;
        }

        .action-button {
            flex: none !important;
            width: 60px !important;
            height: 20px !important;
            padding: 0.5rem 1rem !important;
            border: none !important;
            border-radius: 4px !important;
            background-color: #E0E0E0 !important;
            color: #333 !important;
            cursor: pointer !important;
            font-size: 12px !important;
            transition: background-color 0.2s !important;
            margin: 0 !important;
            line-height: normal !important;
            text-align: center !important;
            text-decoration: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-family: 'Inter', sans-serif !important;
            font-weight: 400 !important;

            &:not(.highlight) {
                background-color: #E9D2AF !important;
            }

            &:hover {
                background-color: #D0D0D0 !important;
                border: none !important;
                color: #333 !important;
            }

            &.highlight {
                background-color: #FFE0B2 !important;

                &:hover {
                    background-color: #FFD180 !important;
                }
            }
        }

        .action-section {
            margin-top: 30px;
        }
    }

    .right-section {
        background: #fff;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 0;
        height: 70vh;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        &::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        .title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .write-wrapper {
            max-width: 850px;
            margin: 0;
            padding: 3rem;
            background-color: #fffce6;
            border-radius: 0;
            border: none;
            font-family: 'Ownglyph PDH', sans-serif;
            font-size: 18px;
            font-weight: 200;
            color: #535353;
            position: relative;
            animation: inkFadeIn 1.2s ease;
            flex: 1;
            overflow-y: visible;

            h2 {
                margin: 0;
                font-size: 1.5rem;
            }
        }

        @keyframes inkFadeIn {
            from { filter: blur(3px); opacity: 0; transform: scale(1.02); }
            to { filter: none; opacity: 1; transform: scale(1); }
        }

        .write-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .title-section {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .title-input {
            flex: 1;
            font-family: 'Ownglyph PDH', sans-serif;
            font-size: 18px;
            font-weight: 400;
            color: #535353;
            border: none;
            border-bottom: 2px dashed #c5b496;
            background-color: #fffce6;
            padding: 0.8rem 0.5rem;
            outline: none;
        }

        .title-input:focus {
            outline: none;
            border-bottom: 2px dashed #c5b496;
        }

        .textarea-wrapper {
            position: relative;
            border: 1px solid #d9c7aa;
            border-radius: 10px;
            background-color: #fffce6;
            overflow: auto;
            box-shadow: inset 0 0 8px rgba(0,0,0,0.08);
        }

        .emotion-tag-header {
            display: flex;
            align-items: flex-start;
            padding: 8px 18px;
            min-height: 34px;
            background: #fffce6;
            border-bottom: 1px solid #d9c7aa;
            flex-wrap: wrap;
            gap: 8px;
        }

        .emotion-tag-header h3 {
            margin: 0;
            font-family: 'Ownglyph PDH', sans-serif;
            font-size: 18px;
            font-weight: 400;
            color: #535353;
            line-height: 34px;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .emotion-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
            flex: 1;
            min-height: 34px;
        }

        .emotion-tag {
            background-color: #E2EFFF;
            color: #535353;
            padding: 0 12px;
            border-radius: 0px;
            font-size: 14px;
            font-family: 'Ownglyph PDH', sans-serif;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 28px;
            min-width: 62px;
            width: fit-content;
        }

        .notebook-textarea {
            font-family: 'Ownglyph PDH', sans-serif;
            font-size: 18px;
            font-weight: 400;
            color: #535353;
            line-height: 34px;
            padding: 0 18px 12px 18px;
            min-height: 500px;
            max-height: 500px;
            width: 100%;
            background: repeating-linear-gradient(to bottom, #fffce6 0px, #fffce6 33px, #d9c7aa 34px);
            background-size: 100% 34px;
            background-position-y: 0;
            box-sizing: border-box;
            border: none;
            white-space: pre-wrap;
            overflow-y: auto;
        }

        .sticker-layer {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            width: 100%;
            height: 100%;
        }

        .sticker-wrapper {
            position: absolute;
        }

        .sticker {
            width: 100%;
            height: 100%;
            user-select: none;
            touch-action: none;
        }

        .no-diary {
            text-align: center;
            padding: 50px;
            color: #666;
            font-size: 1.2rem;
        }
    }
}
</style>