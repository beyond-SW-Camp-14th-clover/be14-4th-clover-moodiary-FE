<template>
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
          <p class="created-at" v-if="room.createdAt">
            {{ formatDate(room.createdAt) }}
          </p>
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
  
  // 유저 ID → 이름 변환 함수
  const getUserName = (id) => {
    const user = users.value.find((u) => Number(u.id) === Number(id))
    return user ? user.name : '알 수 없음'
    }
  // 카드 리스트 계산
  const roomCards = computed(() => {
    if (!users.value.length) return []

    return rooms.value
        .filter(r => r.user_id1 === loginUserId || r.user_id2 === loginUserId)
        .sort((a, b) => b.id - a.id) // ← 방 ID 내림차순 정렬!
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

    console.log("✅ users loaded", users.value)
    console.log("🧠 user ids in diaries", diaries.value.map(d => d.user_id))
  })

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
  
  