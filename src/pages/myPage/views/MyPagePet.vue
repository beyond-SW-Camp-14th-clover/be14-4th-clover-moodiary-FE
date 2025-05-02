<template>
    <div class="pet-change-container">
      <h1>펫 변경</h1>
      <div class="pet-display">
        <button class="arrow-btn" @click="prevPet">◀</button>
        <div class="pet-image">
          <img :src="currentPetImage" alt="현재 선택된 펫" />
        </div>
        <button class="arrow-btn" @click="nextPet">▶</button>
      </div>
      <div class="button-group">
        <button class="select-btn" @click="selectPet">선택</button>
        <button class="cancel-btn" @click="cancelSelection">취소</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import { useAuthStore } from '@/stores/auth'
  
  const emit = defineEmits(['select-pet', 'close'])
  
  const authStore = useAuthStore()
  const currentPetIndex = ref(1)
  const imageTimestamp = ref(Date.now())
  const totalPets = 11
  
  const currentPetImage = computed(() => {
    return `/src/assets/pets/pet${currentPetIndex.value}.png?ts=${imageTimestamp.value}`
  })
  
  const prevPet = () => {
    currentPetIndex.value = currentPetIndex.value === 1 ? totalPets : currentPetIndex.value - 1
    imageTimestamp.value = Date.now()
  }
  
  const nextPet = () => {
    currentPetIndex.value = currentPetIndex.value === totalPets ? 1 : currentPetIndex.value + 1
    imageTimestamp.value = Date.now()
  }
  
  const selectPet = async () => {
    try {
      console.log('펫 변경 시작:', currentPetIndex.value)
      const data = { id: currentPetIndex.value }
      console.log('펫 업데이트 요청 데이터:', data)
      
      const updateResponse = await axios.post('/pets/update', data, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      console.log('펫 업데이트 응답:', updateResponse.data)

      // 펫 변경 후 즉시 상태 업데이트
      emit('select-pet', currentPetIndex.value)
      
      // 모달 닫기
      emit('close')

      // 페이지 새로고침
      window.location.reload()
    } catch (error) {
      console.error('펫 업데이트 중 오류가 발생했습니다:', error)
      console.error('오류 상세 정보:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
    }
  }
  
  const cancelSelection = () => {
    currentPetIndex.value = 1
    emit('close')
  }
  
  onMounted(async () => {
    try {
      const response = await axios.get('/pets/current', {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      if (response.data?.id) {
        currentPetIndex.value = response.data.id
        imageTimestamp.value = Date.now()
      }
    } catch (error) {
      console.error('현재 펫 정보를 가져오는 중 오류가 발생했습니다:', error)
    }
  })
  </script>
  
  <style scoped>
  .pet-change-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .pet-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 30px 0;
  }
  
  .arrow-btn {
    background: none;
    border: none;
    font-size: 40px;
    cursor: pointer;
    padding: 20px;
    margin: 0;
    line-height: 1;
    color: #000;
    text-decoration: none;
    box-shadow: none;
    outline: none;
    appearance: none;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .arrow-btn:hover {
    color: #666;
  }
  
  .pet-image {
    width: 130px;
    height: 130px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .pet-image img {
    max-width: 100%;
    max-height: 100%;
  }
  
  .button-group {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }
  
  .select-btn,
  .cancel-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: background-color 0.3s ease;
  }
  
  .select-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .select-btn:hover {
    background-color: #45a049;
  }
  
  .cancel-btn {
    background-color: #f44336;
    color: white;
  }
  
  .cancel-btn:hover {
    background-color: #d32f2f;
  }
  </style>
  