<template>
  <div class="detail-wrapper">
    
    <!-- ✅ 상단 제목 + 날짜 -->
    <div class="header">
      <h2 class="detail-title">{{ diary?.title }}</h2>
      <p class="detail-date">{{ formattedDate }}</p>
    </div>

    <!-- ✅ 본문 영역 -->
    <div class="textarea-wrapper">
      <div class="notebook-textarea">
        <p v-for="line in contentLines" :key="line" class="diary-line">{{ line }}</p>
        <div class="sticker-layer">
          <img
            v-for="(sticker, i) in stickers"
            :key="i"
            :src="sticker.url"
            class="sticker"
            :style="{
              left: sticker.x + 'px',
              top: sticker.y + 'px',
              width: sticker.width + 'px',
              height: sticker.height + 'px'
            }"
            draggable="false"
          />
        </div>
      </div>
    </div>

    <div class="button-wrapper">
      <button class="back-button" @click="goBack">← 돌아가기</button>
      <button class="edit-button" @click="goEdit">✏️ 수정하기</button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const route = useRoute()
const router = useRouter()

const diaryId = Number(route.params.diaryId)

const diary = ref(null)
const stickers = ref([])
const contentLines = ref([])

onMounted(async () => {
  const res = await axios.get(`http://localhost:3001/shared_diaries/${diaryId}`)
  diary.value = res.data

  if (diary.value?.style_layer) {
    try {
      stickers.value = JSON.parse(diary.value.style_layer)
    } catch (e) {
      console.error('스티커 레이어 파싱 실패', e)
    }
  }

  if (diary.value?.content) {
    contentLines.value = diary.value.content.split('\n')
  }
})

// ✅ 작성일자 포맷팅
const formattedDate = computed(() => {
  if (!diary.value?.created_at) return ''
  return format(new Date(diary.value.created_at), 'yyyy년 M월 d일', { locale: ko })
})

// ✅ 돌아가기
const goBack = () => {
  if (diary.value?.shared_diary_room_id) {
    router.push(`/shareddiary/${diary.value.shared_diary_room_id}`);
  } else {
    router.push('/mydiary/shareddiary');
  }
}

const goEdit = () => {
  if (diary.value?.shared_diary_room_id) {
    router.push(`/shareddiary/${diary.value.shared_diary_room_id}/edit/${diaryId}`);
  }
}
</script>

<style scoped>
/* ✅ 전체 포근한 스타일 */

.detail-wrapper {
  max-width: 850px;
  margin: 4rem auto;
  padding: 3rem;
  background-color: #fffbe6;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  font-family: 'Nanum Pen Script', cursive;
  animation: fadeIn 1s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.detail-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #5d3e2f;
  border-bottom: 2px dashed #d9c7aa;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.detail-date {
  font-size: 1.2rem; /* ✅ 더 크게 */
  color: #7a5c44;     /* ✅ 더 진하게 */
  margin-top: 0.5rem;
  font-family: 'Nanum Pen Script', cursive;
}

.textarea-wrapper {
  position: relative;
  border: 1px solid #d9c7aa;
  border-radius: 12px;
  background-color: #fffce6;
  overflow: hidden;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.05);
}

.notebook-textarea {
  position: relative;
  padding: 2rem;
  min-height: 500px;
  background-image: repeating-linear-gradient(
    to bottom,
    #fffce6 0px,
    #fffce6 33px,
    #d9c7aa 34px
  );
  background-size: 100% 34px;
  background-position-y: 12px;
  font-size: 1.4rem;
  line-height: 38px; /* ✅ 줄 간격 더 부드럽게 */
  color: #6b4c3b;
}

.diary-line {
  margin: 0;
}

.sticker-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
}

.sticker {
  position: absolute;
  pointer-events: none;
  user-select: none;
}

.button-wrapper {
  margin-top: 2.5rem;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 1.2rem; /* ✅ 버튼 간격 추가 */
}


/* 돌아가기 버튼 */
.back-button, .edit-button {
  padding: 0.8rem 1.8rem;
  font-size: 1.4rem;
  background-color: #f5eccc;
  color: #5d3e2f;
  border: 2px solid #d9c7aa;
  border-radius: 12px;
  font-family: 'Nanum Pen Script', cursive;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover, .edit-button:hover {
  background-color: #eedfa3;
  transform: translateY(-3px);
}
</style>
