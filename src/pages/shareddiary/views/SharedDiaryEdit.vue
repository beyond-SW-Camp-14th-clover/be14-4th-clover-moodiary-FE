<template>
    <div class="edit-wrapper">
      <h2 class="edit-title">✏️ 공유 일기 수정하기</h2>
  
      <form @submit.prevent="updateDiary" class="edit-form">
        <input v-model="title" type="text" placeholder="제목을 입력하세요" required class="title-input" />
  
        <div class="textarea-wrapper">
          <textarea
            v-model="content"
            placeholder="내용을 입력하세요"
            required
            class="notebook-textarea"
          ></textarea>
  
          <div class="sticker-layer">
            <div
              v-for="(sticker, i) in stickers"
              :key="i"
              class="sticker-wrapper"
              :style="{ left: sticker.x + 'px', top: sticker.y + 'px', width: sticker.width + 'px', height: sticker.height + 'px' }"
            >
              <img
                :src="sticker.url"
                class="sticker"
                draggable="false"
              />
            </div>
          </div>
        </div>
  
        <div class="submit-wrapper">
          <button type="submit" class="submit-btn">수정 완료</button>
          <button type="button" class="cancel-btn" @click="goBack">취소</button>
        </div>
      </form>
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
  
  // ✅ 기존 데이터 불러오기
  onMounted(async () => {
    try {
      const res = await axios.get(`http://localhost:3001/shared_diaries/${diaryId}`)
      title.value = res.data.title
      content.value = res.data.content
      stickers.value = res.data.style_layer ? JSON.parse(res.data.style_layer) : []
    } catch (error) {
      console.error('기존 일기 불러오기 실패', error)
      alert('일기 데이터를 불러오는데 실패했습니다.')
      router.push(`/shareddiary/${roomId}`)
    }
  })
  
  // ✅ 수정 요청
  const updateDiary = async () => {
    try {
      await axios.put(`http://localhost:3001/shared_diaries/${diaryId}`, {
        title: title.value,
        content: content.value,
        style_layer: JSON.stringify(stickers.value),
      })
      alert('수정 완료!')
      router.push(`/shareddiary/${roomId}/detail/${diaryId}`)
    } catch (error) {
      console.error('수정 실패', error)
      alert('수정에 실패했습니다.')
    }
  }
  
  // ✅ 취소하기
  const goBack = () => {
    router.push(`/shareddiary/${roomId}/detail/${diaryId}`)
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
  