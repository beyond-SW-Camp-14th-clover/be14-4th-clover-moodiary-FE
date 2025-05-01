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
                                    <p>긍정 감정 점수: {{ myDiaryEmotion?.positiveScore || 0 }}</p>
                                    <p>보통 감정 점수: {{ myDiaryEmotion?.neutralScore || 0 }}</p>
                                    <p>부정 감정 점수: {{ myDiaryEmotion?.negativeScore || 0 }}</p>
                                </div>
                            </div>
                            <div class="recommended-section">
                                <h3>추천 일기 제목</h3>
                                <div class="recommended-title-box">
                                    <div class="title-placeholder">
                                        {{ myDiaryEmotion?.diarySummary || '추천 제목이 여기에 표시됩니다' }}
                                    </div>
                                </div>
                            </div>
                            <div class="total-score-section">
                                <h3>종합</h3>
                                <div class="total-score-box">
                                    <p class="total-score" :style="{ color: totalScoreColor }">{{ myDiaryEmotion?.totalScore || 0 }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="emotion-section">
                            <h3>감정 요약</h3>
                            <ul class="emotion-list">
                                <li>{{ myDiaryEmotion?.emotionSummary1 || '감정 요약이 없습니다' }}</li>
                                <li>{{ myDiaryEmotion?.emotionSummary2 || '감정 요약이 없습니다' }}</li>
                                <li>{{ myDiaryEmotion?.emotionSummary3 || '감정 요약이 없습니다' }}</li>
                            </ul>
                        </div>

                        <div class="action-section">
                            <h3>행동 추천</h3>
                            <ul class="action-list">
                                <li v-for="action in recommendedActions" :key="action.id">{{ action.action }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="button-container">
                        <div class="button-group">
                            <button 
                                class="action-button" 
                                @click="handleEdit"
                                :disabled="diary?.isConfirmed === 'Y'"
                                :class="{ 'disabled-button': diary?.isConfirmed === 'Y' }"
                            >
                                {{ isEditing ? '수정 완료' : '수정' }}
                            </button>
                            <button class="action-button" @click="handleDelete">삭제</button>
                            <button class="action-button" @click="handleCancel">취소</button>
                            <button 
                                class="action-button highlight" 
                                @click="handleConfirm"
                                :disabled="diary?.isConfirmed === 'Y'"
                                :class="{ 'disabled-button': diary?.isConfirmed === 'Y' }"
                            >
                                일기 확정
                            </button>
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
                            <div class="title-input" v-if="!isEditing">{{ diary.title || '제목 없음' }}</div>
                            <input 
                                v-else
                                v-model="editedDiary.title"
                                class="title-input"
                                type="text"
                                placeholder="제목을 입력하세요"
                            />
                        </div>

                        <div class="textarea-wrapper">
                            <div class="emotion-tag-header">
                                <h3>감정 태그: </h3>
                                <div class="emotion-tags">
                                    <template v-if="!isEditing">
                                        <span 
                                            v-for="(tag, index) in (diary.hashtags || [])" 
                                            :key="index" 
                                            class="emotion-tag"
                                        >
                                            #{{ tag }}
                                        </span>
                                    </template>
                                    <template v-else>
                                        <span 
                                            v-for="(tag, index) in editedDiary.hashtags" 
                                            :key="index" 
                                            class="emotion-tag"
                                            @click="removeHashtag(index)"
                                        >
                                            #{{ tag }}
                                        </span>
                                    </template>
                                </div>
                            </div>
                            <div v-if="!isEditing" class="notebook-textarea">{{ diary.content || '내용이 없습니다' }}</div>
                            <textarea
                                v-else
                                v-model="editedDiary.content"
                                class="notebook-textarea"
                                placeholder="일기 내용을 입력하세요"
                                @input="handleContentInput"
                                @compositionstart="handleCompositionStart"
                                @compositionend="handleCompositionEnd"
                            ></textarea>

                            <div class="sticker-layer">
                                <div
                                    v-for="(sticker, i) in (isEditing ? editedDiary.stickers : diary.stickers)"
                                    :key="i"
                                    class="sticker-wrapper"
                                    :style="{ left: sticker.x + 'px', top: sticker.y + 'px', width: sticker.width + 'px', height: sticker.height + 'px', zIndex: i }"
                                >
                                    <img
                                        :src="sticker.url"
                                        class="sticker"
                                        :class="{ selected: selectedIndex === i }"
                                        @mousedown="(e) => isEditing && startDrag(i, e)"
                                        @click.stop="isEditing && selectSticker(i)"
                                    />
                                    <div
                                        v-if="isEditing && selectedIndex === i"
                                        class="resize-handle"
                                        @mousedown.stop="startResize(i, $event)"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div v-if="isEditing" class="sticker-toolbar">
                            <button type="button" class="upload-btn" @click="showStickerModal = true">🧸 스티커 추가</button>
                            <button type="button" class="upload-btn" @click="triggerFileInput">📷 사진 추가</button>
                            <input type="file" ref="fileInput" accept="image/*" @change="handlePhotoUpload" hidden />
                        </div>
                    </div>
                </div>
                <div v-else class="no-diary">
                    <p>작성된 일기가 없습니다.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 확인 모달 -->
    <div v-if="showConfirmModal" class="modal-overlay">
        <div class="modal-content">
            <h3>일기 확정</h3>
            <p>일기를 현재 상태로 확정하시겠습니까?</p>
            <div class="modal-buttons">
                <button @click="confirmDiary" class="confirm-button">확인</button>
                <button @click="showConfirmModal = false" class="cancel-button">취소</button>
            </div>
        </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-content">
            <h3>일기 삭제</h3>
            <p>정말로 이 일기를 삭제하시겠습니까?</p>
            <div class="modal-buttons">
                <button @click="confirmDelete" class="confirm-button">확인</button>
                <button @click="showDeleteModal = false" class="cancel-button">취소</button>
            </div>
        </div>
    </div>

    <!-- 이미 확정된 일기 모달 -->
    <div v-if="showAlreadyConfirmedModal" class="modal-overlay">
        <div class="modal-content">
            <h3>일기 확정</h3>
            <p>이미 확정된 일기입니다.</p>
            <div class="modal-buttons">
                <button @click="showAlreadyConfirmedModal = false" class="confirm-button">확인</button>
                <button @click="showAlreadyConfirmedModal = false" class="cancel-button">취소</button>
            </div>
        </div>
    </div>

    <!-- 수정 완료 확인 모달 -->
    <div v-if="showEditConfirmModal" class="modal-overlay">
        <div class="modal-content">
            <h3>일기 수정 완료</h3>
            <p>정말 수정을 완료하시겠습니까?</p>
            <div class="modal-buttons">
                <button @click="confirmEdit" class="confirm-button">확인</button>
                <button @click="showEditConfirmModal = false" class="cancel-button">취소</button>
            </div>
        </div>
    </div>

    <div v-if="showStickerModal" class="sticker-modal">
        <div class="sticker-modal-inner">
            <div class="sticker-option" v-for="src in stickerOptions" :key="src">
                <img :src="src" @click="addSticker(src); showStickerModal = false" />
            </div>
            <button @click="showStickerModal = false" class="close-btn">닫기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDailyDiaryStore } from '../../../stores/dailyDiaryStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const dailyDiaryStore = useDailyDiaryStore()
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
const myDiaryEmotion = ref(null)
const styleLayer = ref(null)
const recommendedActions = ref([])
const showConfirmModal = ref(false)
const showDeleteModal = ref(false)
const showAlreadyConfirmedModal = ref(false)
const showEditConfirmModal = ref(false)
const isEditing = ref(false)
const editedDiary = ref(null)
const selectedIndex = ref(null)
const showStickerModal = ref(false)
const fileInput = ref(null)
const isComposing = ref(false)

const totalScoreColor = computed(() => {
    const score = myDiaryEmotion.value?.totalScore || 0
    if (score <= 33) return '#CA2B2B'
    if (score <= 66) return '#DA930E'
    return '#346FD2'
})

const stickerOptions = [
    '/src/assets/stickers/heart.png',
    '/src/assets/stickers/star.png',
    '/src/assets/stickers/rabbit.png'
]

let dragging = ref(null)
let resizing = ref(null)

const fetchDiary = async () => {
    try {
        // 날짜를 YYYY-MM-DD 형식으로 변환
        const year = selectedDate.value.getFullYear()
        const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.value.getDate()).padStart(2, '0')
        const dairyDate = `${year}-${month}-${day}`
        
        console.log('요청 날짜:', dairyDate)
        const userId = 1; // 임시로 고정된 userId 사용
        const response = await axios.get(`/mydiary/daily/${dairyDate}?userId=${userId}`)
        
        const data = response.data
        console.log('일일 일기 데이터:', data)
        console.log('styleLayer 데이터:', data.styleLayer)
        
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
                const parsedStyleLayer = JSON.parse(data.styleLayer || '{"bg": "", "sticker": []}')
                console.log('파싱된 styleLayer:', parsedStyleLayer)
                
                // 스티커 정보 처리
                if (parsedStyleLayer.sticker && Array.isArray(parsedStyleLayer.sticker)) {
                    diary.value.stickers = parsedStyleLayer.sticker.map(sticker => {
                        console.log('처리 전 스티커 데이터:', sticker)
                        
                        // URL 처리 로직 개선
                        let stickerUrl = sticker.url
                        if (sticker.type === 'photo') {
                            // 사진인 경우 Base64 데이터 URL 그대로 사용
                            stickerUrl = sticker.url
                        } else {
                            // 스티커인 경우 경로 처리
                            stickerUrl = sticker.url.startsWith('http') 
                                ? sticker.url 
                                : sticker.url.startsWith('/') 
                                    ? sticker.url 
                                    : `/stickers/${sticker.url}`
                        }
                        
                        const processedSticker = {
                            url: stickerUrl,
                            x: sticker.x || Math.random() * 100,
                            y: sticker.y || Math.random() * 100,
                            width: sticker.width || 50,
                            height: sticker.height || 50,
                            type: sticker.type || 'sticker'
                        }
                        
                        console.log('처리 후 스티커 데이터:', processedSticker)
                        return processedSticker
                    })
                    console.log('최종 스티커 배열:', diary.value.stickers)
                } else {
                    diary.value.stickers = []
                }
                
                styleLayer.value = parsedStyleLayer
                console.log('styleLayer.value 설정됨:', styleLayer.value)
            } catch (e) {
                console.error('styleLayer 파싱 에러:', e)
                styleLayer.value = { bg: "", sticker: [] }
                diary.value.stickers = []
            }

            // 감정 분석 정보
            if (data.myDiaryEmotion && typeof data.myDiaryEmotion === 'object') {
                console.log('myDiaryEmotion 데이터 처리 시작:', data.myDiaryEmotion)
                myDiaryEmotion.value = {
                    id: data.myDiaryEmotion.id || null,
                    positiveScore: Number(data.myDiaryEmotion.positiveScore) || 0,
                    neutralScore: Number(data.myDiaryEmotion.neutralScore) || 0,
                    negativeScore: Number(data.myDiaryEmotion.negativeScore) || 0,
                    totalScore: Number(data.myDiaryEmotion.totalScore) || 0,
                    emotionSummary1: data.myDiaryEmotion.emotionSummary1 || '감정 분석이 필요합니다',
                    emotionSummary2: data.myDiaryEmotion.emotionSummary2 || '감정 분석이 필요합니다',
                    emotionSummary3: data.myDiaryEmotion.emotionSummary3 || '감정 분석이 필요합니다',
                    diarySummary: data.myDiaryEmotion.diarySummary || '감정 분석이 필요합니다'
                }
                console.log('myDiaryEmotion.value 설정됨:', myDiaryEmotion.value)
            } else {
                console.log('myDiaryEmotion 데이터가 없거나 유효하지 않습니다:', data.myDiaryEmotion)
                myDiaryEmotion.value = {
                    id: null,
                    positiveScore: 0,
                    neutralScore: 0,
                    negativeScore: 0,
                    totalScore: 0,
                    emotionSummary1: '감정 분석이 필요합니다',
                    emotionSummary2: '감정 분석이 필요합니다',
                    emotionSummary3: '감정 분석이 필요합니다',
                    diarySummary: '감정 분석이 필요합니다'
                }
            }
        } else {
            console.log('데이터가 null입니다')
        }
    } catch (error) {
        console.error('일기를 불러오는데 실패했습니다:', error)
    }
}

