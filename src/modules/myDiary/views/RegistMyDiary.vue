<template>
    <div class="diary-page">
      <transition name="page-flip" mode="out-in">
        <div key="diary" class="write-wrapper">
          <h2>✍️ {{ selectedDate.getFullYear() }} {{ selectedDate.getMonth() + 1 }}월 {{ selectedDate.getDate() }}일 {{ ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][selectedDate.getDay()] }}, 오늘의 일기</h2>
            
          <form @submit.prevent="submitDiary" class="write-form">
            <div class="title-section">
              <input v-model="title" type="text" placeholder="제목을 입력하세요" required class="title-input" />
              <div class="title-buttons">
                <button type="button" class="upload-btn" @click="showStickerModal = true">🧸 스티커 추가</button>
                <button type="button" class="upload-btn" @click="triggerFileInput">📷 사진 추가</button>
                <input type="file" ref="fileInput" accept="image/*" @change="handlePhotoUpload" hidden />
              </div>
            </div>
  
            <div class="textarea-wrapper">
              <div class="emotion-tag-header">
                <h3>감정 태그: </h3>
                <div class="emotion-tags">
                  <span 
                    v-for="(tag, index) in hashtags" 
                    :key="index" 
                    class="emotion-tag"
                    @click="removeHashtag(index)"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
              <textarea
                v-model="content"
                placeholder="오늘의 이야기를 써주세요"
                required
                class="notebook-textarea"
                @input="handleContentInput"
                @compositionstart="handleCompositionStart"
                @compositionend="handleCompositionEnd"
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
                  <div
                    v-if="selectedIndex === i"
                    class="resize-handle"
                    @mousedown.stop="startResize(i, $event)"
                  ></div>
                </div>
              </div>
            </div>
  
            <div v-if="showStickerModal" class="sticker-modal">
              <div class="sticker-modal-inner">
                <div class="sticker-option" v-for="src in stickerOptions" :key="src">
                  <img :src="src" @click="addSticker(src); showStickerModal = false" />
                </div>
                <button @click="showStickerModal = false" class="close-btn">닫기</button>
              </div>
            </div>
  
            <div class="sticker-toolbar">
              <button type="button" class="submit-btn" @click="showRegistModal = true">등록</button>
              <button type="button" class="submit-btn" @click="cancelDiary">취소</button>
            </div>
          </form>
        </div>
      </transition>

      <ConfirmCheck
        :show="showConfirmModal"
        title="일기 확정"
        message="정말로 일기를 확정하시겠습니까?"
        @confirm="handleConfirm"
        @cancel="showConfirmModal = false"
      />

      <RegistCheck
        :show="showRegistModal"
        title="일기 등록"
        message="정말로 등록하시겠습니까?"
        @confirm="async () => {
          await submitDiary();
          showRegistModal = false;
          router.push({ name: 'MonthlyDiary' });
        }"
        @cancel="showRegistModal = false"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  import ConfirmCheck from '../components/ConfirmCheck.vue'
  import RegistCheck from '../components/RegistCheck.vue'
  import { useAuthStore } from '@/stores/auth'
  
  const route = useRoute()
  const router = useRouter()
  const roomId = Number(route.params.roomId)
  const authStore = useAuthStore()
  
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
    '/src/assets/stickers/rabbit.png',
    '/src/assets/stickers/smpet.png',
    '/src/assets/stickers/img1_sticker_3.png',
    '/src/assets/stickers/img1_sticker_4.png',
    '/src/assets/stickers/img1_sticker_5.png',
    '/src/assets/stickers/img1_sticker_6.png',
    '/src/assets/stickers/img1_sticker_7.png',
    '/src/assets/stickers/img1_sticker_9.png',
    '/src/assets/stickers/img1_sticker_10.png',
    '/src/assets/stickers/img1_sticker_14.png',
    '/src/assets/stickers/img1_sticker_16.png',
    '/src/assets/stickers/img1_sticker_17.png',
    '/src/assets/stickers/img1_sticker_22.png',
    '/src/assets/stickers/img1_sticker_23.png',
    '/src/assets/stickers/img1_sticker_24.png',
    '/src/assets/stickers/img1_sticker_27.png',
    '/src/assets/stickers/img1_sticker_28.png',
    '/src/assets/stickers/img1_sticker_29.png',
    '/src/assets/stickers/img1_sticker_30.png',
    '/src/assets/stickers/img1_sticker_31.png',
    '/src/assets/stickers/img1_sticker_32.png',
    '/src/assets/stickers/img1_sticker_33.png',
    '/src/assets/stickers/img1_sticker_34.png',
    '/src/assets/stickers/img1_sticker_35.png',
    '/src/assets/stickers/img1_sticker_36.png',
    '/src/assets/stickers/img1_sticker_38.png',
    '/src/assets/stickers/img1_sticker_41.png',
    '/src/assets/stickers/img1_sticker_42.png',
    '/src/assets/stickers/img1_sticker_45.png',
    '/src/assets/stickers/img1_sticker_57.png',
    '/src/assets/stickers/img1_sticker_81.png',
    '/src/assets/stickers/img1_sticker_83.png',
    '/src/assets/stickers/img1_sticker_85.png',
    '/src/assets/stickers/img1_sticker_86.png',
    '/src/assets/stickers/img1_sticker_87.png',
    '/src/assets/stickers/img2_sticker_3.png',
    '/src/assets/stickers/img2_sticker_4.png',
    '/src/assets/stickers/img2_sticker_19.png',
    '/src/assets/stickers/img2_sticker_20.png',
    '/src/assets/stickers/img2_sticker_21.png',
    '/src/assets/stickers/img2_sticker_38.png',
    '/src/assets/stickers/img2_sticker_51.png',
    '/src/assets/stickers/img2_sticker_52.png',
    '/src/assets/stickers/img2_sticker_53.png',
    '/src/assets/stickers/img2_sticker_60.png',
    '/src/assets/stickers/img2_sticker_62.png',
    '/src/assets/stickers/img2_sticker_63.png',
    '/src/assets/stickers/img2_sticker_64.png',
    '/src/assets/stickers/img2_sticker_69.png',
    '/src/assets/stickers/img2_sticker_70.png',
    '/src/assets/stickers/img3_sticker_0.png',
    '/src/assets/stickers/img3_sticker_2.png',
    '/src/assets/stickers/img3_sticker_5.png',
    '/src/assets/stickers/img3_sticker_11.png',
    '/src/assets/stickers/img3_sticker_13.png',
    '/src/assets/stickers/img3_sticker_14.png',
    '/src/assets/stickers/img3_sticker_17.png',
    '/src/assets/stickers/img3_sticker_18.png',
    '/src/assets/stickers/img3_sticker_22.png',
    '/src/assets/stickers/img3_sticker_23.png',
    '/src/assets/stickers/img3_sticker_24.png',
    '/src/assets/stickers/img3_sticker_25.png',
    '/src/assets/stickers/img3_sticker_27.png',
    '/src/assets/stickers/img3_sticker_30.png',
    '/src/assets/stickers/img3_sticker_31.png',
    '/src/assets/stickers/img3_sticker_33.png',
    '/src/assets/stickers/img3_sticker_34.png',
    '/src/assets/stickers/img3_sticker_35.png',
    '/src/assets/stickers/img3_sticker_37.png',
    '/src/assets/stickers/img3_sticker_40.png',
    '/src/assets/stickers/img3_sticker_41.png',
    '/src/assets/stickers/img3_sticker_43.png',
    '/src/assets/stickers/img3_sticker_45.png',
    '/src/assets/stickers/img3_sticker_48.png',
    '/src/assets/stickers/img3_sticker_49.png',
    '/src/assets/stickers/img3_sticker_50.png',
    '/src/assets/stickers/img3_sticker_51.png',
    '/src/assets/stickers/img3_sticker_52.png',
    '/src/assets/stickers/img3_sticker_53.png',
    '/src/assets/stickers/img3_sticker_54.png',
    '/src/assets/stickers/img4_sticker_1.png',
    '/src/assets/stickers/img4_sticker_2.png',
    '/src/assets/stickers/img4_sticker_3.png',
    '/src/assets/stickers/img4_sticker_5.png',
    '/src/assets/stickers/img4_sticker_6.png',
    '/src/assets/stickers/img4_sticker_8.png',
    '/src/assets/stickers/img4_sticker_9.png',
    '/src/assets/stickers/img4_sticker_10.png',
    '/src/assets/stickers/img4_sticker_11.png',
    '/src/assets/stickers/img4_sticker_13.png',
    '/src/assets/stickers/img4_sticker_14.png',
    '/src/assets/stickers/img4_sticker_15.png',
    '/src/assets/stickers/img4_sticker_17.png',
    '/src/assets/stickers/img4_sticker_18.png',
    '/src/assets/stickers/img4_sticker_19.png',
    '/src/assets/stickers/img4_sticker_21.png',
    '/src/assets/stickers/img4_sticker_22.png',
    '/src/assets/stickers/img4_sticker_23.png',
    '/src/assets/stickers/img4_sticker_24.png',
    '/src/assets/stickers/img4_sticker_25.png',
    '/src/assets/stickers/img4_sticker_26.png',
    '/src/assets/stickers/img4_sticker_27.png',
    '/src/assets/stickers/img4_sticker_28.png',
    '/src/assets/stickers/img4_sticker_29.png',
    '/src/assets/stickers/img4_sticker_30.png',
    '/src/assets/stickers/img4_sticker_31.png',
    '/src/assets/stickers/img4_sticker_32.png',
    '/src/assets/stickers/img4_sticker_33.png',
    '/src/assets/stickers/img4_sticker_34.png',
    '/src/assets/stickers/img4_sticker_35.png',
    '/src/assets/stickers/img4_sticker_36.png',
    '/src/assets/stickers/img4_sticker_37.png',
    '/src/assets/stickers/img4_sticker_38.png',
    '/src/assets/stickers/img4_sticker_39.png',
    '/src/assets/stickers/img4_sticker_40.png',
    '/src/assets/stickers/img4_sticker_41.png',
    '/src/assets/stickers/img4_sticker_42.png'
  ]
  
  const triggerFileInput = () => {
    fileInput.value?.click()
  }
  
  const addSticker = (url) => {
    stickers.value.push({ url, x: 100, y: 100, width: 80, height: 80, type: 'sticker' })
  }
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 프리뷰용으로만 blob URL 사용 (실제 저장 X)
    const previewUrl = URL.createObjectURL(file);

    stickers.value.push({
      url: previewUrl,
      x: 100,
      y: 100,
      width: 140,
      height: 140,
      type: 'photo'
    });

    // 실제 파일은 formData에 image로 전달됨 → 서버에서 S3 업로드 후 DB 저장
  };
  
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
      checkHashtag(e.target.value)
    }
  }

  const handleCompositionStart = () => {
    isComposing.value = true
  }

  const handleCompositionEnd = (e) => {
    isComposing.value = false
    checkHashtag(e.target.value)
  }

  const checkHashtag = (text) => {
    if (isComposing.value) return

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
      const now = new Date();
      const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const koreaISOString = koreaTime.toISOString().slice(0, 23);

      // 1. styleLayer → JSON 문자열
      const styleLayer = JSON.stringify({
        bg: "",
        sticker: stickers.value
      });

      // 2. FormData 생성
      const formData = new FormData();
      const dto = {
        title: title.value,
        content: content.value,
        createdAt: koreaISOString,
        isDeleted: 'N',
        isConfirmed: isConfirmed.value ? 'Y' : 'N',
        styleLayer: styleLayer,
        userId: authStore.userId,
        tags: hashtags.value
      };
      formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));

      // 3. 이미지 선택된 경우 추가
      if (fileInput.value?.files[0]) {
        formData.append("image", fileInput.value.files[0]);
      }

      const response = await axios.post('/mydiary/regist', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 201) {
        console.log('✅ 일기 등록 성공:', response.data);
        router.push({ name: 'MonthlyDiary' });
      } else if (response.status === 409) {
        alert('오늘 이미 일기를 작성하셨습니다.');
      } else {
        throw new Error('서버 응답 오류');
      }
    } catch (error) {
      console.error('일기 등록 중 오류:', error);
      alert('일기 등록 실패');
    }
  };
    
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
  </script>
    
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');
  
  .diary-page { 
    perspective: 1500px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    box-sizing: border-box;
  }
  .page-flip-enter-active, .page-flip-leave-active { transition: transform 0.6s ease; transform-style: preserve-3d; }
  .page-flip-enter-from { transform: rotateY(-90deg); }
  .page-flip-leave-to { transform: rotateY(90deg); }
  
  .write-wrapper {
    max-width: 850px;
    width: 100%;
    padding: 3rem;
    background-color: #fffce6;
    border-radius: 20px;
    border: 3px dashed #d9c7aa;
    font-family: 'Ownglyph PDH', sans-serif; 
    font-size: 18px; 
    font-weight: 200; 
    color: #535353;
    position: relative;
    animation: inkFadeIn 1.2s ease;
    margin-top: -150px;
  }
  @keyframes inkFadeIn {
    from { filter: blur(3px); opacity: 0; transform: scale(1.02); }
    to { filter: none; opacity: 1; transform: scale(1); }
  }
  
  .write-form { display: flex; flex-direction: column; gap: 1.5rem; }
  .title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .title-input {
    flex: 1;
    font-family: 'Ownglyph PDH', sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #535353;
    border: none;
    border-bottom: 2px dashed #c5b496;
    background-color: #fffce6;
    padding: 0.8rem 0.5rem;
    outline: none;
  }
  
  .title-input:focus {
    outline: none;
    border-bottom: 2px dashed #c5b496;
  }
  
  .title-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .upload-btn {
    background-color: #f5eccc;
    border-radius: 10px;
    padding: 0.5rem 0.8rem;
    cursor: pointer;
    white-space: nowrap;
    font-size: 14px;
    min-width: 90px;
    color: #7a5c3d;
    font-family: 'Ownglyph PDH', sans-serif;
    font-weight: 400;
  }
  
  .textarea-wrapper {
    position: relative; 
    border: 1px solid #d9c7aa; 
    border-radius: 10px; 
    background-color: #fffce6; 
    overflow: auto; 
    box-shadow: inset 0 0 8px rgba(0,0,0,0.08); 
  }
  
  .emotion-tag-header {
    display: flex;
    align-items: flex-start;
    padding: 8px 18px;
    min-height: 34px;
    background: #fffce6;
    border-bottom: 1px solid #d9c7aa;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .emotion-tag-header h3 {
    margin: 0;
    font-family: 'Ownglyph PDH', sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #535353;
    line-height: 34px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .emotion-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
    flex: 1;
    min-height: 34px;
  }
  
  .emotion-tag {
    background-color: #E2EFFF;
    color: #535353;
    padding: 0 12px;
    border-radius: 0px;
    font-size: 14px;
    font-family: 'Ownglyph PDH', sans-serif;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    min-width: 62px;
    width: fit-content;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .emotion-tag:hover {
    background-color: #b3d6ff;
  }
  
  .notebook-textarea {
    font-family: 'Ownglyph PDH', sans-serif; 
    font-size: 18px; 
    font-weight: 400; 
    color: #535353;
    line-height: 34px; 
    padding: 0 18px 12px 18px; 
    min-height: 500px; 
    width: 100%;
    background: repeating-linear-gradient(to bottom, #fffce6 0px, #fffce6 33px, #d9c7aa 34px);
    background-size: 100% 34px; 
    background-position-y: 0; 
    box-sizing: border-box; 
    border: none; 
    resize: vertical; 
    outline: none;
  }
  
  .sticker-layer { position: absolute; top: 0; left: 0; pointer-events: none; width: 100%; height: 100%; }
  .sticker-wrapper { position: absolute; pointer-events: auto; }
  .sticker { width: 100%; height: 100%; user-select: none; touch-action: none; cursor: move; }
  .resize-handle {
    width: 12px; height: 12px;
    background-color: #6f9d6b;
    border-radius: 50%;
    position: absolute;
    right: -6px; bottom: -6px;
    cursor: nwse-resize;
    pointer-events: auto;
  }
  
  .sticker.selected { outline: 2px dashed #f06292; }
  .sticker-toolbar { 
    display: flex; 
    gap: 1rem; 
    margin-top: 1.5rem; 
    justify-content: center;
    width: 100%;
  }
  .submit-btn {
    all: unset;
    width: 122px;
    height: 46px;
    background-color: #E9D2AF;
    color: #535353;
    border-radius: 10px;
    font-family: 'Ownglyph PDH', sans-serif;
    font-size: 18px;
    font-weight: 400;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    align-self: flex-end;
  }
  .submit-btn:hover {
    background-color: #d1b07a;
  }
  
  .sticker-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fffce6; border: 2px solid #d9c7aa; border-radius: 12px; padding: 2rem; z-index: 100; }
  .sticker-modal-inner { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; align-items: center; }
  .sticker-option img { width: 60px; height: 60px; cursor: pointer; }
  .sticker-option img:hover { transform: scale(1.1); }
  .close-btn { margin-top: 1rem; background-color: #c9a36b; color: white; border-radius: 8px; padding: 0.5rem 1.2rem; }
  
  .confirm-btn {
    background-color: #EFEFED !important;
  }
  
  .confirm-btn.confirmed {
    background-color: #E9D2AF !important;
  }
  </style>
  
  