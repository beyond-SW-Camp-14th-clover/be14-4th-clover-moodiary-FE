<template>
  <div id="app" class="container">
    <main class="content">
      <router-view @select-pet="handleSelectPet" />
    </main>
    <MP />
    <Pets ref="petsComponent" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MP from '@/components/common/MusicPlayer.vue'
import Pets from '@/components/Pets.vue'

// Pets 컴포넌트에 접근할 수 있도록 ref 사용
const petsComponent = ref(null)

// MyPagePet.vue에서 emit된 select-pet 이벤트를 받아 Pets 컴포넌트에 전달
const handleSelectPet = (petId) => {
  petsComponent.value?.changePet?.(petId)
}

// 화면 높이 설정
function setRealVh() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

setRealVh()
window.addEventListener('resize', setRealVh)
</script>

<style scoped>
.container {
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  background-color: var(--color-beige);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