// 행동 추천 데이터를 가져오는 함수
const fetchRecommendedActions = async () => {
    try {
        const userId = 1; // 임시로 고정된 userId 사용
        const response = await axios.get(`/action/recommend?userId=${userId}`)
        
        const data = response.data
        console.log('행동 추천 데이터:', data)
        recommendedActions.value = data
    } catch (error) {
        console.error('행동 추천을 불러오는데 실패했습니다:', error)
        recommendedActions.value = []
    }
}

const handleCancel = () => {
    if (dailyDiaryStore.previousPage === 'weekly') {
        router.push({ name: 'WeeklyDiary' })
    } else if (dailyDiaryStore.previousPage === 'monthly') {
        router.push({ name: 'MonthlyDiary' })
    } else {
        router.push({ name: 'MonthlyDiary' }) // 기본값
    }
    dailyDiaryStore.clearPreviousPage()
}

const handleConfirm = () => {
    if (diary.value?.isConfirmed === 'Y') {
        showAlreadyConfirmedModal.value = true;
    } else {
        showConfirmModal.value = true;
    }
}

const confirmDiary = async () => {
    // 모달 먼저 닫기
    showConfirmModal.value = false;
    
    try {
        console.log('[확인 시작] diary.value:', diary.value);

        const requestData = {
            id: diary.value.id,
            title: diary.value.title,
            content: diary.value.content,
            createdAt: diary.value.createdAt.toISOString().slice(0, -1),
            isDeleted: diary.value.isDeleted,
            isConfirmed: 'Y',
            styleLayer: JSON.stringify(styleLayer.value),
            userId: diary.value.userId,
            tags: diary.value.hashtags || []
        }

        console.log('[일기 확정 요청 데이터]', requestData);
        console.log('[일기 확정 요청 데이터 (JSON)]', JSON.stringify(requestData, null, 2));

        // 일기 확정 요청
        const updateResponse = await axios.put('/mydiary/update', requestData)

        console.log('[일기 확정 응답]', updateResponse.data);

        // 일기 확정 성공 후 감정 분석 요청
        console.log('[감정 분석 요청 데이터]', { content: diary.value.content });
        const analyzeResponse = await axios.post('/api/gpt/analyze', {
            content: diary.value.content
        })

        console.log('[감정 분석 응답]', analyzeResponse.data);

        // 감정 분석 결과를 저장하는 API 호출
        const emotionData = {
            positiveScore: Math.max(1, analyzeResponse.data.positiveScore || 0),
            neutralScore: Math.max(1, analyzeResponse.data.neutralScore || 0),
            negativeScore: Math.max(1, analyzeResponse.data.negativeScore || 0),
            totalScore: Math.max(1, analyzeResponse.data.totalScore || 0),
            emotionSummary1: analyzeResponse.data.emotion1 || '감정 요약이 없습니다',
            emotionSummary2: analyzeResponse.data.emotion2 || '감정 요약이 없습니다',
            emotionSummary3: analyzeResponse.data.emotion3 || '감정 요약이 없습니다',
            myDiarySummary: analyzeResponse.data.diaryTitle || '추천 제목이 없습니다',
            myDiaryId: diary.value.id
        };

        console.log('[감정 분석 저장 요청 데이터]', emotionData);
        console.log('[감정 분석 저장 요청 데이터 (JSON)]', JSON.stringify(emotionData, null, 2));

        const emotionResponse = await axios.post('/mydiary/registEmotion', emotionData)

        console.log('[감정 분석 저장 응답]', emotionResponse.data);

        // 성공 시
        diary.value.isConfirmed = 'Y';
        
        // 감정 분석 결과를 UI에 반영
        myDiaryEmotion.value = {
            id: emotionResponse.data.id || null,
            positiveScore: emotionData.positiveScore,
            neutralScore: emotionData.neutralScore,
            negativeScore: emotionData.negativeScore,
            totalScore: emotionData.totalScore,
            emotionSummary1: emotionData.emotionSummary1,
            emotionSummary2: emotionData.emotionSummary2,
            emotionSummary3: emotionData.emotionSummary3,
            diarySummary: emotionData.myDiarySummary
        };
        
        console.log('[성공] 일기 확정 및 감정 분석 완료');
    } catch (error) {
        console.error('[예외 발생] 처리 중 오류 발생:', error);
        alert('일기 확정에 실패했습니다');
    }
}

