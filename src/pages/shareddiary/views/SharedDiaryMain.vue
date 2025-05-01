<template>
    <div>
      <div class="button-area">
        <button @click="createRoom" class="create-room-btn">일기방 생성하기</button>
        <button @click="enterRoom" class="enter-room-btn">입장하기</button>
      </div>
  
      <div class="room-grid">
        <div
          class="room-card"
          v-for="room in roomCards"
          :key="room.roomId"
          @click="goToRoom(room.roomId)"
        >
          <p class="title">{{ room.latestTitle }}</p>
          <div class="card-footer">
            <p class="author">{{ room.authorName }}</p>
            <p class="created-at" v-if="room.createdAt">{{ formatDate(room.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const loginUserId = computed(() => authStore.user?.id)
  
  const rooms = ref([])
  
  // ✅ 카드 정보 바로 사용 가능
  const roomCards = computed(() => {
    return rooms.value.map(r => ({
      roomId: r.roomId,
      latestTitle: r.latestTitle ?? '아직 작성된 일기가 없어요',
      authorName: r.authorName ?? '작성자 없음',
      createdAt: r.createdAt ?? null
    }))
  })
  
  // ✅ Spring 서버로 공유 일기방 생성
  const createRoom = async () => {
    try {
      const res = await axios.post('/shareddiaryroom/create', {
        userId1: loginUserId.value
      })
      const roomId = res.data.roomId
      alert(`방이 생성되었습니다! 방 번호: ${roomId}`)
      fetchRooms()
    } catch (err) {
      console.error('방 생성 실패', err)
      alert('방 생성 실패')
    }
  }
  
  // ✅ Spring 서버로 공유 일기방 입장
  const enterRoom = async () => {
    const input = prompt('입장할 방 번호를 입력하세요.')
    if (!input) return
    const roomId = Number(input)
    if (isNaN(roomId)) return alert('숫자만 입력하세요.')
  
    try {
      await axios.post('/shareddiaryroom/enter', {
        roomId,
        userId: loginUserId.value
      })
      alert('입장 완료!')
      router.push({ name: 'SharedDiaryList', params: { roomId } })
    } catch (err) {
      console.error('입장 실패', err)
      alert('입장 실패')
    }
  }
  
  // ✅ 페이지 진입 시 방 리스트 조회
  const fetchRooms = async () => {
    try {
      const res = await axios.get('/shareddiaryroom', {
        params: { userId: loginUserId.value }
      })
      rooms.value = res.data
    } catch (err) {
      console.error('방 리스트 불러오기 실패', err)
    }
  }
  
  onMounted(fetchRooms)
  
  // ✅ 날짜 포맷
  const formatDate = (isoString) => {
    const date = new Date(isoString)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`
  }
  
  // ✅ 카드 클릭 시 이동
  const goToRoom = (roomId) => {
    router.push({ name: 'SharedDiaryList', params: { roomId } })
  }
  </script>
  
  <style scoped>
  .button-area {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .create-room-btn,
  .enter-room-btn {
    background-color: #a87746;
    color: white;
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .create-room-btn:hover,
  .enter-room-btn:hover {
    background-color: #8c6239;
  }
  
  .room-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
  }
  
  .room-card {
    width: 220px;
    height: 320px;
    background: #fffce6;
    border-radius: 24px;
    border-left: 14px solid #a87746;
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.15),
      inset 12px 0 0 #d2b48c;
    padding: 2rem 1.2rem 1.5rem 2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease;
  }
  
  .room-card:hover {
    transform: scale(1.03);
  }
  
  .room-card::before {
    content: "";
    position: absolute;
    left: -9px;
    top: 1.2rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff8d6;
    box-shadow:
      0 28px 0 #fff8d6,
      0 56px 0 #fff8d6,
      0 84px 0 #fff8d6;
  }
  
  .title {
    font-weight: bold;
    font-size: 1.1rem;
    text-align: center;
    margin-top: 1rem;
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: #555;
  }
  </style>
  