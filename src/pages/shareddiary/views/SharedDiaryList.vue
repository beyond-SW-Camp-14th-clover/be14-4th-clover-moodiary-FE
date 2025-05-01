<template>
  <div class="outer-wrapper">
    <div class="diary-container">
      <div class="top-bar">
        <p class="room-id">방 번호: {{ roomId }}</p>
        <button
          @click="writeDiary"
          :disabled="!canWrite"
          class="write-btn"
        >✍️ 일기 작성</button>
      </div>

      <div class="diary-list">
        <div
          v-for="diary in diaries"
          :key="diary.id"
          class="diary-bubble"
          :class="bubbleClass(diary)"
          @click="goToDetail(diary.id)"
        >
          <div class="bubble-inner">
            <p class="title">{{ diary.title }}</p>
            <div class="footer">
              <span class="author">{{ diary.userName }}</span>
              <span class="created-at">{{ formatDate(diary.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const roomId = Number(route.params.roomId)
const authStore = useAuthStore()

const loginUserId = computed(() => authStore.user?.id)
const diaries = ref([])

const formatDate = (isoString) => {
  const date = new Date(isoString)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`
}

const canWrite = computed(() => {
  if (!loginUserId.value || diaries.value.length === 0) return true
  return diaries.value[0].userId !== loginUserId.value
})

const writeDiary = () => {
  if (!canWrite.value) {
    alert('아직 내 차례가 아니에요!')
    return
  }
  router.push({ name: 'SharedDiaryWrite', params: { roomId } })
}

const goToDetail = (diaryId) => {
  router.push({ name: 'SharedDiaryDetail', params: { roomId, diaryId } })
}

const bubbleClass = (diary) => {
  console.log(`🟨 diary.userId=${diary.userId}, loginUserId=${loginUserId.value}`)
  return diary.userId === loginUserId.value ? 'mine' : 'theirs'
}

// ✅ 로그인 유저 감지 후 fetch
watch(
  loginUserId,
  async (id) => {
    if (id) {
      console.log('✅ 로그인 유저 ID:', id)
      loginUserId.value = id  // ref에도 넣어줌

      try {
        const res = await axios.get('/shareddiary', { params: { roomId } })
        diaries.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        console.log('📘 일기:', diaries.value.map(d => ({ id: d.id, userId: d.userId })))
      } catch (e) {
        console.error('❌ 일기 불러오기 실패:', e)
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.outer-wrapper {
  display: flex;
  justify-content: center;
}
.diary-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 720px;
}
.top-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 1rem;
}
.room-id {
  font-size: 1.4rem;
  font-weight: bold;
  color: #5d3e2f;
}
.write-btn {
  background-color: #6f9d6b;
  color: white;
  padding: 1rem 1.6rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
.write-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.write-btn:hover:enabled {
  background-color: #5a8755;
}
.diary-list {
  width: 100%;
  background-color: #fdfaf5;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.diary-bubble {
  max-width: 90%;
  padding: 1rem;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.diary-bubble.mine {
  align-self: flex-end;
  background-color: #dcf8c6;
}
.diary-bubble.theirs {
  align-self: flex-start;
  background-color: #ffffff;
}
.bubble-inner {
  display: flex;
  flex-direction: column;
}
.title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}
.footer {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #555;
  display: flex;
  justify-content: space-between;
}
</style>