const handleDelete = () => {
    if (!diary.value?.id) {
        console.error('삭제할 일기의 ID가 없습니다');
        return;
    }
    showDeleteModal.value = true;
}

const confirmDelete = async () => {
    try {
        console.log('[삭제 요청 시작] 일기 ID:', diary.value.id);
        const response = await axios.delete(`/mydiary/${diary.value.id}`)

        console.log('[삭제 응답 상태]', response.status);
        console.log('[성공] 일기 삭제 완료');
        showDeleteModal.value = false;
        
        // 삭제 후 월간 일기 페이지로 이동
        router.push({ name: 'MonthlyDiary' });
    } catch (error) {
        console.error('[예외 발생] 일기 삭제 중 오류 발생:', error);
        alert('일기 삭제에 실패했습니다');
    }
}

const handleEdit = async () => {
    if (diary.value?.isConfirmed === 'Y') {
        return; // 이미 확정된 일기는 수정 불가
    }
    
    if (!isEditing.value) {
        // 수정 모드 진입 시 현재 데이터를 복사
        editedDiary.value = {
            ...diary.value,
            title: diary.value.title || '',
            content: diary.value.content || '',
            hashtags: [...(diary.value.hashtags || [])]
        }
        isEditing.value = true
    } else {
        showEditConfirmModal.value = true
    }
}

