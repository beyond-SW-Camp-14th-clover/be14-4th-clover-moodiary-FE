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
        <div class="bubble-inner">
          <p class="title">{{ diary.title }}</p>
          <div class="footer">
            <span class="author">{{ getUserName(diary.user_id) }}</span>
            <span class="created-at">{{ formatDate(diary.created_at) }}</span>
          </div>
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
.outer-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 3rem;
}

.side-left, .side-right {
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.room-id {
  font-size: 1.4rem;
  font-weight: bold;
  color: #5d3e2f;
  text-align: center;
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
  flex: 1;
  max-width: 720px;
  background-color: #fdfaf5;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem; /* ✅ gap 줄임 */
}

.diary-bubble {
  max-width: 90%;
  padding: 1rem; /* ✅ padding 살짝 줄임 */
  border-radius: 18px;
  background-color: #fffce6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  min-height: 100px; /* ✅ min-height 낮춤 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bubble-inner {
  display: flex;
  flex-direction: column;
}

.mine {
  margin-left: auto;
  background-color: #dcf8c6; /* 카카오 채팅에서 보는 마지막자 버블 형상 */
}

.theirs {
  margin-right: auto;
  background-color: #ffffff;
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