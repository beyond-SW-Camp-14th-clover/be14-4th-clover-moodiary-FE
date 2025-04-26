<template>
  <div class="diary-page">
    <transition name="page-flip" mode="out-in">
      <div key="diary" class="write-wrapper">
        <h2>✍️ 공유 일기 작성</h2>

        <form @submit.prevent="submitDiary" class="write-form">
          <input
            v-model="title"
            type="text"
            placeholder="제목을 입력하세요"
            required
            class="title-input"
          />

          <div class="textarea-wrapper">
            <textarea
              v-model="content"
              placeholder="오늘의 이야기를 써주세요"
              required
              class="notebook-textarea"
            ></textarea>

            <div class="sticker-layer">
              <img
                v-for="(sticker, i) in stickers"
                :key="i"
                :src="sticker.url"
                draggable="false"
                class="sticker"
                :class="{ selected: selectedIndex === i }"
                :style="{
                  left: sticker.x + 'px',
                  top: sticker.y + 'px',
                  width: sticker.width + 'px',
                  height: sticker.height + 'px'
                }"
                @mousedown="(e) => startDrag(i, e)"
                @click.stop="selectSticker(i)"
              />
            </div>
          </div>

          <div class="sticker-toolbar">
            <button class="upload-btn" @click="showStickerModal = true">🧸 스티커 추가</button>
            <label class="upload-btn">
              📷 사진 추가
              <input type="file" accept="image/*" @change="handlePhotoUpload" hidden />
            </label>
          </div>

          <div v-if="showStickerModal" class="sticker-modal">
            <div class="sticker-modal-inner">
              <div class="sticker-option" v-for="src in stickerOptions" :key="src">
                <img :src="src" @click="addSticker(src); showStickerModal = false" />
              </div>
              <button @click="showStickerModal = false" class="close-btn">닫기</button>
            </div>
          </div>

          <button type="submit" class="submit-btn">등록하기</button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const roomId = Number(route.params.roomId)
const loginUserId = 1

const title = ref('')
const content = ref('')
const stickers = ref([])
const selectedIndex = ref(null)
const showStickerModal = ref(false)

const stickerOptions = [
  '/src/assets/stickers/heart.png',
  '/src/assets/stickers/star.png',
  '/src/assets/stickers/rabbit.png'
]

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
const startDrag = (index, event) => {
  event.preventDefault()
  const sticker = stickers.value[index]
  dragging.value = {
    index,
    startX: event.clientX,
    startY: event.clientY,
    origX: sticker.x,
    origY: sticker.y
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
  const sticker = stickers.value[index]
  const maxX = wrapper.offsetWidth - sticker.width
  const maxY = wrapper.offsetHeight - sticker.height

  stickers.value[index].x = Math.min(Math.max(0, origX + deltaX), maxX)
  stickers.value[index].y = Math.min(Math.max(0, origY + deltaY), maxY)
}

const stopDrag = () => {
  dragging.value = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

const selectSticker = (index) => {
  selectedIndex.value = index
}

const deleteSelected = () => {
  if (selectedIndex.value !== null) {
    stickers.value.splice(selectedIndex.value, 1)
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
      style_layer: JSON.stringify(stickers.value)
    })
    alert('일기 등록 완료!')
    router.push({ name: 'SharedDiaryList', params: { roomId } })
  } catch (err) {
    console.error('등록 실패:', err)
    alert('등록에 실패했습니다.')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

.diary-page { perspective: 1500px; }
.page-flip-enter-active, .page-flip-leave-active {
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}
.page-flip-enter-from { transform: rotateY(-90deg); }
.page-flip-leave-to { transform: rotateY(90deg); }

.write-wrapper {
  max-width: 850px;
  margin: 4rem auto;
  padding: 3rem;
  background-color: #fffce6;
  border-radius: 20px;
  border: 3px dashed #d9c7aa;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Nanum Pen Script', cursive;
  position: relative;
  animation: inkFadeIn 1.2s ease;
}
@keyframes inkFadeIn {
  from { filter: blur(3px); opacity: 0; transform: scale(1.02); }
  to { filter: none; opacity: 1; transform: scale(1); }
}

h2 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #5d3e2f;
}

.write-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title-input {
  font-family: 'Nanum Pen Script', cursive;
  font-size: 1.4rem;
  border: none;
  border-bottom: 2px dashed #c5b496;
  background-color: #fffce6;
  padding: 0.8rem 0.5rem;
}

.textarea-wrapper {
  position: relative;
  border: 1px solid #d9c7aa;
  border-radius: 10px;
  background-color: #fffce6;
  overflow: auto;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.08);
}

.textarea-wrapper::-webkit-scrollbar {
  width: 8px;
}
.textarea-wrapper::-webkit-scrollbar-thumb {
  background-color: #d9c7aa;
  border-radius: 4px;
}
.textarea-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.notebook-textarea {
  font-family: 'Nanum Pen Script', cursive;
  font-size: 1.3rem;
  line-height: 34px;
  padding: 12px 18px;
  min-height: 500px;
  width: 100%;
  resize: vertical;
  border: none;
  background-image: repeating-linear-gradient(to bottom, #fffce6 0px, #fffce6 33px, #d9c7aa 34px);
  background-size: 100% 34px;
  background-position-y: 12px;
  box-sizing: border-box;
  line-break: anywhere;
  outline: none;
}

.sticker-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
}

.sticker {
  position: absolute;
  pointer-events: auto;
  cursor: move;
  z-index: 10;
  user-select: none;
  touch-action: none;
  transition: left 0.1s ease, top 0.1s ease;
  border: 2px dashed transparent;
}

.sticker.selected {
  border: 2px dashed #f06292;
  border-radius: 6px;
}

.sticker-toolbar {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.upload-btn {
  font-size: 1.1rem;
  color: #5d3e2f;
  background-color: #f5eccc;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.upload-btn:hover {
  background-color: #eedfa3;
}

.submit-btn {
  align-self: flex-end;
  background-color: #6f9d6b;
  color: white;
  border: none;
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.submit-btn:hover {
  background-color: #5a8755;
}

.sticker-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fffce6;
  border: 2px solid #d9c7aa;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
}
.sticker-modal-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
.sticker-option img {
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: transform 0.2s;
}
.sticker-option img:hover {
  transform: scale(1.1);
}
.close-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  border: none;
  background-color: #c9a36b;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
</style>
