<template>
  <div class="diary-page">
    <transition name="page-flip" mode="out-in">
      <div v-if="diary" key="diary" class="write-wrapper">
        
        <!-- 제목 + 날짜 -->
        <div class="header-section">
          <h2 class="today-title">✍️ {{ todayString }} 일기</h2>

          <div class="title-section">
            <input type="text" :value="diary.title" class="title-input" disabled />
          </div>
        </div>

        <!-- 본문 + 스티커 -->
        <div class="textarea-wrapper">
          <div class="notebook-textarea">
            <div class="diary-content">
              {{ diary.content }}
            </div>

            <div class="sticker-layer">
              <template v-for="(sticker, i) in stickers" :key="i">
                <div
                  v-if="sticker.url"
                  class="sticker-wrapper"
                  :style="{
                    left: sticker.x + 'px',
                    top: sticker.y + 'px',
                    width: sticker.width + 'px',
                    height: sticker.height + 'px',
                    zIndex: i
                  }"
                >
                  <img :src="sticker.url" class="sticker" draggable="false" />
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="sticker-toolbar">
          <button type="button" class="submit-btn" @click="goBack">← 돌아가기</button>
          <button
            v-if="diary.userId === loginUserId"
            type="button"
            class="submit-btn"
            @click="goEdit"
          >
            ✏️ 수정하기
          </button>
        </div>

      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()

const diaryId = route.params.diaryId  
const authStore = useAuthStore()  
const loginUserId = computed(() => authStore.user?.id)

const diary = ref(null)
const stickers = ref([])

onMounted(async () => {
  try {
    const res = await axios.get(`/shareddiary/${diaryId}`)
    diary.value = res.data

    if (diary.value?.styleLayer) {
      stickers.value = JSON.parse(diary.value.styleLayer)
    }
  } catch (e) {
    console.error('일기 불러오기 실패', e)
    alert('일기를 불러올 수 없습니다.')
    router.push('/shareddiary/room')
  }
})

const todayString = computed(() => {
  if (!diary.value?.createdAt) return ''
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const date = new Date(diary.value.createdAt)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}`
})

const goBack = () => {
  const roomId = diary.value?.sharedDiaryRoomId
  if (roomId) {
    router.push({ name: 'SharedDiaryList', params: { roomId } })
  } else {
    router.push('/mydiary/shareddiary')
  }
}

const goEdit = () => {
  router.push({
    name: 'SharedDiaryEdit',
    params: {
      roomId: diary.value.sharedDiaryRoomId,
      diaryId
    }
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

.diary-page { perspective: 1500px; }
.page-flip-enter-active, .page-flip-leave-active { transition: transform 0.6s ease; transform-style: preserve-3d; }
.page-flip-enter-from { transform: rotateY(-90deg); }
.page-flip-leave-to { transform: rotateY(90deg); }

.write-wrapper {
  max-width: 850px;
  margin: 4rem auto;
  padding: 3rem;
  background-color: #fffce6;
  border-radius: 20px;
  border: 3px dashed #d9c7aa;
  font-family: 'Ownglyph PDH', sans-serif;
  font-size: 18px;
  color: #535353;
  position: relative;
  animation: inkFadeIn 1.2s ease;
}
@keyframes inkFadeIn {
  from { filter: blur(3px); opacity: 0; transform: scale(1.02); }
  to { filter: none; opacity: 1; transform: scale(1); }
}

.write-form { display: flex; flex-direction: column; gap: 1.5rem; }

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.today-title {
  font-size: 2rem;
  font-weight: bold;
  color: #5d3e2f;
  border-bottom: 2px dashed #d9c7aa;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.title-section {
  margin-top: 1.5rem;
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
}

.textarea-wrapper {
  position: relative;
  border: 1px solid #d9c7aa;
  border-radius: 10px;
  background-color: #fffce6;
  overflow: auto;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.08);
}

.notebook-textarea {
  position: relative;
  padding: 12px 18px;
  min-height: 500px;
  background: repeating-linear-gradient(
    to bottom,
    #fffce6 0px,
    #fffce6 33px,
    #d9c7aa 34px
  );
  background-size: 100% 34px;
  background-position-y: 12px;
  font-family: 'Ownglyph PDH', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #535353;
  box-sizing: border-box;
  border: none;
  outline: none;
}

.diary-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.sticker-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
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
}

.sticker-toolbar {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 2rem;
}

.submit-btn {
  all: unset;
  width: 122px;
  height: 46px;
  background-color: #E9D2AF;
  color: #535353;
  border-radius: 10px;
  font-family: 'Ownglyph PDH', sans-serif;
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.submit-btn:hover {
  background-color: #d1b07a;
}
</style>
