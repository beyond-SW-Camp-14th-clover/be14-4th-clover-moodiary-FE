<template>
  <div class="outer-wrapper">
    <!-- ⭐️ 좌측: 방 번호 -->
    <div class="side-left">
      <p class="room-id">방 번호: {{ roomId }}</p>
    </div>

    <!-- ⭐️ 가운데: 일기 리스트 -->
    <div class="diary-list">
      <div
        v-for="diary in diaries"
        :key="diary.id"
        class="diary-bubble"
        :class="{ mine: diary.user_id === loginUserId, theirs: diary.user_id !== loginUserId }"
        @click="goToDetail(diary.id)"
        style="cursor: pointer;"
      >
        <p class="title">{{ diary.title }}</p>
        <div class="footer">
          <span class="author">{{ getUserName(diary.user_id) }}</span>
          <span class="created-at">{{ formatDate(diary.created_at) }}</span>
        </div>
      </div>
    </div>

    <!-- ⭐️ 우측: 일기 작성 버튼 -->
    <div class="side-right">
      <button
        @click="writeDiary"
        :disabled="!canWrite"
        class="write-btn"
      >✍️ 일기 작성</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const roomId = Number(route.params.roomId)
const loginUserId = 1

const diaries = ref([])
const users = ref([])

const getUserName = (id) => {
  const user = users.value.find(u => Number(u.id) === Number(id))
  return user ? user.name : '알 수 없음'
}

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
  if (diaries.value.length === 0) return true
  const last = diaries.value[0]
  return last.user_id !== loginUserId
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

onMounted(async () => {
  const [resDiary, resUser] = await Promise.all([
    axios.get('http://localhost:3001/shared_diaries'),
    axios.get('http://localhost:3001/users')
  ])
  users.value = resUser.data
  diaries.value = resDiary.data
    .filter(d => d.shared_diary_room_id === roomId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})
</script>

<style scoped>
/* (다전은 기존와 같은 스테일) */
.outer-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  padding: 3rem 1rem;
}
.side-left, .side-right {
  display: flex;
  align-items: flex-start;
  margin-top: 1rem;
}
.room-id {
  font-size: 1rem;
  font-weight: bold;
  color: #5d3e2f;
}
.write-btn {
  background-color: #6f9d6b;
  color: white;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  max-width: 640px;
  background-color: #fdfaf5;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.diary-bubble {
  max-width: 75%;
  padding: 1.2rem;
  border-radius: 18px;
  background-color: #fffce6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  word-break: break-word;
}
.mine {
  margin-left: auto;
  background-color: #d8f5dc;
  text-align: right;
}
.theirs {
  margin-right: auto;
  background-color: #fef4d6;
  text-align: left;
}
.title {
  font-weight: bold;
  font-size: 1.05rem;
  margin-bottom: 0.8rem;
}
.footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #555;
  margin-top: 0.5rem;
}
</style>