const confirmEdit = async () => {
    try {
        // 스타일 레이어 정보 구성
        const styleLayerData = {
            bg: styleLayer.value?.bg || "",
            sticker: editedDiary.value.stickers.map(sticker => ({
                url: sticker.url,
                x: sticker.x,
                y: sticker.y,
                width: sticker.width,
                height: sticker.height,
                type: sticker.type || 'sticker'
            }))
        }

        // 수정 완료 시 API 호출
        const requestData = {
            ...diary.value, // 기존 데이터
            title: editedDiary.value.title,
            content: editedDiary.value.content,
            createdAt: new Date(diary.value.createdAt.getTime() - diary.value.createdAt.getTimezoneOffset() * 60000).toISOString().slice(0, -1),
            styleLayer: JSON.stringify(styleLayerData),
            tags: editedDiary.value.hashtags || [],
            isDeleted: diary.value.isDeleted,
            isConfirmed: diary.value.isConfirmed,
            userId: diary.value.userId
        }

        console.log('[수정 요청 데이터]', requestData);

        const response = await axios.put('/mydiary/update', requestData)
        
        if (response.status === 200) {
            // 성공 시 이전 페이지로 이동
            if (dailyDiaryStore.previousPage === 'weekly') {
                router.push({ name: 'WeeklyDiary' })
            } else if (dailyDiaryStore.previousPage === 'monthly') {
                router.push({ name: 'MonthlyDiary' })
            } else {
                router.push({ name: 'MonthlyDiary' })
            }
            dailyDiaryStore.clearPreviousPage()
        }
    } catch (error) {
        console.error('일기 수정 중 오류 발생:', error)
        alert('일기 수정에 실패했습니다')
    }
    showEditConfirmModal.value = false
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

const addSticker = (url) => {
    editedDiary.value.stickers.push({ url, x: 100, y: 100, width: 80, height: 80, type: 'sticker' })
}

const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
        editedDiary.value.stickers.push({
            url: reader.result,
            x: 100,
            y: 100,
            width: 140,
            height: 140,
            type: 'photo'
        })
    }
    reader.readAsDataURL(file)
}

