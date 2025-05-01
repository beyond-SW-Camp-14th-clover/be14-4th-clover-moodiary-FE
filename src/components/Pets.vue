<template>
  <div class="pets-container" :class="{ 'pets-container--active': isActive }" @click="handleClick" @mouseover="handleHover">
    <img :src="getPetImage" alt="펫" class="pet-image" />
    <div class="pet-message" v-if="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const userName = computed(() => authStore.user?.name || '회원')

const selectedPet = ref(1) // 기본값은 pet1
const message = ref('')
const isActive = ref(false)
let messageInterval

const getPetImage = computed(() => {
  return `/src/assets/pets/pet${selectedPet.value}.png`
})

// 감정 점수에 따른 메시지 생성
const getEmotionMessage = (emotionData) => {
  if (!emotionData) return '아직 일기를 작성하지 않으셨네요!'
  
  const { positiveScore, neutralScore, negativeScore } = emotionData
  
  // 가장 높은 점수를 가진 감정을 찾음
  const maxScore = Math.max(positiveScore, neutralScore, negativeScore)
  
  if (maxScore === positiveScore) {
    return `${userName.value} 님의 기분이 좋아보여요!`
  } else if (maxScore === neutralScore) {
    return `${userName.value} 님의 기분이 보통인 것 같아 보여요`
  } else {
    return `${userName.value} 님의 기분이 좋지 않아보여요...`
  }
}

// 가장 최근 일기의 감정 점수를 가져오는 함수
const fetchLatestDiaryEmotion = async () => {
  try {
    // 오늘 날짜를 YYYY-MM-DD 형식으로 변환
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`
    
    // 오늘 날짜부터 과거로 검색하면서 일기를 찾음
    let currentDate = new Date(today)
    let foundDiary = null
    
    // 최대 7일 전까지 검색
    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const response = await axios.get(`/mydiary/daily/${dateStr}`, {
        params: {
          userId: 1 // 임시로 고정된 userId 사용
        }
      })
      
      if (response.data && response.data.myDiaryEmotion) {
        foundDiary = response.data.myDiaryEmotion
        break
      }
      
      // 하루 전으로 이동
      currentDate.setDate(currentDate.getDate() - 1)
    }
    
    return foundDiary || null
  } catch (error) {
    console.error('최근 일기 조회 실패:', error)
    return null
  }
}

// 호버 이벤트 핸들러
const handleHover = async () => {
  const emotionData = await fetchLatestDiaryEmotion()
  message.value = getEmotionMessage(emotionData)
  isActive.value = true
  setTimeout(() => {
    isActive.value = false
  }, 3000)
}

// 행동 추천을 가져오는 함수
const fetchRecommendedActions = async () => {
  try {
    const userId = 1; // 임시로 고정된 userId 사용
    const response = await axios.get(`/action/recommend`, {
      params: {
        userId: userId
      }
    });
    
    const data = response.data;
    console.log('추천 행동 데이터:', data); // 디버깅을 위한 로그
    if (data && data.length > 0) {
      // 첫 번째 추천 행동의 content 속성을 반환
      return data[0].content || data[0].action || data[0].recommendation || data[0];
    }
    return null;
  } catch (error) {
    console.error('행동 추천을 불러오는데 실패했습니다:', error);
    return null;
  }
}

// B 기능: 클릭 시 표시되는 메시지
const showClickMessage = async () => {
  const recommendedAction = await fetchRecommendedActions();
  const emotionData = await fetchLatestDiaryEmotion();
  
  console.log('추천 행동:', recommendedAction);
  console.log('감정 데이터:', emotionData);
  
  if (recommendedAction && emotionData) {
    const { positiveScore, neutralScore, negativeScore } = emotionData;
    const maxScore = Math.max(positiveScore, neutralScore, negativeScore);
    
    let messageTemplate = '';
    if (maxScore === positiveScore) {
      messageTemplate = `기분이 좋을 땐 ${recommendedAction}을(를) 해보신다면 기분이 더 좋아질 것 같은데 어떨까요?`;
    } else if (maxScore === neutralScore) {
      messageTemplate = `기분이 평험한 날엔 ${recommendedAction}을(를) 해보신다면 어떨까요?`;
    } else {
      messageTemplate = `기분이 좋지 않은 날엔 ${recommendedAction}을(를) 해보신다면 어떨까요?`;
    }
    
    message.value = messageTemplate;
  } else {
    message.value = '고마워요! 저는 당신의 친구가 되어 기뻐요!';
  }
  
  isActive.value = true;
  setTimeout(() => {
    isActive.value = false;
  }, 3000);
}

const handleClick = async () => {
  await showClickMessage();
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