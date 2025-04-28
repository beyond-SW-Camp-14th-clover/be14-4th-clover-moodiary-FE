<template>
  <div v-if="show" class="confirm-check-overlay">
    <div class="confirm-check-content">
      <h3 class="confirm-check-title">{{ title }}</h3>
      <p class="confirm-check-message">{{ message }}</p>
      <div class="confirm-check-buttons">
        <button type="button" @click="$emit('confirm')" class="confirm-check-btn confirm-check-btn-confirm">확인</button>
        <button type="button" @click="$emit('cancel')" class="confirm-check-btn confirm-check-btn-cancel">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ConfirmCheck from '../components/ConfirmCheck.vue'
import RegistCheck from '../components/RegistCheck.vue'

const route = useRoute()
const router = useRouter()
const roomId = Number(route.params.roomId)
const loginUserId = 1

const title = ref('')
const content = ref('')
const stickers = ref([])
const selectedIndex = ref(null)
const showStickerModal = ref(false)
const fileInput = ref(null)
const selectedDate = ref(new Date())
const showConfirmModal = ref(false)
const isConfirmed = ref(false)
const showRegistModal = ref(false)
const hashtags = ref([])
const isComposing = ref(false)

const stickerOptions = [
  '/src/assets/stickers/heart.png',
  '/src/assets/stickers/star.png',
  '/src/assets/stickers/rabbit.png'
]

const triggerFileInput = () => {
  fileInput.value?.click()
}

const addSticker = (url) => {
  stickers.value.push({ url, x: 100, y: 100, width: 80, height: 80, type: 'sticker' })
}

const handlePhotoUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    stickers.value.push({
      url: reader.result,
      x: 100,
      y: 100,
      width: 140,
      height: 140,
      type: 'photo'
    })
  }
  reader.readAsDataURL(file)
}

let dragging = ref(null)
let resizing = ref(null)

const startDrag = (index, event) => {
  event.preventDefault()
  dragging.value = {
    index,
    startX: event.clientX,
    startY: event.clientY,
    origX: stickers.value[index].x,
    origY: stickers.value[index].y
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
  if (!dragging.value) return
  const { index, startX, startY, origX, origY } = dragging.value
  const deltaX = event.clientX - startX
  const deltaY = event.clientY - startY

  const wrapper = document.querySelector('.textarea-wrapper')
  const maxX = wrapper.offsetWidth - stickers.value[index].width
  const maxY = wrapper.offsetHeight - stickers.value[index].height

  stickers.value[index].x = Math.min(Math.max(0, origX + deltaX), maxX)
  stickers.value[index].y = Math.min(Math.max(0, origY + deltaY), maxY)
}

const stopDrag = () => {
  dragging.value = null
  resizing.value = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopDrag)
}

const selectSticker = (index) => {
  if (selectedIndex.value !== index) {
    const target = stickers.value.splice(index, 1)[0]
    stickers.value.push(target)
    selectedIndex.value = stickers.value.length - 1
  }
}

const startResize = (index, event) => {
  event.preventDefault()
  resizing.value = {
    index,
    startX: event.clientX,
    startY: event.clientY,
    origWidth: stickers.value[index].width,
    origHeight: stickers.value[index].height
  }
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopDrag)
}

const onResize = (event) => {
  if (!resizing.value) return
  const { index, startX, startY, origWidth, origHeight } = resizing.value
  const deltaX = event.clientX - startX
  const deltaY = event.clientY - startY

  if (event.shiftKey) {
    const ratio = origWidth / origHeight
    const newWidth = Math.max(30, origWidth + deltaX)
    const newHeight = Math.max(30, newWidth / ratio)
    stickers.value[index].width = newWidth
    stickers.value[index].height = newHeight
  } else {
    stickers.value[index].width = Math.max(30, origWidth + deltaX)
    stickers.value[index].height = Math.max(30, origHeight + deltaY)
  }
}

const deleteSelected = () => {
  if (selectedIndex.value !== null) {
    const target = stickers.value[selectedIndex.value]
    stickers.value = stickers.value.filter((s) => s !== target)
    selectedIndex.value = null
  }
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && selectedIndex.value !== null) {
      deleteSelected()
    }
  })
})

const handleContentInput = (e) => {
  content.value = e.target.value
  if (!isComposing.value) {
    checkHashtag()
  }
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = () => {
  isComposing.value = false
  checkHashtag()
}

const checkHashtag = () => {
  const text = content.value
  const words = text.split(/\s+/)
  if (words.length > 1) {
    const lastWord = words[words.length - 2]
    if (lastWord && lastWord.startsWith('#')) {
      const hashtag = lastWord.slice(1)
      if (hashtag && !hashtags.value.includes(hashtag)) {
        hashtags.value.push(hashtag)
        const updatedWords = words.slice(0, words.length - 2).concat(words.slice(words.length - 1))
        content.value = updatedWords.join(' ') + ' '
      }
    }
  }
}

const submitDiary = async () => {
  try {
    await axios.post('http://localhost:3001/shared_diaries', {
      title: title.value,
      content: content.value,
      created_at: new Date().toISOString(),
      is_deleted: 'N',
      fixed_state: 'Y',
      shared_diary_room_id: roomId,
      user_id: loginUserId,
      style_layer: JSON.stringify(stickers.value),
      hashtags: hashtags.value
    })
    alert('일기 등록 완료!')
    router.push({ name: 'MonthlyDiary' })
  } catch (error) {
    console.error('등록 실패', error)
    alert('등록 실패')
  }
}

const confirmDiary = () => {
  if (!title.value || !content.value) {
    alert('제목과 내용을 모두 입력해주세요.')
    return
  }
  showConfirmModal.value = true
}

const handleConfirm = () => {
  isConfirmed.value = true
  showConfirmModal.value = false
}

const cancelDiary = () => {
  if (confirm('작성 중인 일기를 취소하시겠습니까?')) {
    router.push({ name: 'MonthlyDiary' })
  }
}

const removeHashtag = (index) => {
  hashtags.value.splice(index, 1)
}

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '확인'
  },
  message: {
    type: String,
    required: true
  }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.confirm-check-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirm-check-content {
  background-color: #fffce6;
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid #d9c7aa;
  text-align: center;
  min-width: 300px;
}

.confirm-check-title {
  margin: 0 0 1rem 0;
  color: #535353;
  font-family: 'Ownglyph PDH', sans-serif;
  font-size: 18px;
  font-weight: 400;
}

.confirm-check-message {
  margin: 0 0 1.5rem 0;
  color: #535353;
  font-family: 'Ownglyph PDH', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

.confirm-check-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.confirm-check-btn {
  all: unset;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-family: 'Ownglyph PDH', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  border: none;
  min-width: 80px;
  text-align: center;
  box-sizing: border-box;
}

.confirm-check-btn-confirm {
  background-color: #E9D2AF;
  color: #535353;
}

.confirm-check-btn-cancel {
  background-color: #E9D2AF;
  color: #535353;
}
</style> 