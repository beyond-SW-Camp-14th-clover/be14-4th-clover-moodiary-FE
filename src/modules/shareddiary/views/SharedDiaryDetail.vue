<template>
    <div class="detail-wrapper">
      <h2 class="detail-title">{{ diary?.title }}</h2>
  
      <div class="textarea-wrapper">
        <div class="notebook-textarea">
          <p v-for="line in contentLines" :key="line" class="diary-line">{{ line }}</p>
          <div class="sticker-layer">
            <img
              v-for="(sticker, i) in stickers"
              :key="i"
              :src="sticker.url"
              class="sticker"
              :style="{
                left: sticker.x + 'px',
                top: sticker.y + 'px',
                width: sticker.width + 'px',
                height: sticker.height + 'px'
              }"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const diaryId = Number(route.params.diaryId)
  
  const diary = ref(null)
  const stickers = ref([])
  const contentLines = ref([])
  
  onMounted(async () => {
    const res = await axios.get(`http://localhost:3001/shared_diaries/${diaryId}`)
    diary.value = res.data
  
    if (diary.value?.style_layer) {
      try {
        stickers.value = JSON.parse(diary.value.style_layer)
      } catch (e) {
        console.error('스티커 레이어 파싱 실패', e)
      }
    }
  
    if (diary.value?.content) {
      contentLines.value = diary.value.content.split('\n')
    }
  })
  </script>
  
  <style scoped>
  .detail-wrapper {
    max-width: 800px;
    margin: 4rem auto;
    padding: 2rem;
    background-color: #fffce6;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    font-family: 'Nanum Pen Script', cursive;
  }
  
  .detail-title {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #5d3e2f;
  }
  
  .textarea-wrapper {
    position: relative;
    border: 1px solid #d9c7aa;
    border-radius: 10px;
    background-color: #fffce6;
    overflow: hidden;
  }
  
  .notebook-textarea {
    position: relative;
    padding: 2rem;
    min-height: 500px;
    background-image: repeating-linear-gradient(
      to bottom,
      #fffce6 0px,
      #fffce6 33px,
      #d9c7aa 34px
    );
    background-size: 100% 34px;
    background-position-y: 12px;
    font-size: 1.3rem;
    line-height: 34px;
  }
  
  .diary-line {
    margin: 0;
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
    pointer-events: none;
    user-select: none;
  }
  </style>
  