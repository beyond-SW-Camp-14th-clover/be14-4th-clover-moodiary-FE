<template>
    <div class="outer-wrapper">
      <div class="diary-list">
        <div
          v-for="diary in diaries"
          :key="diary.id"
          class="diary-bubble"
          :class="{ mine: diary.user_id === loginUserId, theirs: diary.user_id !== loginUserId }"
        >
          <p class="title">{{ diary.title }}</p>
          <div class="footer">
            <span class="author">{{ getUserName(diary.user_id) }}</span>
            <span class="created-at">{{ formatDate(diary.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const roomId = route.params.roomId
  const diaries = ref([])
  const users = ref([])
  const loginUserId = 1 // 임시 로그인 유저 ID
  
  const getUserName = (id) => {
    const user = users.value.find((u) => Number(u.id) === Number(id))
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
  
  onMounted(async () => {
    const [resDiary, resUser] = await Promise.all([
      axios.get('http://localhost:3001/shared_diaries'),
      axios.get('http://localhost:3001/users')
    ])
    users.value = resUser.data
    diaries.value = resDiary.data
      .filter(d => d.shared_diary_room_id === Number(roomId))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // 시간 순 정렬
  })
  </script>
  
  <style scoped>
  .outer-wrapper {
    display: flex;
    justify-content: center;
    padding: 3rem 1rem;
  }
  
  .diary-list {
    width: 100%;
    max-width: 640px;
    min-height: 80vh;
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
  