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
                                    <p>긍정 감정 점수: {{ diaryEmotion?.positiveScore || 0 }}</p>
                                    <p>보통 감정 점수: {{ diaryEmotion?.neutralScore || 0 }}</p>
                                    <p>부정 감정 점수: {{ diaryEmotion?.negativeScore || 0 }}</p>
                                </div>
                            </div>
                            <div class="recommended-section">
                                <h3>추천 일기 제목</h3>
                                <div class="recommended-title-box">
                                    <div class="title-placeholder">
                                        {{ diaryEmotion?.diarySummary || '추천 제목이 여기에 표시됩니다' }}
                                    </div>
                                </div>
                            </div>
                            <div class="total-score-section">
                                <h3>종합</h3>
                                <div class="total-score-box">
                                    <p class="total-score" :style="{ color: totalScoreColor }">{{ diaryEmotion?.totalScore || 0 }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="emotion-section">
                            <h3>감정 요약</h3>
                            <ul class="emotion-list">
                                <li>{{ diaryEmotion?.emotionSummary1 || '감정 요약이 없습니다' }}</li>
                                <li>{{ diaryEmotion?.emotionSummary2 || '감정 요약이 없습니다' }}</li>
                                <li>{{ diaryEmotion?.emotionSummary3 || '감정 요약이 없습니다' }}</li>
                            </ul>
                        </div>

                        <div class="action-section">
                            <h3>행동 추천</h3>
                            <ul class="action-list">
                                <li v-if="diary?.isConfirmed === 'Y'">일기가 확정되었습니다</li>
                                <li v-if="diary?.isDeleted === 'Y'">삭제된 일기입니다</li>
                                <li>작성일: {{ diary?.createdAt?.toLocaleDateString() || '날짜 정보 없음' }}</li>
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
                            <div class="title-input">{{ diary.title || '제목 없음' }}</div>
                        </div>

                        <div class="textarea-wrapper">
                            <div class="emotion-tag-header">
                                <h3>감정 태그: </h3>
                                <div class="emotion-tags">
                                    <span 
                                        v-for="(tag, index) in (diary.hashtags || [])" 
                                        :key="index" 
                                        class="emotion-tag"
                                    >
                                        #{{ tag }}
                                    </span>
                                </div>
                            </div>
                            <div class="notebook-textarea">{{ diary.content || '내용이 없습니다' }}</div>

                            <div class="sticker-layer">
                                <div
                                    v-for="(sticker, i) in (diary.stickers || [])"
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
console.log('route params:', route.params)
console.log('route path:', route.path)

// 날짜 파라미터가 있는 경우 해당 날짜로 설정, 없는 경우 현재 날짜 사용
const selectedDate = ref(new Date())
if (route.params.date) {
    try {
        selectedDate.value = new Date(route.params.date)
        console.log('선택된 날짜:', selectedDate.value)
    } catch (error) {
        console.error('날짜 파싱 에러:', error)
    }
}

const diary = ref(null)
const diaryEmotion = ref(null)
const styleLayer = ref(null)

const totalScoreColor = computed(() => {
    const score = diaryEmotion.value?.totalScore || 0
    if (score <= 33) return '#CA2B2B'
    if (score <= 66) return '#DA930E'
    return '#346FD2'
})

const fetchDiary = async () => {
    try {
        // 날짜를 YYYY-MM-DD 형식으로 변환
        const year = selectedDate.value.getFullYear()
        const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.value.getDate()).padStart(2, '0')
        const dairyDate = `${year}-${month}-${day}`
        
        console.log('요청 날짜:', dairyDate)
        const userId = 1; // 임시로 고정된 userId 사용
        const response = await fetch(`http://localhost:8080/mydiary/daily/${dairyDate}?userId=${userId}`)
        
        if (!response.ok) {
            throw new Error('일기를 불러오는데 실패했습니다')
        }

        const data = await response.json()
        console.log('일일 일기 데이터:', data)
        
        if (data) {
            // 기본 일기 정보
            diary.value = {
                id: data.id,
                title: data.title,
                content: data.content,
                createdAt: new Date(data.createdAt),
                isDeleted: data.isDeleted,
                isConfirmed: data.isConfirmed,
                userId: data.userId,
                hashtags: data.tags || []
            }
            console.log('diary.value 설정됨:', diary.value)

            // 스타일 레이어 정보
            try {
                styleLayer.value = JSON.parse(data.styleLayer || '{"bg": "", "sticker": []}')
                console.log('styleLayer.value 설정됨:', styleLayer.value)
            } catch (e) {
                console.error('styleLayer 파싱 에러:', e)
                styleLayer.value = { bg: "", sticker: [] }
            }
            
            // 스티커 정보 추가
            diary.value.stickers = (styleLayer.value?.sticker || []).map(sticker => ({
                url: `/stickers/${sticker}.png`,
                x: Math.random() * 100,
                y: Math.random() * 100,
                width: 50,
                height: 50
            }))
            console.log('stickers 설정됨:', diary.value.stickers)

            // 감정 분석 정보
            if (data.diaryEmotion) {
                diaryEmotion.value = {
                    id: data.diaryEmotion.id,
                    positiveScore: data.diaryEmotion.positiveScore,
                    neutralScore: data.diaryEmotion.neutralScore,
                    negativeScore: data.diaryEmotion.negativeScore,
                    totalScore: data.diaryEmotion.totalScore,
                    emotionSummary1: data.diaryEmotion.emotionSummary1,
                    emotionSummary2: data.diaryEmotion.emotionSummary2,
                    emotionSummary3: data.diaryEmotion.emotionSummary3,
                    diarySummary: data.diaryEmotion.diarySummary
                }
                console.log('diaryEmotion.value 설정됨:', diaryEmotion.value)
            } else {
                console.log('diaryEmotion 데이터가 없습니다')
            }
        } else {
            console.log('데이터가 null입니다')
        }
    } catch (error) {
        console.error('일기를 불러오는데 실패했습니다:', error)
    }
}

// 컴포넌트가 마운트될 때와 날짜가 변경될 때마다 데이터를 가져옴
onMounted(() => {
    console.log('컴포넌트 마운트됨')
    fetchDiary()
})

// 날짜가 변경될 때마다 데이터를 다시 가져옴
watch(selectedDate, () => {
    console.log('선택된 날짜가 변경됨:', selectedDate.value)
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