<template>
  <div class="pets-container" :class="{ 'pets-container--active': isActive }" @click="handleClick">
    <img :src="getPetImage" alt="펫" class="pet-image" />
    <div class="pet-message" v-if="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const selectedPet = ref(1) // 기본값은 pet1
const message = ref('')
const isActive = ref(false)
let messageInterval

const getPetImage = computed(() => {
  return `/src/assets/pets/pet${selectedPet.value}.png`
})

// A 기능: 주기적으로 메시지를 표시하는 함수
const showDefaultMessage = () => {
  message.value = '안녕하세요! 저를 클릭해보세요!'
  isActive.value = true
  setTimeout(() => {
    isActive.value = false
    // 다음 메시지까지 랜덤한 시간(5-10초) 대기
    const randomDelay = Math.floor(Math.random() * 5000) + 5000 // 5000ms ~ 10000ms
    setTimeout(showDefaultMessage, randomDelay)
  }, 3000)
}

// B 기능: 클릭 시 표시되는 메시지
const showClickMessage = () => {
  message.value = '고마워요! 저는 당신의 친구가 되어 기뻐요!'
  isActive.value = true
  setTimeout(() => {
    isActive.value = false
  }, 2000)
}

const handleClick = () => {
  showClickMessage()
}

// 펫 이미지 변경 함수
const changePet = (petNumber) => {
  if (petNumber >= 1 && petNumber <= 11) {
    selectedPet.value = petNumber
  }
}

onMounted(() => {
  showDefaultMessage()
})

onUnmounted(() => {
  clearInterval(messageInterval)
})

// 외부에서 펫을 변경할 수 있도록 함수를 노출
defineExpose({
  changePet
})
</script>

<style scoped>
.pets-container {
  position: fixed;
  bottom: 50px;
  left: 50px;
  cursor: pointer;
}

.pets-container--active {
  transform: none;
}

.pet-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  transform: scaleX(-1);
}

.pet-message {
  position: absolute;
  bottom: 70px;
  left: 130px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 2s ease;
}

.pets-container--active .pet-message {
  opacity: 1;
}

.pet-message::after {
  content: '';
  position: absolute;
  left: -10px;
  bottom: 10px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: rgba(0, 0, 0, 0.8);
  border-left: 0;
}
</style> 