const startDrag = (index, event) => {
    event.preventDefault()
    dragging.value = {
        index,
        startX: event.clientX,
        startY: event.clientY,
        origX: editedDiary.value.stickers[index].x,
        origY: editedDiary.value.stickers[index].y
    }
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
    if (!dragging.value) return
    const { index, startX, startY, origX, origY } = dragging.value
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY

    const wrapper = document.querySelector('.textarea-wrapper')
    const maxX = wrapper.offsetWidth - editedDiary.value.stickers[index].width
    const maxY = wrapper.offsetHeight - editedDiary.value.stickers[index].height

    editedDiary.value.stickers[index].x = Math.min(Math.max(0, origX + deltaX), maxX)
    editedDiary.value.stickers[index].y = Math.min(Math.max(0, origY + deltaY), maxY)
}

const stopDrag = () => {
    dragging.value = null
    resizing.value = null
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mousemove', onResize)
    document.removeEventListener('mouseup', stopDrag)
}

const selectSticker = (index) => {
    if (selectedIndex.value !== index) {
        const target = editedDiary.value.stickers.splice(index, 1)[0]
        editedDiary.value.stickers.push(target)
        selectedIndex.value = editedDiary.value.stickers.length - 1
    }
}

const startResize = (index, event) => {
    event.preventDefault()
    resizing.value = {
        index,
        startX: event.clientX,
        startY: event.clientY,
        origWidth: editedDiary.value.stickers[index].width,
        origHeight: editedDiary.value.stickers[index].height
    }
    document.addEventListener('mousemove', onResize)
    document.addEventListener('mouseup', stopDrag)
}

