<template>
  <div class="write-wrapper">
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
      </div>

      <button type="submit" class="submit-btn">등록하기</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const roomId = Number(route.params.roomId)
const loginUserId = 1

const title = ref('')
const content = ref('')

const submitDiary = async () => {
  try {
    await axios.post('http://localhost:3001/shared_diaries', {
      title: title.value,
      content: content.value,
      created_at: new Date().toISOString(),
      is_deleted: 'N',
      fixed_state: 'Y',
      shared_diary_room_id: roomId,
      user_id: loginUserId
    })

    alert('일기 등록 완료!')
    router.push({ name: 'SharedDiaryList', params: { roomId } })
  } catch (error) {
    console.error('등록 실패:', error)
    alert('등록에 실패했습니다.')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

.write-wrapper {
  max-width: 850px;
  margin: 4rem auto;
  padding: 3rem;
  background-color: #fffce6;
  border-radius: 20px;
  border: 3px dashed #d9c7aa; /* ✨ 스티치 효과 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Nanum Pen Script', cursive;
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
  border: 1px solid #d9c7aa;
  border-radius: 10px;
  background-color: #fffce6;
  overflow: auto;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.08); /* ✨ 내부 그림자 */
}

/* 커스텀 스크롤바 */
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
  background-image: repeating-linear-gradient(
    to bottom,
    #fffce6 0px,
    #fffce6 33px,
    #d9c7aa 34px
  );
  background-size: 100% 34px;
  background-position-y: 12px; /* 패딩과 맞춤 */
  box-sizing: border-box;
  line-break: anywhere;
  overflow: auto;
  outline: none;
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
</style>
