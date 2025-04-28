<template>
    <div class="diary-page">
      <transition name="page-flip" mode="out-in">
        <div key="edit" class="write-wrapper">
          <h2 class="today-title">✍️ 일기 수정</h2>
  
          <form class="write-form">
            <div class="title-section">
              <input v-model="title" type="text" placeholder="제목을 입력하세요" required class="title-input" />
              <div class="title-buttons">
                <button type="button" class="upload-btn" @click="showStickerModal = true">🧸 스티커 추가</button>
                <button type="button" class="upload-btn" @click="triggerFileInput">📷 사진 추가</button>
                <input type="file" ref="fileInput" accept="image/*" @change="handlePhotoUpload" hidden />
              </div>
            </div>
  
            <div class="textarea-wrapper">
              <textarea
                v-model="content"
                placeholder="오늘의 이야기를 써주세요"
                required
                class="notebook-textarea"
              ></textarea>
  
              <div class="sticker-layer">
                <div
                  v-for="(sticker, i) in stickers"
                  :key="i"
                  class="sticker-wrapper"
                  :style="{ left: sticker.x + 'px', top: sticker.y + 'px', width: sticker.width + 'px', height: sticker.height + 'px', zIndex: i }"
                >
                  <img
                    :src="sticker.url"
                    draggable="false"
                    class="sticker"
                    :class="{ selected: selectedIndex === i }"
                    @mousedown="(e) => startDrag(i, e)"
                    @click.stop="selectSticker(i)"
                  />
                  <div v-if="selectedIndex === i" class="resize-handle" @mousedown.stop="startResize(i, $event)"></div>
                </div>
              </div>
            </div>
  
            <div class="sticker-toolbar">
              <button type="button" class="submit-btn" @click="confirmEdit">수정 완료</button>
              <button type="button" class="submit-btn" @click="cancelEdit">취소</button>
            </div>
          </form>
  
          <div v-if="showStickerModal" class="sticker-modal">
            <div class="sticker-modal-inner">
              <div class="sticker-option" v-for="src in stickerOptions" :key="src">
                <img :src="src" @click="addSticker(src); showStickerModal = false" />
              </div>
              <button @click="showStickerModal = false" class="close-btn">닫기</button>
            </div>
          </div>
  
          <RegistCheck
            :show="showRegistModal"
            title="일기 수정"
            message="정말로 수정하시겠습니까?"
            @confirm="submitEdit"
            @cancel="showRegistModal = false"
          />
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
  const diaryId = Number(route.params.diaryId)
  
  const title = ref('')
  const content = ref('')
  const stickers = ref([])
  const selectedIndex = ref(null)
  const showStickerModal = ref(false)
  const fileInput = ref(null)
  const showRegistModal = ref(false)
  
  const stickerOptions = [
    '/src/assets/stickers/heart.png',
    '/src/assets/stickers/star.png',
    '/src/assets/stickers/rabbit.png'
  ]
  
  onMounted(async () => {
    const res = await axios.get(`http://localhost:3001/shared_diaries/${diaryId}`)
    title.value = res.data.title
    content.value = res.data.content
    if (res.data.style_layer) {
      stickers.value = JSON.parse(res.data.style_layer)
    }
  })
  
  const triggerFileInput = () => { fileInput.value?.click() }
  const addSticker = (url) => { stickers.value.push({ url, x: 100, y: 100, width: 80, height: 80, type: 'sticker' }) }
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      stickers.value.push({ url: reader.result, x: 100, y: 100, width: 140, height: 140, type: 'photo' })
    }
    reader.readAsDataURL(file)
  }
  
  let dragging = ref(null)
  let resizing = ref(null)
  
  const startDrag = (index, event) => {
    event.preventDefault()
    dragging.value = { index, startX: event.clientX, startY: event.clientY, origX: stickers.value[index].x, origY: stickers.value[index].y }
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
    resizing.value = { index, startX: event.clientX, startY: event.clientY, origWidth: stickers.value[index].width, origHeight: stickers.value[index].height }
    document.addEventListener('mousemove', onResize)
    document.addEventListener('mouseup', stopDrag)
  }
  
  const onResize = (event) => {
    if (!resizing.value) return
    const { index, startX, startY, origWidth, origHeight } = resizing.value
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY
    stickers.value[index].width = Math.max(30, origWidth + deltaX)
    stickers.value[index].height = Math.max(30, origHeight + deltaY)
  }
  
  const confirmEdit = () => { showRegistModal.value = true }
  
  const submitEdit = async () => {
    try {
      await axios.patch(`http://localhost:3001/shared_diaries/${diaryId}`, {
        title: title.value,
        content: content.value,
        style_layer: JSON.stringify(stickers.value)
      })
      alert('수정 완료!')
      router.push({ name: 'SharedDiaryDetail', params: { roomId, diaryId } })
    } catch (error) {
      console.error(error)
      alert('수정 실패')
    }
  }
  
  const cancelEdit = () => {
    if (confirm('수정을 취소하시겠습니까?')) {
      router.push({ name: 'SharedDiaryDetail', params: { roomId, diaryId } })
    }
  }
  </script>
  
  <style scoped>
  .edit-wrapper {
    max-width: 850px;
    margin: 4rem auto;
    padding: 3rem;
    background-color: #fffbe6;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    font-family: 'Nanum Pen Script', cursive;
  }
  
  .edit-title {
    font-size: 2.2rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #5d3e2f;
  }
  
  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .title-input {
    font-family: 'Nanum Pen Script', cursive;
    font-size: 1.5rem;
    border: none;
    border-bottom: 2px dashed #c5b496;
    background: transparent;
    padding: 0.5rem 0;
    outline: none;
  }
  
  .textarea-wrapper {
    position: relative;
    border: 1px solid #d9c7aa;
    border-radius: 10px;
    background-color: #fffce6;
    overflow: auto;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.05);
  }
  
  .notebook-textarea {
    font-family: 'Nanum Pen Script', cursive;
    font-size: 1.4rem;
    line-height: 38px;
    padding: 2rem;
    min-height: 500px;
    background: repeating-linear-gradient(to bottom, #fffce6 0px, #fffce6 33px, #d9c7aa 34px);
    background-size: 100% 34px;
    background-position-y: 12px;
    border: none;
    resize: vertical;
    outline: none;
    color: #6b4c3b;
  }
  
  .sticker-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  .sticker-wrapper {
    position: absolute;
  }
  
  .sticker {
    width: 100%;
    height: 100%;
    user-select: none;
  }
  
  .submit-wrapper {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .submit-btn, .cancel-btn {
    background-color: #f5eccc;
    border: 2px solid #a8906b;
    border-radius: 10px;
    padding: 0.7rem 1.5rem;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 1.3rem;
    color: #5d3e2f;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .submit-btn:hover, .cancel-btn:hover {
    background-color: #eedfa3;
    transform: translateY(-3px);
  }
  </style>
  