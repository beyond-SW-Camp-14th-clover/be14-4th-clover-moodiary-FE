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