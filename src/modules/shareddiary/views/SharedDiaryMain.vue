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
  
  const router = useRouter()
  const loginUserId = 1 // 임시 로그인 유저
  
  const rooms = ref([])
  const diaries = ref([])
  const users = ref([])
  
  // 유저 ID → 이름 변환
  const getUserName = (id) => {
    const user = users.value.find((u) => Number(u.id) === Number(id))
    return user ? user.name : '알 수 없음'
  }
  
  // 카드 리스트 계산
  const roomCards = computed(() => {
    if (!users.value.length) return []
  
    return rooms.value
      .filter(r => r.user_id1 === loginUserId || r.user_id2 === loginUserId)
      .sort((a, b) => b.id - a.id)
      .map(r => {
        const roomDiaries = diaries.value
          .filter(d => Number(d.shared_diary_room_id) === Number(r.id))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  
        const latest = roomDiaries[0]
  
        return {
          roomId: r.id,
          latestTitle: latest?.title ?? '아직 작성된 일기가 없어요',
          authorName: getUserName(latest?.user_id),
          createdAt: latest?.created_at ?? null
        }
      })
  })
  
  // ✅ 방 생성
  const createRoom = async () => {
    try {
      const res = await axios.post('http://localhost:3001/shared_diary_rooms', {
        user_id1: loginUserId,
        user_id2: null
      })
      const newRoom = res.data
      alert(`방이 생성되었습니다! 방 번호: ${newRoom.id}`)
      rooms.value.push(newRoom)
    } catch (err) {
      console.error('방 생성 실패', err)
      alert('방 생성에 실패했습니다.')
    }
  }
  
  // ✅ 방 입장
  const enterRoom = async () => {
    const input = prompt('입장할 방 번호를 입력하세요.')
    if (!input) return
    const roomId = Number(input)
    if (isNaN(roomId)) {
      alert('숫자만 입력해주세요!')
      return
    }
  
    try {
      const res = await axios.get(`http://localhost:3001/shared_diary_rooms/${roomId}`)
      const room = res.data
  
      if (!room) {
        alert('존재하지 않는 방입니다.')
        return
      }
  
      if (room.user_id2) {
        alert('이미 인원이 다 찬 방입니다.')
        return
      }
  
      // 조건 통과 → user_id2로 나를 등록
      await axios.patch(`http://localhost:3001/shared_diary_rooms/${roomId}`, {
        user_id2: loginUserId
      })
  
      alert('방에 입장했습니다!')
      router.push({ name: 'SharedDiaryList', params: { roomId } })
    } catch (err) {
      console.error('입장 실패', err)
      alert('입장할 수 없습니다.')
    }
  }
  
  // 기존 방 클릭
  const goToRoom = (roomId) => {
    router.push({ name: 'SharedDiaryList', params: { roomId } })
  }
  
  onMounted(async () => {
    const [resRoom, resDiary, resUser] = await Promise.all([
      axios.get('http://localhost:3001/shared_diary_rooms'),
      axios.get('http://localhost:3001/shared_diaries'),
      axios.get('http://localhost:3001/users')
    ])
    rooms.value = resRoom.data
    diaries.value = resDiary.data
    users.value = resUser.data
  })
  
  // 날짜 포맷
  const formatDate = (isoString) => {
    const date = new Date(isoString)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`
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
  