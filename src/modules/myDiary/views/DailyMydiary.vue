<template>
    <div class="diary-page">
        <div class="book-container">
            <!-- 왼쪽 섹션 -->
            <div class="left-section">
                <div class="page-content">
                    <h2 class="date-title">✍️ {{ selectedDate.getFullYear() }}년 {{ selectedDate.getMonth() + 1 }}월 {{ selectedDate.getDate() }}일</h2>
                    <div class="day-of-week">{{ ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][selectedDate.getDay()] }}</div>
                    <div class="weather-info">
                        <!-- 날씨 정보가 있다면 표시 -->
                    </div>
                    <div class="mood-summary">
                        <!-- 감정 요약 정보가 있다면 표시 -->
                    </div>
                </div>
            </div>

            <!-- 오른쪽 섹션 -->
            <div class="right-section">
                <div class="write-wrapper" v-if="diary">
                    <h2>✍️ {{ selectedDate.getFullYear() }} {{ selectedDate.getMonth() + 1 }}월 {{ selectedDate.getDate() }}일 {{ ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][selectedDate.getDay()] }}, 오늘의 일기</h2>
                    
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const selectedDate = ref(new Date(route.query.date || new Date()))
const diary = ref(null)

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
    // padding: 20px;
    height: 100%;
    // background: #f5f5f5;
    perspective: 1500px;
    margin-top: -40px;
    
    .book-container {
        display: flex;
        max-width: 1200px;
        margin: 0 auto;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        min-height: 80vh;
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

        .page-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .date-title {
            font-size: 2rem;
            color: #333;
            margin-bottom: 10px;
        }

        .day-of-week {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 30px;
        }
    }

    .right-section {
        background: #fff;
        height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 0;

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
            overflow-y: auto;

            h2 {
                margin-bottom: 20px;
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