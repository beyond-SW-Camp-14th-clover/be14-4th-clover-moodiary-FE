<template>
  <div v-if="shouldShowPet" class="pets-container" :class="{ 'pets-container--active': isActive }" @click="handleClick" @mouseover="handleHover">
    <img :src="getPetImage" alt="펫" class="pet-image" />
    <div class="pet-message" v-if="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import pet1 from '@/assets/pets/pet1.png'
import pet2 from '@/assets/pets/pet2.png'
import pet3 from '@/assets/pets/pet3.png'
import pet4 from '@/assets/pets/pet4.png'
import pet5 from '@/assets/pets/pet5.png'
import pet6 from '@/assets/pets/pet6.png'
import pet7 from '@/assets/pets/pet7.png'
import pet8 from '@/assets/pets/pet8.png'
import pet9 from '@/assets/pets/pet9.png'
import pet10 from '@/assets/pets/pet10.png'
import pet11 from '@/assets/pets/pet11.png'

const authStore = useAuthStore()
const route = useRoute()
const userName = computed(() => authStore.user?.name || '회원')

const selectedPet = ref(1)
const message = ref('')
const isActive = ref(false)
let messageInterval

const petImages = {
  1: pet1,
  2: pet2,
  3: pet3,
  4: pet4,
  5: pet5,
  6: pet6,
  7: pet7,
  8: pet8,
  9: pet9,
  10: pet10,
  11: pet11
}

const getPetImage = computed(() => {
  if (petInfo.value?.petId) {
    return petImages[petInfo.value.petId] || petImages[selectedPet.value]
  }
  return petImages[selectedPet.value]
})

const petInfo = ref(null)

const shouldShowPet = computed(() => {

  if (!authStore.isLogin) return false

  if (!route.path.startsWith('/app')) return false

  if (route.path === '/app/mypage/pet') return true
  
  return route.path !== '/app/home' && !route.path.startsWith('/app/mypage')
})

const getEmotionMessage = (emotionData) => {
  if (!emotionData) return '아직 일기를 작성하지 않으셨네요!'
  
  const { positiveScore, neutralScore, negativeScore } = emotionData
 
  const maxScore = Math.max(positiveScore, neutralScore, negativeScore)
  
  if (maxScore === positiveScore) {
    return `${userName.value} 님의 기분이 좋아보여요!`
  } else if (maxScore === neutralScore) {
    return `${userName.value} 님의 기분이 보통인 것 같아 보여요`
  } else {
    return `${userName.value} 님의 기분이 좋지 않아보여요...`
  }
}


const fetchLatestDiaryEmotion = async () => {
  try {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`
    
    let currentDate = new Date(today)
    let foundDiary = null
    

    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const response = await axios.get(`/mydiary/daily/${dateStr}`, {
        params: {
          userId: 1 
        }
      })
      
      if (response.data && response.data.myDiaryEmotion) {
        foundDiary = response.data.myDiaryEmotion
        break
      }
      
      currentDate.setDate(currentDate.getDate() - 1)
    }
    
    return foundDiary || null
  } catch (error) {
    console.error('최근 일기 조회 실패:', error)
    return null
  }
}

const handleHover = async () => {
  const emotionData = await fetchLatestDiaryEmotion()
  message.value = getEmotionMessage(emotionData)
  isActive.value = true
  setTimeout(() => {
    isActive.value = false
  }, 3000)
}

const fetchRecommendedActions = async () => {
  try {
    const userId = 1;
    const response = await axios.get(`/action/recommend`, {
      params: {
        userId: userId
      }
    });
    
    const data = response.data;
    console.log('추천 행동 데이터:', data);
    if (data && data.length > 0) {

      return data[0].content || data[0].action || data[0].recommendation || data[0];
    }
    return null;
  } catch (error) {
    console.error('행동 추천을 불러오는데 실패했습니다:', error);
    return null;
  }
}

const showDefaultMessage = () => {
  message.value = `안녕하세요 ${userName.value}님! 최근 당신의 감정이 궁금하실 땐 저를 클릭해주세요`;
  isActive.value = true;
  setTimeout(() => {
    isActive.value = false;

    const randomDelay = Math.floor(Math.random() * 5000) + 5000;
    setTimeout(showDefaultMessage, randomDelay);
  }, 3000);
}


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
      messageTemplate = `기분이 좋지 않은 날엔 ${recommendedAction}을(를) 해보신다면 어떨까요? 기분이 한결 나아질 것 같아요`;
    }
    
    message.value = messageTemplate;
  } else {
    message.value = '고마워요! 저는 당신의 친구가 되어 기뻐요!';
  }
  
  isActive.value = true;
  setTimeout(() => {
    isActive.value = false;

    const randomDelay = Math.floor(Math.random() * 5000) + 5000;
    setTimeout(showDefaultMessage, randomDelay);
  }, 3000);
}

const handleClick = async () => {
  await showClickMessage();
}

const changePet = (petNumber) => {
  if (petNumber >= 1 && petNumber <= 11) {
    selectedPet.value = petNumber
  }
}

const fetchCurrentPet = async () => {
  try {
    const response = await axios.get('/pets/current')
    petInfo.value = response.data
  } catch (error) {
    console.error('펫 정보를 가져오는데 실패했습니다:', error)
  }
}

const fetchPets = async () => {
    try {
        const userId = authStore.userId;
        const response = await axios.get(`/pet/${userId}`);
        pets.value = response.data;
    } catch (error) {
        console.error('펫 정보를 가져오는 중 오류가 발생했습니다:', error);
    }
};

const addPet = async () => {
    try {
        const userId = authStore.userId;
        const response = await axios.post('/pet', {
            userId: userId,
            name: newPetName.value,
            type: newPetType.value
        });
        pets.value.push(response.data);
        newPetName.value = '';
        newPetType.value = '';
    } catch (error) {
        console.error('펫 추가 중 오류가 발생했습니다:', error);
    }
};

onMounted(() => {
  fetchCurrentPet()
  showDefaultMessage()
})

onUnmounted(() => {
  clearInterval(messageInterval)
})

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