const onResize = (event) => {
    if (!resizing.value) return
    const { index, startX, startY, origWidth, origHeight } = resizing.value
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY

    if (event.shiftKey) {
        const ratio = origWidth / origHeight
        const newWidth = Math.max(30, origWidth + deltaX)
        const newHeight = Math.max(30, newWidth / ratio)
        editedDiary.value.stickers[index].width = newWidth
        editedDiary.value.stickers[index].height = newHeight
    } else {
        editedDiary.value.stickers[index].width = Math.max(30, origWidth + deltaX)
        editedDiary.value.stickers[index].height = Math.max(30, origHeight + deltaY)
    }
}

const deleteSelected = () => {
    if (selectedIndex.value !== null) {
        const target = editedDiary.value.stickers[selectedIndex.value]
        editedDiary.value.stickers = editedDiary.value.stickers.filter((s) => s !== target)
        selectedIndex.value = null
    }
}

const handleContentInput = (e) => {
    editedDiary.value.content = e.target.value
    if (!isComposing.value) {
        checkHashtag(e.target.value)
    }
}

const handleCompositionStart = () => {
    isComposing.value = true
}

const handleCompositionEnd = (e) => {
    isComposing.value = false
    checkHashtag(e.target.value)
}

const checkHashtag = (text) => {
    if (isComposing.value) return

    const words = text.split(/\s+/)
    if (words.length > 1) {
        const lastWord = words[words.length - 2]
        if (lastWord && lastWord.startsWith('#')) {
            const hashtag = lastWord.slice(1)
            if (hashtag && !editedDiary.value.hashtags.includes(hashtag)) {
                editedDiary.value.hashtags.push(hashtag)
                const updatedWords = words.slice(0, words.length - 2).concat(words.slice(words.length - 1))
                editedDiary.value.content = updatedWords.join(' ') + ' '
            }
        }
    }
}

const removeHashtag = (index) => {
    editedDiary.value.hashtags.splice(index, 1)
}

onMounted(() => {
    console.log('컴포넌트 마운트됨')
    fetchDiary()
    fetchRecommendedActions()  // 행동 추천 데이터도 함께 가져옴
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' && selectedIndex.value !== null && isEditing.value) {
            deleteSelected()
        }
    })
})

// 날짜가 변경될 때마다 데이터를 다시 가져옴
watch(selectedDate, () => {
    console.log('선택된 날짜가 변경됨:', selectedDate.value)
    fetchDiary()
    fetchRecommendedActions()  // 행동 추천 데이터도 함께 가져옴
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
            width: 170px;
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
            transition: all 0.2s !important;
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

            &.disabled-button {
                background-color: #E0E0E0 !important;
                color: #999 !important;
                cursor: not-allowed !important;

                &:hover {
                    background-color: #E0E0E0 !important;
                    color: #999 !important;
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
            max-height: 500px;

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
            width: 100%;
            background: repeating-linear-gradient(to bottom, #fffce6 0px, #fffce6 33px, #d9c7aa 34px);
            background-size: 100% 34px;
            background-position-y: 0;
            box-sizing: border-box;
            border: none;
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: break-all;
            overflow: visible;
        }

        .sticker-layer {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .sticker-wrapper {
            position: absolute;
            pointer-events: auto;
        }

        .sticker {
            width: 100%;
            height: 100%;
            user-select: none;
            touch-action: none;
            cursor: move;
        }

        .no-diary {
            text-align: center;
            padding: 50px;
            color: #666;
            font-size: 1.2rem;
        }
    }
}

.modal-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background-color: rgba(0, 0, 0, 0.5) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    z-index: 1000 !important;
}

.modal-content {
    background: white !important;
    padding: 2rem !important;
    border-radius: 8px !important;
    width: 300px !important;
    text-align: center !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;

    h3 {
        margin-bottom: 1rem !important;
        color: #333 !important;
        font-size: 1.2rem !important;
        font-weight: 600 !important;
    }

    p {
        margin-bottom: 1.5rem !important;
        color: #666 !important;
        font-size: 1rem !important;
        line-height: 1.5 !important;
    }
}

.modal-buttons {
    display: flex !important;
    justify-content: center !important;
    gap: 1rem !important;

    button {
        padding: 0.5rem 1.5rem !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 0.9rem !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;

        &:hover {
            transform: translateY(-1px) !important;
        }
    }

    .confirm-button {
        background-color: #FFE0B2 !important;
        color: #333 !important;

        &:hover {
            background-color: #FFD180 !important;
        }
    }

    .cancel-button {
        background-color: #E0E0E0 !important;
        color: #333 !important;

        &:hover {
            background-color: #D0D0D0 !important;
        }
    }
}

.emotion-tag-input {
    flex: 1;
    min-width: 200px;
    height: 28px;
    padding: 0 8px;
    border: 1px solid #d9c7aa;
    border-radius: 4px;
    background-color: #fffce6;
    font-family: 'Ownglyph PDH', sans-serif;
    font-size: 14px;
    color: #535353;
    outline: none;

    &:focus {
        border-color: #c5b496;
        box-shadow: 0 0 0 2px rgba(197, 180, 150, 0.2);
    }
}

textarea.notebook-textarea {
    resize: none;
    outline: none;
    border: none;
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
    white-space: pre-wrap;
    overflow-y: auto;
    overflow-x: auto;
    word-wrap: break-word;
    word-break: break-all;
}

.sticker-toolbar { 
    display: flex; 
    gap: 1rem; 
    margin-top: 1.5rem; 
    justify-content: center;
    width: 100%;
}

.upload-btn {
    background-color: #f5eccc;
    border-radius: 10px;
    padding: 0.5rem 0.8rem;
    cursor: pointer;
    white-space: nowrap;
    font-size: 14px;
    min-width: 90px;
    color: #7a5c3d;
    font-family: 'Ownglyph PDH', sans-serif;
    font-weight: 400;
}

.sticker-modal { 
    position: fixed; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    background-color: #fffce6; 
    border: 2px solid #d9c7aa; 
    border-radius: 12px; 
    padding: 2rem; 
    z-index: 100; 
}

.sticker-modal-inner { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 1rem; 
    justify-content: center; 
    align-items: center; 
}

.sticker-option img { 
    width: 60px; 
    height: 60px; 
    cursor: pointer; 
}

.sticker-option img:hover { 
    transform: scale(1.1); 
}

.close-btn { 
    margin-top: 1rem; 
    background-color: #c9a36b; 
    color: white; 
    border-radius: 8px; 
    padding: 0.5rem 1.2rem; 
}

.resize-handle {
    width: 12px; 
    height: 12px;
    background-color: #6f9d6b;
    border-radius: 50%;
    position: absolute;
    right: -6px; 
    bottom: -6px;
    cursor: nwse-resize;
    pointer-events: auto;
}

.sticker.selected { 
    outline: 2px dashed #f06292; 
}
</style>